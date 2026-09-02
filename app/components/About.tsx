'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AboutProps {
  setActiveTab: (tab: string) => void;
}

interface FeatureRowProps {
  imageSrc: string;
  imageAlt: string;
  badge: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  reverse?: boolean;
}

// INDIVIDUAL PARALLAX ROW COMPONENT (Ensures isolated scroll calculation per row)
function ParallaxRow({
  imageSrc,
  imageAlt,
  badge,
  title,
  description,
  buttonText,
  onButtonClick,
  reverse = false,
}: FeatureRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Dedicated scroll tracking per row
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  // Expanded speed differential for a pronounced parallax shift
  const textY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 0.96]);

  return (
    <div ref={rowRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-6">
      {/* IMAGE CONTAINER */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className={`md:col-span-6 group relative bg-[#121116] border border-[#2a2418] hover:border-[#c3a35e] transition-colors duration-300 overflow-hidden shadow-2xl p-2 ${
          reverse ? 'order-1 md:order-2' : ''
        }`}
      >
        <div className={`absolute top-0 ${reverse ? 'right-0 border-r-2' : 'left-0 border-l-2'} h-4 w-4 border-t-2 border-[#c3a35e] z-20 pointer-events-none`} />
        <div className={`absolute bottom-0 ${reverse ? 'left-0 border-l-2' : 'right-0 border-r-2'} h-4 w-4 border-b-2 border-[#c3a35e] z-20 pointer-events-none`} />

        <div className="relative aspect-video overflow-hidden bg-[#050505]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* TEXT CONTAINER */}
      <motion.div
        style={{ y: textY }}
        className={`md:col-span-6 space-y-4 p-4 z-10 ${
          reverse ? 'order-2 md:order-1' : ''
        }`}
      >
        <span className="inline-block bg-[#c3a35e] text-black text-xs font-bold px-2.5 py-1 uppercase tracking-wider font-['Cormorant_Upright',serif]">
          {badge}
        </span>
        <h3 className="text-2xl sm:text-3xl font-['Gilda_Display',serif] text-[#e6c278] leading-snug">
          {title}
        </h3>
        <p className="text-[#b8b3a8] font-['Zen_Old_Mincho',serif] text-base md:text-lg leading-relaxed">
          {description}
        </p>
        {buttonText && onButtonClick && (
          <div className="pt-2">
            <button
              onClick={onButtonClick}
              className="border border-[#3d3423] bg-[#100f14] px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#e6c278] transition-all hover:border-[#c3a35e] hover:bg-[#c3a35e] hover:text-black shadow-lg"
            >
              {buttonText}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function About({ setActiveTab }: AboutProps) {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 bg-[#050505] text-[#e0ded8]">
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
          <span className="text-[#8a857a] block text-[14px] font-['Cormorant_Upright',serif] text-base mb-1">Genre</span>
          <motion.span 
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.5, ease: 'linear', delay: 0.2 }}
            className="text-[#e6c278] font-semibold inline-block whitespace-nowrap"
          >
            Action / Open World
          </motion.span>
        </div>
        
        <div>
          <span className="text-[#8a857a] block text-[14px] font-['Cormorant_Upright',serif] text-base mb-1">Developer</span>
          <motion.span 
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.5, ease: 'linear', delay: 0.7 }}
            className="text-[#e3e3e3] font-semibold inline-block whitespace-nowrap"
          >
            Phase Zer0 Interactive
          </motion.span>
        </div>
        
        <div>
          <span className="text-[#8a857a] block text-[14px] font-['Cormorant_Upright',serif] text-base mb-1">Platform</span>
          <motion.span 
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.5, ease: 'linear', delay: 1.2 }}
            className="text-[#e6c278] font-semibold inline-block whitespace-nowrap"
          >
            Roblox / PC & Console
          </motion.span>
        </div>
        
        <div>
          <span className="text-[#8a857a] block text-[14px] font-['Cormorant_Upright',serif] text-base mb-1">Status</span>
          <motion.span 
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 1.5, ease: 'linear', delay: 1.7 }}
            className="text-[#ff0000] font-semibold inline-block whitespace-nowrap"
          >
            In Development
          </motion.span>
        </div>
      </div>

      {/* FEATURE ROWS */}
      <div className="space-y-16 overflow-hidden">
        <ParallaxRow
          imageSrc="/about2.jpg"
          imageAlt="Beyond Bizarre World"
          badge="Overview"
          title="Welcome to a game where the limits of what you can do is your imagination and WILL!"
          description="Beyond Bizarre is a massive JoJo-inspired adventure built for Roblox. Explore a living world, discover and fight with powerful Stands, master an expressive combat system, and carve your own path through a bizarre story!"
        />

        <ParallaxRow
          reverse
          imageSrc="/about2.jpg"
          imageAlt="Beyond Bizarre Combat"
          badge="Freedom & Combat"
          title="Master the flow of battle with precision, movement, and soul manifestation."
          description="Every strike carries weight. Combine universal light strings, dynamic heavy movement options, and powerful Stand summons to outplay your opponents in deep, skill-driven encounters."
          buttonText="Discover More"
          onButtonClick={() => setActiveTab('combat')}
        />

        <ParallaxRow
          imageSrc="/about2.jpg"
          imageAlt="Beyond Bizarre World"
          badge="Overview"
          title="Welcome to a game where the limits of what you can do is your imagination and WILL!"
          description="Beyond Bizarre is a massive JoJo-inspired adventure built for Roblox. Explore a living world, discover and fight with powerful Stands, master an expressive combat system, and carve your own path through a bizarre story!"
          buttonText="Discover More"
          onButtonClick={() => setActiveTab('combat')}
        />

        <ParallaxRow
          reverse
          imageSrc="/about2.jpg"
          imageAlt="Beyond Bizarre Combat"
          badge="Freedom & Combat"
          title="Master the flow of battle with precision, movement, and soul manifestation."
          description="Every strike carries weight. Combine universal light strings, dynamic heavy movement options, and powerful Stand summons to outplay your opponents in deep, skill-driven encounters."
          buttonText="Discover More"
          onButtonClick={() => setActiveTab('background')}
        />
      </div>
    </section>
  );
}