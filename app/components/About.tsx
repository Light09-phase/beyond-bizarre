// app/components/About.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AboutProps {
  setActiveTab: (tab: string) => void;
}

export default function About({ setActiveTab }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1.03, 0.97]);

  return (
    <section
      ref={containerRef}
      className="relative z-10 max-w-7xl mx-auto px-6 py-16 bg-[#050505] text-[#e0ded8]"
    >
      {/* SECTION HEADER */}
      <div className="mb-10 text-center md:text-left border-b border-[#2a2418] pb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#c3a35e] font-mono mb-2">
          The Adventure Begins
        </p>
        <h2 className="text-4xl sm:text-5xl font-['Gilda_Display',serif] uppercase tracking-wider text-[#e6c278] drop-shadow-[0_2px_15px_rgba(230,194,120,0.2)]">
          Beyond Bizarre
        </h2>
      </div>

      {/* GAME METADATA BAR */}
      <div className="w-full bg-[#121116] border border-[#2a2418] py-4 px-6 mb-16 flex flex-wrap justify-between items-center gap-6 text-xs tracking-widest uppercase font-mono shadow-xl">
        <div>
          <span className="text-[#8a857a] block text-[10px] font-['Cormorant_Upright',serif] text-base">Genre</span>
          <span className="text-[#e6c278] font-semibold">Action / Open World</span>
        </div>
        <div>
          <span className="text-[#8a857a] block text-[10px] font-['Cormorant_Upright',serif] text-base">Developer</span>
          <span className="text-[#e6c278] font-semibold">Phase Zero Interactive</span>
        </div>
        <div>
          <span className="text-[#8a857a] block text-[10px] font-['Cormorant_Upright',serif] text-base">Platform</span>
          <span className="text-[#e6c278] font-semibold">Roblox / PC</span>
        </div>
        <div>
          <span className="text-[#8a857a] block text-[10px] font-['Cormorant_Upright',serif] text-base">Status</span>
          <span className="text-[#c3a35e] font-semibold">In Development</span>
        </div>
      </div>

      {/* FEATURE ROWS (ZIG-ZAG LAYOUT WITH BANDAI NAMCO / MY HERO STYLE FRAMES) */}
      <div className="space-y-16">
        
        {/* ROW 1: Image Left, Text Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div
            style={{ scale }}
            className="md:col-span-6 group relative bg-[#121116] border border-[#2a2418] hover:border-[#c3a35e] transition-all duration-300 overflow-hidden shadow-2xl p-2"
          >
            {/* Anime UI Corner Accents */}
            <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-[#c3a35e] z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#c3a35e] z-20 pointer-events-none" />
            
            <div className="relative aspect-video overflow-hidden bg-[#050505]">
              <img
                src="/about2.jpg"
                alt="Beyond Bizarre World"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          <div className="md:col-span-6 space-y-4 p-4">
            <span className="bg-[#c3a35e] text-black text-xs font-bold px-2.5 py-1 uppercase tracking-wider font-['Cormorant_Upright',serif]">
              Overview
            </span>
            <h3 className="text-2xl sm:text-3xl font-['Gilda_Display',serif] text-[#e6c278] leading-snug">
              Welcome to a game where the limits of what you can do is your imagination and WILL!
            </h3>
            <p className="text-[#b8b3a8] font-['Zen_Old_Mincho',serif] text-base md:text-lg leading-relaxed">
              Beyond Bizarre is a massive JoJo-inspired adventure built for Roblox. Explore a living world, discover and fight with powerful Stands, master an expressive combat system, and carve your own path through a bizarre story!
            </p>
          </div>
        </div>

        {/* ROW 2: Text Left, Image Right (Flipped for ZIG-ZAG dynamic flow) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4 p-4 order-2 md:order-1">
            <span className="bg-[#c3a35e] text-black text-xs font-bold px-2.5 py-1 uppercase tracking-wider font-['Cormorant_Upright',serif]">
              Freedom & Combat
            </span>
            <h3 className="text-2xl sm:text-3xl font-['Gilda_Display',serif] text-[#e6c278] leading-snug">
              Master the flow of battle with precision, movement, and soul manifestation.
            </h3>
            <p className="text-[#b8b3a8] font-['Zen_Old_Mincho',serif] text-base md:text-lg leading-relaxed">
              Every strike carries weight. Combine universal light strings, dynamic heavy movement options, and powerful Stand summons to outplay your opponents in deep, skill-driven encounters.
            </p>
            <div className="pt-2">
              {/* DISCOVER MORE BUTTON LINKED TO COMBAT VIEW */}
              <button 
                onClick={() => setActiveTab('combat')}
                className="border border-[#3d3423] bg-[#100f14] px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#e6c278] transition-all hover:border-[#c3a35e] hover:bg-[#c3a35e] hover:text-black shadow-lg"
              >
                Discover More
              </button>
            </div>
          </div>

          <motion.div
            style={{ scale }}
            className="md:col-span-6 group relative bg-[#121116] border border-[#2a2418] hover:border-[#c3a35e] transition-all duration-300 overflow-hidden shadow-2xl p-2 order-1 md:order-2"
          >
            {/* Anime UI Corner Accents */}
            <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-[#c3a35e] z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#c3a35e] z-20 pointer-events-none" />

            <div className="relative aspect-video overflow-hidden bg-[#050505]">
              <img
                src="/about2.jpg"
                alt="Beyond Bizarre Combat"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}