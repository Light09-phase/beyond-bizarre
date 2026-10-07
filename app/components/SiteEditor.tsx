'use client';

// ============================================================================
// SITE-WIDE EDITOR
// Works like the Abilities edit mode, but for every tab (Homepage, Mechanics,
// Background, header, anything you add later) with NO changes to those files.
//
//  Viewers : /data/site-content.json is fetched and applied on top of the page.
//  Owner   : ?edit=1 + password (shared with Abilities). Click any text, image,
//            video or link -> edit it. Changes are a draft in this browser only.
//            "Export" downloads site-content.json -> put it in public/data/ and
//            push to publish.
//
// Overrides are keyed by the ORIGINAL text / file path, so one edit changes
// every place that exact string appears. Add data-no-site-edit to any element
// to make it (and everything inside) uneditable.
// ============================================================================

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { EDIT_FLAG_KEY, getStandsToolbar, readEditFlag, subscribeStandsToolbar } from '@/app/lib/editAuth';

interface Overrides {
  text: Record<string, string>; // original text  -> new text
  src: Record<string, string>;  // original src   -> new src   (img / video)
  href: Record<string, string>; // original href  -> new href  (links)
}

const EMPTY: Overrides = { text: {}, src: {}, href: {} };
const DRAFT_KEY = 'bb-site-draft-v1';
const PUBLISHED_URL = '/data/site-content.json';
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'INPUT', 'SELECT', 'OPTION', 'TITLE']);
const SRC_SEL = 'img[src],video[src],source[src]';

const has = (m: Record<string, string>, k: string) => Object.prototype.hasOwnProperty.call(m, k);
const getOr = (m: Record<string, string>, k: string) => (has(m, k) ? m[k] : k);
const isIgnored = (el: Element | null) => !!el?.closest('[data-site-editor-ignore],[data-no-site-edit]');
const count = (o: Overrides) => Object.keys(o.text).length + Object.keys(o.src).length + Object.keys(o.href).length;

function normalize(j: any): Overrides {
  const pick = (o: any): Record<string, string> =>
    o && typeof o === 'object'
      ? (Object.fromEntries(Object.entries(o).filter(([, v]) => typeof v === 'string')) as Record<string, string>)
      : {};
  return { text: pick(j?.text), src: pick(j?.src), href: pick(j?.href) };
}

// ----------------------------------------------------------------------------
// Applying overrides to the live DOM.
// We remember each node's ORIGINAL value so edits can be reverted, and so that
// when React rewrites a node we treat the new value as the new original.
// ----------------------------------------------------------------------------
const textRec = new WeakMap<Text, { orig: string; shown: string }>();
const attrRec = new WeakMap<Element, Record<string, { orig: string; shown: string }>>();

const originalText = (n: Text) => {
  const cur = n.nodeValue ?? '';
  const r = textRec.get(n);
  return r && cur === r.shown ? r.orig : cur;
};
const originalAttr = (el: Element, attr: string) => {
  const cur = el.getAttribute(attr) ?? '';
  const r = attrRec.get(el)?.[attr];
  return r && cur === r.shown ? r.orig : cur;
};

function applyText(node: Text, map: Record<string, string>) {
  const parent = node.parentElement;
  if (!parent || SKIP_TAGS.has(parent.tagName) || isIgnored(parent)) return;
  const cur = node.nodeValue ?? '';
  const orig = originalText(node);
  const key = orig.trim();
  let shown = orig;
  if (key && has(map, key)) {
    const lead = orig.match(/^\s*/)![0];
    const trail = orig.match(/\s*$/)![0];
    shown = lead + map[key] + trail;
  }
  if (cur !== shown) node.nodeValue = shown;
  textRec.set(node, { orig, shown });
}

function applyAttr(el: Element, attr: string, map: Record<string, string>) {
  if (isIgnored(el) || !el.hasAttribute(attr)) return;
  const cur = el.getAttribute(attr) as string;
  const orig = originalAttr(el, attr);
  const shown = has(map, orig) ? map[orig] : orig;
  if (cur !== shown) {
    el.setAttribute(attr, shown);
    if (el.tagName === 'SOURCE') (el.parentElement as HTMLMediaElement | null)?.load?.();
  }
  const recs = attrRec.get(el) ?? {};
  recs[attr] = { orig, shown };
  attrRec.set(el, recs);
}

function applyElementAttrs(el: Element, ov: Overrides) {
  if (el.matches(SRC_SEL)) applyAttr(el, 'src', ov.src);
  if (el.matches('a[href]')) applyAttr(el, 'href', ov.href);
}

function applyTree(root: Node, ov: Overrides) {
  if (root.nodeType === Node.TEXT_NODE) return applyText(root as Text, ov.text);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (isIgnored(el)) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = walker.nextNode())) applyText(n as Text, ov.text);
  applyElementAttrs(el, ov);
  el.querySelectorAll(`${SRC_SEL},a[href]`).forEach((e) => applyElementAttrs(e, ov));
}

// ----------------------------------------------------------------------------
// Working out what the owner clicked on
// ----------------------------------------------------------------------------
interface Target {
  kind: 'text' | 'media';
  rect: DOMRect;
  orig: string;                                 // original text, or original src
  node?: Text;
  link?: { el: Element; orig: string };         // text/image sitting inside an <a>
  mediaTag?: string;
}

function textNodeAt(x: number, y: number, hit: Element): Text | null {
  const usable = (n: Node | null | undefined): n is Text =>
    !!n && n.nodeType === Node.TEXT_NODE && !!(n.nodeValue || '').trim() &&
    !!n.parentElement && !SKIP_TAGS.has(n.parentElement.tagName) && !isIgnored(n.parentElement);

  const d = document as any;
  let node: Node | null = null;
  if (d.caretPositionFromPoint) node = d.caretPositionFromPoint(x, y)?.offsetNode ?? null;
  else if (d.caretRangeFromPoint) node = d.caretRangeFromPoint(x, y)?.startContainer ?? null;

  if (usable(node) && hit.contains(node)) {
    const r = document.createRange();
    r.selectNodeContents(node);
    const b = r.getBoundingClientRect();
    if (x >= b.left - 12 && x <= b.right + 12 && y >= b.top - 12 && y <= b.bottom + 12) return node;
  }
  // Clicked padding of a button / heading etc: use its own text.
  for (const c of Array.from(hit.childNodes)) if (usable(c)) return c;
  return null;
}

// Smallest <img>/<video> under the pointer. Done by geometry (not hit-testing)
// so media sitting under pointer-events-none layers still counts.
function mediaAt(x: number, y: number): HTMLElement | null {
  let best: HTMLElement | null = null;
  let area = Infinity;
  document.querySelectorAll<HTMLElement>('img,video').forEach((el) => {
    if (isIgnored(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || x < r.left || x > r.right || y < r.top || y > r.bottom) return;
    if (!(el.hasAttribute('src') || el.querySelector('source[src]'))) return;
    if (r.width * r.height < area) {
      area = r.width * r.height;
      best = el;
    }
  });
  return best;
}

function resolveTarget(x: number, y: number, hit: Element | null): Target | null {
  if (!hit || isIgnored(hit)) return null;
  const node = textNodeAt(x, y, hit);
  if (node) {
    const r = document.createRange();
    r.selectNodeContents(node);
    const a = node.parentElement?.closest('a[href]') ?? null;
    return {
      kind: 'text',
      node,
      orig: originalText(node),
      rect: r.getBoundingClientRect(),
      link: a ? { el: a, orig: originalAttr(a, 'href') } : undefined,
    };
  }
  const media = mediaAt(x, y);
  if (media) {
    const srcEl = media.hasAttribute('src') ? media : (media.querySelector('source[src]') as HTMLElement);
    const a = media.closest('a[href]');
    return {
      kind: 'media',
      mediaTag: media.tagName.toLowerCase(),
      orig: originalAttr(srcEl, 'src'),
      rect: media.getBoundingClientRect(),
      link: a ? { el: a, orig: originalAttr(a, 'href') } : undefined,
    };
  }
  return null;
}

// ----------------------------------------------------------------------------
// UI
// ----------------------------------------------------------------------------
const inputCls =
  'w-full bg-[#14121a] border border-dashed border-[#3d3423] text-[#e6c278] text-sm px-2 py-1.5 font-mono focus:outline-none focus:border-[#c3a35e]';
const smallBtnCls =
  'px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-[#3d3423] text-[#e6c278] bg-[#14121a] hover:border-[#c3a35e] transition-colors';
const goldBtnCls = 'px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider bg-[#c3a35e] text-black font-bold';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="block text-[10px] font-mono uppercase tracking-widest text-[#8a857a] mb-1">{label}</span>
    {children}
  </label>
);

const EditPanel: React.FC<{
  target: Target;
  ov: Overrides;
  onSave: (v: { text?: string; src?: string; link?: string }) => void;
  onRevert: () => void;
  onClose: () => void;
}> = ({ target, ov, onSave, onRevert, onClose }) => {
  const key = target.orig.trim();
  const [text, setText] = useState(getOr(ov.text, key));
  const [src, setSrc] = useState(getOr(ov.src, target.orig));
  const [link, setLink] = useState(target.link ? getOr(ov.href, target.link.orig) : '');
  const isText = target.kind === 'text';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#0a0a0d] border border-[#c3a35e] p-5 space-y-4 shadow-[0_0_30px_rgba(195,163,94,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#34d399]">
          Edit {isText ? 'text' : target.mediaTag === 'video' ? 'video' : 'image'}
        </div>

        {isText ? (
          <Field label="Text">
            <textarea autoFocus rows={5} className={inputCls} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
        ) : (
          <>
            <Field label={`${target.mediaTag === 'video' ? 'Video' : 'Image'} path or link`}>
              <input autoFocus className={inputCls} value={src} onChange={(e) => setSrc(e.target.value)} />
            </Field>
            {target.mediaTag === 'img' && src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="max-h-40 w-auto border border-[#2a2418] object-contain" />
            )}
          </>
        )}

        {target.link && (
          <Field label="Link URL (this sits inside a link)">
            <input className={inputCls} value={link} onChange={(e) => setLink(e.target.value)} />
          </Field>
        )}

        <p className="text-[10px] font-mono text-[#716c62] leading-relaxed">
          {isText ? 'Changes every place this exact text appears on the site.' : 'Changes every place this file is used.'}
        </p>

        <div className="flex flex-wrap gap-2 justify-end">
          <button type="button" className={smallBtnCls} onClick={onClose}>Cancel</button>
          <button type="button" className={smallBtnCls} onClick={onRevert}>Revert to original</button>
          <button
            type="button"
            className={goldBtnCls}
            onClick={() => onSave({ text, src, link: target.link ? link : undefined })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// MAIN COMPONENT — render once in app/page.tsx
// ----------------------------------------------------------------------------
export default function SiteEditor() {
  const [editMode, setEditMode] = useState(false);
  const [ov, setOv] = useState<Overrides>(EMPTY);
  const [hasDraft, setHasDraft] = useState(false);
  const [picking, setPicking] = useState(true);
  const [target, setTarget] = useState<Target | null>(null);
  const [toast, setToast] = useState('');

  const ovRef = useRef<Overrides>(EMPTY);
  const hoverRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const standsFileRef = useRef<HTMLInputElement>(null);
  // 0 = Stands section not on screen, 1 = on screen, 2 = on screen with a saved draft
  const standsState = useSyncExternalStore(
    subscribeStandsToolbar,
    () => { const t = getStandsToolbar(); return t ? (t.hasDraft ? 2 : 1) : 0; },
    () => 0
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  }, []);

  const commit = useCallback((next: Overrides) => {
    ovRef.current = next;
    setOv(next);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      setHasDraft(true);
    } catch {
      /* storage full or blocked */
    }
    applyTree(document.body, next);
  }, []);

  // Load published (or draft) content, apply it, and keep applying as React re-renders.
  useEffect(() => {
    let cancelled = false;
    const edit = readEditFlag();
    setEditMode(edit);

    (async () => {
      let base: Overrides = EMPTY;
      try {
        const res = await fetch(PUBLISHED_URL, { cache: 'no-store' });
        if (res.ok) base = normalize(await res.json());
      } catch {
        /* no published file yet */
      }
      if (edit) {
        try {
          const raw = localStorage.getItem(DRAFT_KEY);
          if (raw) {
            base = normalize(JSON.parse(raw));
            if (!cancelled) setHasDraft(true);
          }
        } catch {
          /* ignore corrupt draft */
        }
      }
      if (cancelled) return;
      ovRef.current = base;
      setOv(base);
      applyTree(document.body, base);
    })();

    const mo = new MutationObserver((records) => {
      const cur = ovRef.current;
      if (!count(cur)) return;
      for (const r of records) {
        if (r.type === 'childList') r.addedNodes.forEach((n) => applyTree(n, cur));
        else if (r.type === 'characterData') applyTree(r.target, cur);
        else if (r.target instanceof Element) applyElementAttrs(r.target, cur);
      }
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['src', 'href'],
    });

    return () => {
      cancelled = true;
      mo.disconnect();
    };
  }, []);

  // Pick mode: hover outline + click-to-edit (links/buttons won't fire while picking).
  useEffect(() => {
    if (!editMode || !picking) {
      if (hoverRef.current) hoverRef.current.style.display = 'none';
      return;
    }
    const onMove = (e: MouseEvent) => {
      const box = hoverRef.current;
      if (!box) return;
      const t = resolveTarget(e.clientX, e.clientY, e.target as Element);
      if (!t) {
        box.style.display = 'none';
        return;
      }
      Object.assign(box.style, {
        display: 'block',
        left: `${t.rect.left - 2}px`,
        top: `${t.rect.top - 2}px`,
        width: `${t.rect.width + 4}px`,
        height: `${t.rect.height + 4}px`,
      });
    };
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element;
      // Editor UI and anything marked data-no-site-edit (e.g. the stand data,
      // which has its own editor) keep their normal click behaviour.
      if (el.closest('[data-site-editor-ignore],[data-no-site-edit]')) return;
      e.preventDefault();
      e.stopPropagation();
      const t = resolveTarget(e.clientX, e.clientY, el);
      if (t) setTarget(t);
      else flash('Nothing editable there');
    };
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [editMode, picking, flash]);

  const save = (v: { text?: string; src?: string; link?: string }) => {
    if (!target) return;
    const next: Overrides = { text: { ...ov.text }, src: { ...ov.src }, href: { ...ov.href } };
    const set = (m: Record<string, string>, k: string, val: string) => {
      if (val === k) delete m[k];
      else m[k] = val;
    };
    if (target.kind === 'text') set(next.text, target.orig.trim(), v.text ?? '');
    else set(next.src, target.orig, (v.src ?? '').trim());
    if (target.link && v.link !== undefined) set(next.href, target.link.orig, v.link.trim());
    commit(next);
    setTarget(null);
    flash('Saved to draft');
  };

  const revert = () => {
    if (!target) return;
    const next: Overrides = { text: { ...ov.text }, src: { ...ov.src }, href: { ...ov.href } };
    if (target.kind === 'text') delete next.text[target.orig.trim()];
    else delete next.src[target.orig];
    if (target.link) delete next.href[target.link.orig];
    commit(next);
    setTarget(null);
    flash('Reverted');
  };

  const doExport = () => {
    const blob = new Blob([JSON.stringify({ version: 1, ...ov }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file?: File) => {
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      if (json && typeof json === 'object' && !Array.isArray(json)) {
        commit(normalize(json));
        flash('Imported');
      } else alert('That file is not a site-content.json.');
    } catch {
      alert('Could not read that file as JSON.');
    }
  };

  const doReset = () => {
    if (!confirm('Discard your local draft and reload the published version?')) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    window.location.reload();
  };

  const exitEdit = () => {
    try {
      localStorage.removeItem(EDIT_FLAG_KEY);
    } catch {}
    window.location.reload();
  };

  if (!editMode) return null; // viewers get the overrides applied, but no UI

  return (
    <div data-site-editor-ignore>
      <div
        ref={hoverRef}
        style={{ display: 'none' }}
        className="fixed z-[105] pointer-events-none border-2 border-dashed border-[#c3a35e] bg-[#c3a35e]/10"
      />

      <div className="fixed bottom-4 left-4 z-[100] flex flex-wrap items-center gap-2 bg-[#0a0a0d] border border-[#c3a35e] p-2 shadow-[0_0_25px_rgba(195,163,94,0.25)] max-w-[calc(100vw-2rem)]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#34d399] px-1">
          Site edit · {count(ov)} change{count(ov) === 1 ? '' : 's'}
          {hasDraft ? ' · draft saved' : ''}
        </span>
        <button
          type="button"
          className={picking ? goldBtnCls : smallBtnCls}
          onClick={() => setPicking((p) => !p)}
          title="Pick: click anything to edit it. Browse: use the site normally."
        >
          {picking ? 'Mode: Pick' : 'Mode: Browse'}
        </button>
        <button type="button" className={smallBtnCls} onClick={() => fileRef.current?.click()}>Import site</button>
        <button type="button" className={goldBtnCls} onClick={doExport}>Export site-content.json</button>
        <button type="button" className={smallBtnCls} onClick={doReset}>Reset site</button>

        {standsState > 0 && (
          <>
            <span className="self-stretch w-px bg-[#3d3423] mx-1" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#34d399] px-1">
              Stands{standsState === 2 ? ' · draft saved' : ''}
            </span>
            <button type="button" className={smallBtnCls} onClick={() => getStandsToolbar()?.onAdd()}>+ Stand</button>
            <button type="button" className={smallBtnCls} onClick={() => standsFileRef.current?.click()}>Import stands</button>
            <button type="button" className={goldBtnCls} onClick={() => getStandsToolbar()?.onExport()}>Export stands.json</button>
            <button type="button" className={smallBtnCls} onClick={() => getStandsToolbar()?.onReset()}>Reset stands</button>
          </>
        )}

        <span className="self-stretch w-px bg-[#3d3423] mx-1" />
        <button type="button" className={smallBtnCls} onClick={exitEdit}>Exit</button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            doImport(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <input
          ref={standsFileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) getStandsToolbar()?.onImport(f);
            e.target.value = '';
          }}
        />
      </div>

      {target && <EditPanel target={target} ov={ov} onSave={save} onRevert={revert} onClose={() => setTarget(null)} />}

      {toast && (
        <div className="fixed bottom-20 left-4 z-[120] bg-[#14121a] border border-[#3d3423] text-[#e6c278] text-xs font-mono px-3 py-1.5">
          {toast}
        </div>
      )}
    </div>
  );
}