"use client";

import React from 'react';
import { createRoot } from 'react-dom/client';
import UnlockEditingModal from './UnlockEditingModal';

// Opens the "Unlock editing" dialog on its own, so nothing has to be added to your pages or layout.
// editAuth.ts calls this from readEditFlag() when you visit a page with ?edit=1.
//
// check      -> return true if the typed passphrase is correct
// onUnlocked -> runs once, right after a correct passphrase (the dialog has closed by then)
export function openUnlockDialog(check: (passphrase: string) => boolean, onUnlocked: () => void) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  const close = () => {
    // Deferred so the dialog isn't torn down in the middle of its own click handler.
    setTimeout(() => {
      root.unmount();
      host.remove();
    }, 0);
  };

  root.render(
    <UnlockEditingModal
      open
      onSubmit={(passphrase) => {
        if (!check(passphrase)) return false;
        close();
        onUnlocked();
        return true;
      }}
      onCancel={close}
    />
  );
}
