// app/components/loadingscreen.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // 1. Handles the progress bar incrementing from 0 to 100
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // 2. Automatically triggers the transition and music hook when progress hits 100%
  useEffect(() => {
    if (progress === 100) {
      const transitionTimer = setTimeout(() => {
        setLeaving(true);
        // Jump instantly to the top of the page when entering the game
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Gives time for the exit animation before unmounting/triggering music in parent
        setTimeout(() => {
          onEnter();
        }, 800);
      }, 400);

      return () => clearTimeout(transitionTimer);
    }
  }, [progress, onEnter]);

  return (
    <AnimatePresence>
      {!leaving && (
        /* SOLID PITCH-BLACK CONTAINER (Opaque, No Transparency) */
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-4 text-white"
        >
          {/* BLACK OVERLAY THAT FADES FROM PITCH BLACK TO SHOW CONTENT */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0 z-20 bg-black pointer-events-none"
          />

          {/* INNER LOADING CONTENT */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* LOGO / TITLE */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center mb-12"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#c5a059] mb-2">
                A Bizarre Adventure
              </p>
              <h1 className="font-gloock text-4xl sm:text-6xl uppercase tracking-wider text-white">
                Beyond Bizarre
              </h1>
            </motion.div>

            {/* PROGRESS BAR CONTAINER */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="w-full max-w-md space-y-3 font-mono text-xs uppercase tracking-widest text-zinc-400"
            >
              <div className="flex justify-between items-center text-[10px]">
                <span>{progress >= 100 ? 'Initialization Complete' : 'Initializing'}</span>
                <span className="text-[#c5a059]">{progress}%</span>
              </div>

              {/* BAR OUTLINE */}
              <div className="h-[2px] w-full bg-white/10 overflow-hidden relative">
                <div
                  className="h-full bg-white transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}