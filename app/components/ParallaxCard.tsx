'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxCardProps {
  title: string;
  subtitle: string;
  imgSrc: string;
}

export default function ParallaxCard({ title, subtitle, imgSrc }: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll position relative to this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // Triggers as soon as card enters viewport
  });

  // Transform scroll progress into subtle vertical floating (Y-axis) & scaling
  const imageY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-lg border border-white/10 bg-[#12141c] p-6 shadow-2xl transition-colors hover:border-[#c5a059]"
    >
      {/* Floating Image Container */}
      <motion.div style={{ y: imageY, scale }} className="relative h-64 w-full overflow-hidden rounded-md">
        <img
          src={imgSrc}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent opacity-80" />
      </motion.div>

      {/* Parallax Floating Text */}
      <motion.div style={{ y: textY }} className="relative z-10 -mt-8 px-2">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-mono">
          {subtitle}
        </span>
        <h3 className="font-gloock text-3xl uppercase tracking-wide text-white drop-shadow-lg">
          {title}
        </h3>
      </motion.div>
    </div>
  );
}