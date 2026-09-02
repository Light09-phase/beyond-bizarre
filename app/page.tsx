'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '@/app/components/loadingscreen';
import About from '@/app/components/About';
import Header from '@/app/components/header';
import Combat from '@/app/components/Combat';
import Abilities from '@/app/components/Ability';
import Background from '@/app/components/Background';
import ScrollProgress from "@/app/components/ScrollProgress";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTabState] = useState('homepage'); 
  
  // Explicitly typed reference for TypeScript
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync tab state with URL without full page reload
  const setActiveTab = (tab: string, updateUrl = true) => {
    setActiveTabState(tab);
    if (updateUrl) {
      const newUrl = tab === 'homepage' ? window.location.pathname : `?tab=${tab}`;
      window.history.pushState({ tab }, '', newUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Read URL query params on initial load and handle browser back/forward buttons
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTabState(tabParam);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTabState(event.state.tab);
      } else {
        const params = new URLSearchParams(window.location.search);
        setActiveTabState(params.get('tab') || 'homepage');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for custom navigation events dispatched by SearchModal
  useEffect(() => {
    const handleCustomNavigate = (e: CustomEvent<{ tab: string }>) => {
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
      }
    };

    window.addEventListener('navigate-tab', handleCustomNavigate as EventListener);
    return () => {
      window.removeEventListener('navigate-tab', handleCustomNavigate as EventListener);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'homepage' && videoRef.current) {
      videoRef.current.play().catch((error: unknown) => {
        console.error("Video autoplay blocked or failed:", error);
      });
    }
  }, [activeTab, entered]);

  return (
    <main className="relative min-h-screen bg-[#0a0b0e] text-white">

      <ScrollProgress />

      {/* LOADING SCREEN OVERLAY */}
      {!entered && (
        <LoadingScreen onEnter={() => setEntered(true)} />
      )}

      {/* FIXED TOP NAVIGATION BAR */}
      <Header setActiveTab={setActiveTab} activeTab={activeTab} playMusic={entered} />

      {/* CONTENT AREA */}
      <div className="w-full h-full">
        
        {/* HOMEPAGE CONTENT */}
        {activeTab === 'homepage' && (
          <>
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20 text-center px-4">
  
              {/* LAYER 1: THE VIDEO (z-0) */}
              <video 
                ref={videoRef}
                src="/testbackground.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none transition-transform duration-1000 scale-105"
              />

              {/* LAYER 2: THE SHADOWS (z-10) */}
              <div className="absolute inset-0 z-10 bg-black/60 pointer-events-none" />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0b0e] via-transparent to-[#0a0b0e]/80 pointer-events-none" />

              {/* LAYER 3: YOUR TEXT AND BUTTONS (z-20) */}
              <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
                
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                  className="text-xs font-mono uppercase tracking-[0.5em] text-[#c5a059] mb-4"
                >
                  A JoJo's Bizarre Adventure Fan-Made Experience
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.85, y: 35 }}
                  animate={
                    entered
                      ? { opacity: 1, scale: 1, y: 0 }
                      : { opacity: 0, scale: 0.85, y: 35 }
                  }
                  transition={{
                    duration: 2.8,
                    delay: 0.5,
                    ease: [0.12, 0.8, 0.2, 1],
                  }}
                  className="font-gloock text-6xl sm:text-8xl tracking-wider text-white uppercase mb-6 drop-shadow-2xl"
                >
                  Beyond Bizarre
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 1.8, delay: 1.6, ease: 'easeOut' }}
                  className="max-w-xl text-zinc-300 font-cormorant text-xl mb-10 drop-shadow"
                >
                  Enter a world beyond your imagination. As your bizarre adventure begins here...
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                 transition={{ duration: 1.5, delay: 2.2, ease: 'easeOut' }}
                 className="flex gap-6 items-center"
              >
                 <a 
                   href="https://www.roblox.com/communities/252652943/Beyond-Bizarre-Official#!/about"
                   target="_blank" 
                    rel="noopener noreferrer"
                   className="inline-block bg-[#f2f2f2] px-10 py-3.5 text-sm font-mono uppercase tracking-widest text-black text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.7)] [clip-path:polygon(15px_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%,0_15px)]"
                 >
                     Enter Game
                 </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={entered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 2.6 }}
                className="absolute bottom-8 z-20 flex flex-col items-center gap-1 text-[12px] font-mono uppercase tracking-[0.3em] text-zinc-400 animate-bounce"
              >
                <span>Scroll</span>
                <span>↓</span>
              </motion.div>

            </section>

            <About setActiveTab={setActiveTab} />
          </>
        )}

        {/* COMBAT TAB RENDERS HERE */}
        {activeTab === 'combat' && <Combat />}

        {/* ABILITIES TAB RENDERS HERE */}
        {activeTab === 'abilities' && <Abilities />}

        {/* BACKGROUND TAB RENDERS HERE */}
        {activeTab === 'background' && <Background />}

      </div>
    </main>
  );
}