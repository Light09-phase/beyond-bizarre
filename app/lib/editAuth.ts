// Shared edit-mode lock. Both the Abilities stand editor and the site-wide
// editor read the same flag, so you unlock once and edit everywhere.
//
// This is a lock on the door, not real security: the password ships inside the
// JS bundle. That's acceptable here because edits only ever live in YOUR
// browser's draft until you export the JSON and commit it to the repo.

export const EDIT_FLAG_KEY = 'bb-edit-mode';

// CHANGE THIS before you push.
export const EDIT_PASSWORD = '#Light@09*';

let promptedThisLoad = false; // stops React Strict Mode asking twice in dev

// ?edit=1 -> asks for the password once, then remembers it
// ?edit=0 -> turns edit mode off
export function readEditFlag(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get('edit');
    if (q === '0') localStorage.removeItem(EDIT_FLAG_KEY);
    if (q === '1' && localStorage.getItem(EDIT_FLAG_KEY) !== '1' && !promptedThisLoad) {
      promptedThisLoad = true;
         import('./unlockDialog').then(({ openUnlockDialog }) =>
     openUnlockDialog(
       (attempt) => attempt === EDIT_PASSWORD,
       () => {
         localStorage.setItem(EDIT_FLAG_KEY, '1');
         window.location.reload();
       }
     )
   );
    }
    return localStorage.getItem(EDIT_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Bridge: the Abilities page hands its stand-editing actions to the site-wide
// edit bar, so there is ONE bar instead of two. Nothing to configure.
// ---------------------------------------------------------------------------
export interface StandsToolbar {
  hasDraft: boolean;
  onAdd: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

let standsToolbar: StandsToolbar | null = null;
const toolbarListeners = new Set<() => void>();

export const getStandsToolbar = () => standsToolbar;

export function registerStandsToolbar(t: StandsToolbar | null) {
  const changed = !!t !== !!standsToolbar || t?.hasDraft !== standsToolbar?.hasDraft;
  standsToolbar = t;
  if (changed) toolbarListeners.forEach((fn) => fn());
}

export function subscribeStandsToolbar(fn: () => void) {
  toolbarListeners.add(fn);
  return () => {
    toolbarListeners.delete(fn);
  };
}