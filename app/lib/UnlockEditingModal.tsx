"use client";

import React, { useEffect, useRef, useState } from 'react';

// "Unlock editing" passphrase dialog.
//
// It only draws the dialog and reports what was typed. Checking the passphrase stays in your
// existing editAuth code: pass that check as `onSubmit` (return true when the passphrase is right;
// it can be async). On `true` this calls nothing else, so close it yourself, e.g. by setting `open`
// to false and turning edit mode on.
//
//   <UnlockEditingModal
//     open={askingForPassphrase}
//     onSubmit={async (pass) => {
//       const ok = await yourExistingCheck(pass);
//       if (ok) setAskingForPassphrase(false);
//       return ok;
//     }}
//     onCancel={() => setAskingForPassphrase(false)}
//   />

interface UnlockEditingModalProps {
  open: boolean;
  onSubmit: (passphrase: string) => boolean | Promise<boolean>;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export default function UnlockEditingModal({
  open,
  onSubmit,
  onCancel,
  title = 'Unlock editing',
  message = 'Enter your passphrase to edit pages.',
}: UnlockEditingModalProps) {
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setValue('');
    setWrong(false);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const submit = async () => {
    if (busy || !value) return;
    setBusy(true);
    try {
      const ok = await onSubmit(value);
      if (!ok) {
        setWrong(true);
        setValue('');
        inputRef.current?.focus();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-editing-title"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="w-full max-w-md border border-[#d9a441] bg-[#0e0e13] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
      >
        <h2
          id="unlock-editing-title"
          className="font-['Cormorant_Upright',serif] text-[1.9rem] font-bold leading-tight text-[#d9a441]"
        >
          {title}
        </h2>
        <p className="mt-2 mb-5 text-sm text-[#a39a78]">{message}</p>

        <input
          ref={inputRef}
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (wrong) setWrong(false);
          }}
          placeholder="Passphrase"
          aria-invalid={wrong}
          className="block w-full border border-[#d9a441] bg-[#08080b] px-3 py-3 font-mono text-sm text-[#ece6d2] placeholder:text-[#6b6552] shadow-[0_0_0_3px_#0e0e13,0_0_0_4px_#d9a441] focus:outline-none"
        />
        {wrong && (
          <p role="alert" className="mt-4 font-mono text-xs text-[#ef6a5b]">
            That passphrase isn&apos;t right.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="border border-[#3a321f] bg-[#13131a] px-4 py-2 font-mono text-xs font-bold text-[#ece6d2] transition-colors hover:border-[#d9a441]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !value}
            className="border border-[#d9a441] bg-[#d9a441] px-5 py-2 font-mono text-xs font-bold text-[#0e0e13] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            Unlock
          </button>
        </div>
      </form>
    </div>
  );
}
