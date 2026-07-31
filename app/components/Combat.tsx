"use client";

import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type SubTab = 'combat' | 'mobility' | 'stand-combat';

interface StatItem {
  label: string;
  value: string;
}

interface VideoOption {
  id: string;
  label: string;
  badge: string;
  duration: string;
  description: string;
  inputTag?: string;
  properties?: string[];
  stats?: StatItem[];
  videoSrc?: string;
  posterSrc?: string;
}

interface DynamicVideoPlateProps {
  title: string;
  options: VideoOption[];
  defaultOptionId?: string;
  sectionBadge?: string;
  variantTheme?: 'gold' | 'red';
}

interface SingleVideoPlateProps {
  title: string;
  inputTag?: string;
  badge?: string;
  duration?: string;
  description: string;
  properties?: string[];
  stats?: StatItem[];
  videoSrc?: string;
  posterSrc?: string;
}

interface StatusEffectCardProps {
  type: 'bleed' | 'burn' | 'poison' | 'wither';
  title: string;
  badgeText: string;
  duration: string;
  description: string;
  stats: string;
}

interface CodexBoxProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
}

// ============================================================================
// DATA & VARIANT CONFIGURATIONS
// ============================================================================

const styleRanks = [
  { rank: "D", title: "Di Molto!", color: "border-[#555] text-[#8a857a]" },
  { rank: "C", title: "Crazy!!", color: "border-[#666] text-[#a09a8e]" },
  { rank: "B", title: "Bizarre!", color: "border-[#888] text-[#c7c2b5]" },
  { rank: "BB", title: "BEYOND!", color: "border-[#c3a35e] text-[#e6c278]" },
  { rank: "A", title: "All Star!", color: "border-[#e6c278] text-[#e6c278]" },
  { rank: "S", title: "Stardust!", color: "border-[#34d399] text-[#34d399]" },
  { rank: "SS", title: "Super!", color: "border-[#60a5fa] text-[#60a5fa]" },
  { rank: "SSS", title: "SSS Style!", color: "border-[#c084fc] text-[#c084fc]" },
  { rank: "O", title: "OVERDRIVE", color: "border-[#ff2a4b] text-[#ff4d6d] font-bold bg-[#26050b]" },
];

const heavyStrikeOptions: VideoOption[] = [
  {
    id: "basic",
    label: "Heavy Strike",
    badge: "HEAVY DEMO",
    duration: "0:12",
    inputTag: "M2 / MMB",
    description: "Used while grounded; can be used to end combos or as a quick way to destroy defensive options. Usable casually, but can be parried. Deals double M1 damage with soft ragdoll launch.",
    properties: [
      "Guard Break",
      "Parriable",
      "Super Knockback & Ragdoll"
    ],
    stats: [
      { label: "Damage", value: "2x M1 Base" },
      { label: "Heat Cost", value: "15 Heat" },
      { label: "Cooldown", value: "5.0s" }
    ],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "down",
    label: "Down Strike",
    badge: "AIR COMBAT",
    duration: "0:10",
    inputTag: "Airborne M2",
    description: "Executed while in the air and leveled with your opponent for air combos. Transforms M2 into a heavy down slam to your opponent, sending them back down to earth.",
    properties: [
      "Guard Bypass",
      "Parriable",
      "Super Knockback & Ragdoll",
      "Grand Down-Spike",
      "Rebound"
    ],
    stats: [
      { label: "Spike Type", value: "Grand Down-Spike" },
      { label: "Guard Property", value: "Guard Bypass" },
      { label: "Cooldown", value: "5.0s" }
    ],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "sky",
    label: "Sky Strike",
    badge: "LAUNCHER",
    duration: "0:11",
    inputTag: "Hold Space during M2 Windup",
    description: "While grounded, holding the space key during the M2's windup transforms your M2 into Sky Strike uppercut / upper kick to your opponent, launching them into the air.",
    properties: [
      "Guard Bypass",
      "Parriable",
      "Super Knockback & Ragdoll",
      "Grand Up-Spike"
    ],
    stats: [
      { label: "Spike Type", value: "Grand Up-Spike" },
      { label: "Guard Property", value: "Guard Bypass" },
      { label: "Cooldown", value: "5.0s" }
    ],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "ground",
    label: "Ground Strike",
    badge: "GROUND PIN",
    duration: "0:12",
    inputTag: "Airborne (Above Opponent) + M2",
    description: "Executed while above your opponent; transforms M2 into an angled kick down to your opponent, which is aimable as well.",
    properties: [
      "Guard Break",
      "Parriable",
      "Grounded & Ragdoll Bypass",
      "Ground Pin"
    ],
    stats: [
      { label: "Pin Property", value: "Ground Pin" },
      { label: "Bypass", value: "Grounded & Ragdoll" },
      { label: "Cooldown", value: "5.0s" }
    ],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "rush",
    label: "Rush Strike",
    badge: "MOBILITY STRIKE",
    duration: "0:13",
    inputTag: "Forward Dash + M2",
    description: "While using forward dash and your M2 together, M2's can turn into a Rush Strike, forward dashing strike in a linear path with more mobility.",
    properties: [
      "Guardable",
      "Parriable",
      "Super Knockback & Ragdoll",
      "Grand Upper Strike"
    ],
    stats: [
      { label: "Strike Type", value: "Grand Upper Strike" },
      { label: "Guard Property", value: "Guardable" },
      { label: "Cooldown", value: "5.0s" }
    ],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "flash",
    label: "Flash Strike & Flash Rush",
    badge: "TELEPORT STRIKE",
    duration: "0:15",
    inputTag: "Flash Step + M2",
    description: "Instantaneous strike that can surprise opponents with a sudden strike. Effective range is roughly half of flash step range. Can chain into Flash Rush multi-strikes.",
    properties: [
      "Guardable",
      "Parriable",
      "Super Knockback & Ragdoll"
    ],
    stats: [
      { label: "Effective Range", value: "1/2 Flash Range" },
      { label: "Chain Input", value: "M2 After Flash" },
      { label: "Finisher", value: "Down Strike" }
    ],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "clash",
    label: "M2 Clashing",
    badge: "CLASH MECHANIC",
    duration: "0:09",
    inputTag: "Simultaneous M2",
    description: "Should 2 players use M2 at the same time and clash, their clash usually has no victor at the end and simply has both enemies being pushed back from the clash point.",
    properties: [
      "Mutual Pushback",
      "No Victor",
      "Stun Neutralization"
    ],
    stats: [
      { label: "Result", value: "Mutual Pushback" },
      { label: "Victor", value: "None" },
      { label: "Cooldown", value: "5.0s Triggered" }
    ],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  }
];

const criticalArtOptions: VideoOption[] = [
  {
    id: "m1-amp",
    label: "Amplified Strike (M1)",
    badge: "CRITICAL ART",
    duration: "0:15",
    inputTag: "M1 in Perception Zone",
    description: "Executing M1 inside Perception Zone with supercharged guard bar triggers Amplified Strike, leaving opponent heavily stunned for combo setup.",
    properties: ["Guard Depletion", "Overdrive Trigger", "Target Stun"],
    stats: [{ label: "Type", value: "Amplified (M1)" }, { label: "Effect", value: "Opponent Stunned" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "m1-crit",
    label: "Critical Strike (M1)",
    badge: "CRITICAL ART",
    duration: "0:18",
    inputTag: "M1 (Green Zone QTE)",
    description: "Timing the QTE bar inside the Green Zone initiates standard Critical Strike, dealing huge damage and putting user into Overdrive.",
    properties: ["Guard Depletion", "Overdrive State", "Will Scaling"],
    stats: [{ label: "Type", value: "Critical (M1)" }, { label: "Trigger", value: "Overdrive State" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "m1-max",
    label: "Maximum Critical Strike (M1)",
    badge: "MAX CRITICAL",
    duration: "0:20",
    inputTag: "M1 (Blue Center QTE)",
    description: "Hitting the ultra-thin center Blue Zone delivers Maximum Critical Strike for catastrophic damage and full status debuff on target.",
    properties: ["Maximum Damage", "Full Will Scaling", "Debuff Applied"],
    stats: [{ label: "Type", value: "Max Critical (M1)" }, { label: "Damage", value: "Immense" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "m2-amp",
    label: "Amplified Strike (M2)",
    badge: "CRITICAL ART",
    duration: "0:15",
    inputTag: "M2 in Perception Zone",
    description: "Executing M2 inside Perception Zone delivers heavy amplified strike resulting in Grand Knockback across the arena.",
    properties: ["Grand Knockback", "Guard Depletion", "Overdrive Trigger"],
    stats: [{ label: "Type", value: "Amplified (M2)" }, { label: "Effect", value: "Grand Knockback" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "m2-crit",
    label: "Critical Strike (M2)",
    badge: "CRITICAL ART",
    duration: "0:18",
    inputTag: "M2 (Green Zone QTE)",
    description: "Heavy Critical Strike hitting Green Zone QTE, blasting target away and applying Will-scaled damage bonuses.",
    properties: ["Grand Knockback", "Will Scaling", "Overdrive State"],
    stats: [{ label: "Type", value: "Critical (M2)" }, { label: "Trigger", value: "Overdrive State" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "m2-max",
    label: "Maximum Critical Strike (M2)",
    badge: "MAX CRITICAL",
    duration: "0:22",
    inputTag: "M2 (Blue Center QTE)",
    description: "Maximum Heavy Critical Strike hitting center Blue Zone timing, triggering extreme knockback and devastating health loss.",
    properties: ["Extreme Knockback", "Max Will Damage", "Target Debuffed"],
    stats: [{ label: "Type", value: "Max Critical (M2)" }, { label: "Knockback", value: "Grand Knockback" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  }
];

// ============================================================================
// REUSABLE HOVERABLE CONTAINER & CARDS
// ============================================================================

const CodexBox: React.FC<CodexBoxProps> = ({
  title,
  subtitle,
  badge,
  children,
  accentColor = "border-[#2a2418] hover:border-[#c3a35e]",
  className = ""
}) => {
  return (
    <div className={`group relative bg-[#0a0a0d] border ${accentColor} transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(195,163,94,0.18)] p-6 rounded-sm overflow-hidden ${className}`}>
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c3a35e]/40 to-transparent group-hover:via-[#c3a35e] transition-all duration-500" />
      
      {(title || badge) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#2a2418] group-hover:border-[#3d3423] transition-colors">
          <div>
            <h4 className="text-xl md:text-2xl font-['Gilda_Display',serif] text-[#e6c278] group-hover:text-white transition-colors tracking-wide">
              {title}
            </h4>
            {subtitle && (
              <span className="text-xs font-mono text-[#8a857a] block mt-0.5">{subtitle}</span>
            )}
          </div>
          {badge && (
            <span className="self-start sm:self-auto bg-[#1c1a24] text-[#e6c278] border border-[#3d3423] group-hover:border-[#d9181b] text-xs font-mono px-2.5 py-1 transition-colors">
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

// ============================================================================
// SINGLE VIDEO PLATE COMPONENT
// ============================================================================

const VideoPlate: React.FC<SingleVideoPlateProps> = ({
  title,
  inputTag,
  badge = "VIDEO DEMO",
  duration = "0:12",
  description,
  properties,
  stats,
  videoSrc,
  posterSrc
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="group relative bg-[#0a0a0d] border border-[#2a2418] hover:border-[#c3a35e] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] overflow-hidden my-6 shadow-xl hover:shadow-[0_0_30px_rgba(195,163,94,0.22)] rounded-sm">
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between bg-[#121116] px-4 py-2.5 border-b border-[#2a2418]">
        <div className="flex items-center space-x-3">
          <span className="bg-[#c3a35e] text-black text-xs font-bold px-2.5 py-0.5 uppercase tracking-wider font-['Cormorant_Upright',serif]">
            {badge}
          </span>
          {inputTag && (
            <span className="bg-[#1c1a24] text-[#e6c278] border border-[#3d3423] text-xs font-mono px-2 py-0.5">
              {inputTag}
            </span>
          )}
        </div>
        <span className="text-[#8a857a] text-xs font-mono">{duration}</span>
      </div>

      {/* Main Container: Video Preview + Details */}
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left Aspect-Video Box */}
        <div className="md:col-span-5 relative aspect-video bg-[#121216] overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[#2a2418]">
          <div className="absolute inset-0 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:14px_14px] opacity-15 group-hover:opacity-30 transition-opacity" />
          
          {videoSrc ? (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                poster={posterSrc}
                className="absolute inset-0 w-full h-full object-cover z-10"
                controls={isPlaying}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              {!isPlaying && (
                <div 
                  onClick={handlePlay}
                  className="relative z-20 w-14 h-14 rounded-full bg-black/80 border-2 border-[#c3a35e] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#c3a35e] transition-all duration-300 shadow-2xl cursor-pointer"
                >
                  <svg className="w-6 h-6 text-[#c3a35e] group-hover:text-black translate-x-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </>
          ) : (
            <div className="relative z-10 w-14 h-14 rounded-full bg-black/80 border-2 border-[#c3a35e] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#c3a35e] transition-all duration-300 shadow-2xl">
              <svg className="w-6 h-6 text-[#c3a35e] group-hover:text-black translate-x-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          <div className="absolute bottom-2 left-2 z-20 text-[10px] font-mono text-[#8a857a] uppercase tracking-widest bg-black/80 px-2 py-0.5 border border-[#2a2418] pointer-events-none">
            Preview Reel
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="md:col-span-7 p-5 flex flex-col justify-between bg-gradient-to-br from-[#0a0a0d] to-[#050505]">
          <div>
            <h5 className="text-xl font-['Gilda_Display',serif] text-[#e6c278] tracking-wide mb-2 group-hover:text-white transition-colors">
              {title}
            </h5>
            <p className="text-sm md:text-base text-[#b8b3a8] font-['Zen_Old_Mincho',serif] leading-relaxed mb-4">
              {description}
            </p>
          </div>

          {/* Optional Properties Badges */}
          {properties && properties.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {properties.map((prop, idx) => (
                <span key={idx} className="text-[11px] font-mono text-[#e6c278] bg-[#14121a] border border-[#2a2418] px-2 py-0.5">
                  {prop}
                </span>
              ))}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-[#2a2418]">
              {stats.map((st, idx) => (
                <div key={idx} className="bg-[#100f14] p-2 border border-[#221e15]">
                  <span className="block text-[10px] text-[#8a857a] uppercase font-['Cormorant_Upright',serif] tracking-wider">
                    {st.label}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-[#e6c278] font-mono">
                    {st.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DYNAMIC VIDEO PLATE (WITH SWITCHABLE VARIANT TABS)
// ============================================================================

const DynamicVideoPlate: React.FC<DynamicVideoPlateProps> = ({
  title,
  options,
  defaultOptionId,
  sectionBadge = "INTERACTIVE VARIANT SELECTOR",
  variantTheme = 'gold'
}) => {
  const [selectedId, setSelectedId] = useState<string>(defaultOptionId || options[0]?.id || "");
  const [flashId, setFlashId] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeOption = options.find((opt) => opt.id === selectedId) || options[0];

  // Reset video state when switching tabs
  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [selectedId]);

  const handleTabClick = (id: string) => {
    setSelectedId(id);
    setFlashId(id);
    // Shortened to 150ms for a quicker, snappier flash
    setTimeout(() => {
      setFlashId(null);
    }, 150);
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Theme configuration object for easy switching
  const theme = {
    gold: {
      containerHover: 'hover:border-[#c3a35e] hover:shadow-[0_0_35px_rgba(195,163,94,0.25)]',
      badge: 'bg-[#c3a35e] text-black',
      title: 'text-[#e6c278]',
      tabActive: 'bg-[#1c1a24] text-[#e6c278] border-[#c3a35e] shadow-[0_0_10px_rgba(195,163,94,0.3)]',
      tabHover: 'hover:border-[#3d3423]',
      flash: 'shadow-[0_0_15px_3px_rgba(195,163,94,0.7),0_0_20px_5px_rgba(0,0,0,0.8)] border-[#c3a35e]',
      radial: 'bg-[radial-gradient(#c3a35e_1px,transparent_1px)]',
      playBtn: 'border-[#c3a35e] text-[#c3a35e] group-hover:bg-[#c3a35e] group-hover:text-black',
      tag: 'bg-[#1c1a24] text-[#e6c278] border-[#3d3423]',
      propTag: 'text-[#e6c278] border-[#3d3423] bg-[#14121a]',
      stat: 'text-[#e6c278]'
    },
    red: {
      containerHover: 'hover:border-[#d40000] hover:shadow-[0_0_35px_rgba(212,0,0,0.25)]',
      badge: 'bg-[#d40000] text-white',
      title: 'text-[#d40000]',
      tabActive: 'bg-[#2a0000] text-[#d40000] border-[#d40000] shadow-[0_0_12px_rgba(212,0,0,0.4)]',
      tabHover: 'hover:border-[#d40000]/50',
      flash: 'shadow-[0_0_15px_3px_rgba(212,0,0,0.8),0_0_20px_5px_rgba(0,0,0,0.9)] border-[#d40000]',
      radial: 'bg-[radial-gradient(#d40000_1px,transparent_1px)]',
      playBtn: 'border-[#d40000] text-[#d40000] group-hover:bg-[#d40000] group-hover:text-white',
      tag: 'bg-[#2a0000] text-[#d40000] border-[#d40000]/50',
      propTag: 'text-[#d40000] border-[#d40000]/40 bg-[#14121a]',
      stat: 'text-[#d40000]'
    }
  }[variantTheme];

  return (
    <div className={`group relative bg-[#0a0a0d] border border-[#2a2418] transition-all duration-300 transform hover:-translate-y-1 my-8 shadow-2xl rounded-sm overflow-hidden ${theme.containerHover}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#121116] px-5 py-3 border-b border-[#2a2418] gap-2">
        <div className="flex items-center space-x-3">
          <span className={`text-xs font-bold px-2.5 py-0.5 uppercase tracking-wider font-['Cormorant_Upright',serif] ${theme.badge}`}>
            {activeOption.badge || "DEMO"}
          </span>
          <span className={`text-lg font-['Gilda_Display',serif] ${theme.title}`}>
            {title}
          </span>
        </div>
        <span className="text-[#8a857a] text-xs font-mono uppercase tracking-widest bg-black/60 px-2 py-1 border border-[#2a2418]">
          {sectionBadge}
        </span>
      </div>

      {/* Option Selector Subtabs */}
      <div className="bg-[#070709] border-b border-[#2a2418] p-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleTabClick(opt.id)}
            className={`relative px-3 py-1.5 text-xs font-['Cormorant_Upright',serif] font-bold uppercase tracking-wider transition-all duration-150 ease-out border ${
              selectedId === opt.id
                ? theme.tabActive
                : `bg-[#0e0d12] text-[#716c62] border-[#221e15] hover:text-[#a09a8e] ${theme.tabHover}`
            } ${
              flashId === opt.id
                ? `scale-[1.03] bg-black text-white z-10 ${theme.flash}`
                : 'z-0'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Main Content: Video Preview Box + Details */}
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left Aspect Video Box */}
        <div className="md:col-span-5 relative aspect-video bg-[#121216] overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[#2a2418]">
          <div className={`absolute inset-0 [background-size:14px_14px] opacity-20 group-hover:opacity-35 transition-opacity ${theme.radial}`} />
          
          {activeOption.videoSrc ? (
            <>
              <video
                ref={videoRef}
                src={activeOption.videoSrc}
                poster={activeOption.posterSrc}
                className="absolute inset-0 w-full h-full object-cover z-10"
                controls={isPlaying}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              {!isPlaying && (
                <div 
                  onClick={handlePlay}
                  className={`relative z-20 w-16 h-16 rounded-full bg-black/80 border-2 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl cursor-pointer ${theme.playBtn}`}
                >
                  <svg className="w-7 h-7 translate-x-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </>
          ) : (
            <div className={`relative z-10 w-16 h-16 rounded-full bg-black/80 border-2 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl ${theme.playBtn}`}>
              <svg className="w-7 h-7 translate-x-0.5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          <div className={`absolute top-2 left-2 z-20 text-[10px] font-mono px-2 py-0.5 border pointer-events-none ${theme.tag}`}>
            {activeOption.duration}
          </div>

          <div className="absolute bottom-2 left-2 z-20 text-[10px] font-mono text-[#8a857a] uppercase tracking-widest bg-black/80 px-2 py-0.5 border border-[#2a2418] pointer-events-none">
            Variant: {activeOption.label}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="md:col-span-7 p-6 flex flex-col justify-between bg-gradient-to-br from-[#0a0a0d] to-[#050505]">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h5 className={`text-2xl font-['Gilda_Display',serif] ${theme.title}`}>
                {activeOption.label}
              </h5>
              {activeOption.inputTag && (
                <span className={`text-xs font-mono px-2 py-1 border ${theme.tag}`}>
                  {activeOption.inputTag}
                </span>
              )}
            </div>

            <p className="text-base text-[#b8b3a8] font-['Zen_Old_Mincho',serif] leading-relaxed mb-4">
              {activeOption.description}
            </p>

            {/* Properties Tags */}
            {activeOption.properties && activeOption.properties.length > 0 && (
              <div className="mb-4">
                <span className="block text-[10px] font-mono text-[#8a857a] uppercase mb-1">Move Properties:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeOption.properties.map((prop, idx) => (
                    <span key={idx} className={`text-xs font-mono px-2 py-0.5 border ${theme.propTag}`}>
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          {activeOption.stats && activeOption.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-[#2a2418]">
              {activeOption.stats.map((st, idx) => (
                <div key={idx} className="bg-[#100f14] p-2 border border-[#221e15]">
                  <span className="block text-[10px] text-[#8a857a] uppercase font-['Cormorant_Upright',serif] tracking-wider">
                    {st.label}
                  </span>
                  <span className={`text-sm font-bold font-mono ${theme.stat}`}>
                    {st.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusEffectCard: React.FC<StatusEffectCardProps> = ({
  type,
  title,
  badgeText,
  duration,
  description,
  stats
}) => {
  const styles = {
    bleed: {
      border: "border-[#ff2a4b] shadow-[0_0_15px_rgba(255,42,75,0.3)] hover:shadow-[0_0_30px_rgba(255,42,75,0.6)]",
      badge: "bg-[#38060c] text-[#ff4d6d] border-[#ff2a4b]",
      title: "text-[#ff4d6d]",
      gradient: "from-[#1a0508] to-[#0a0a0d]",
      pulse: "bg-[#ff2a4b]"
    },
    burn: {
      border: "border-[#ff7b00] shadow-[0_0_15px_rgba(255,123,0,0.3)] hover:shadow-[0_0_30px_rgba(255,123,0,0.6)]",
      badge: "bg-[#381a03] text-[#ffa048] border-[#ff7b00]",
      title: "text-[#ffa048]",
      gradient: "from-[#1f0e02] to-[#0a0a0d]",
      pulse: "bg-[#ff7b00]"
    },
    poison: {
      border: "border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]",
      badge: "bg-[#03291c] text-[#34d399] border-[#10b981]",
      title: "text-[#34d399]",
      gradient: "from-[#021810] to-[#0a0a0d]",
      pulse: "bg-[#10b981]"
    },
    wither: {
      border: "border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
      badge: "bg-[#240a38] text-[#c084fc] border-[#a855f7]",
      title: "text-[#c084fc]",
      gradient: "from-[#140421] to-[#0a0a0d]",
      pulse: "bg-[#a855f7]"
    }
  }[type];

  return (
    <div
      className={`relative p-6 bg-gradient-to-br ${styles.gradient} border ${styles.border} transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] group rounded-sm overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-mono font-bold px-2.5 py-0.5 uppercase tracking-wider border ${styles.badge}`}
        >
          {badgeText}
        </span>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${styles.pulse} animate-ping`} />
          <span className="text-xs font-mono text-[#8a857a]">{duration}</span>
        </div>
      </div>

      <div>
        <h4 className={`text-2xl font-['Gilda_Display',serif] ${styles.title} mb-2 tracking-wide`}>
          {title}
        </h4>
        <p className="text-sm text-[#b8b3a8] font-['Zen_Old_Mincho',serif] leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/10 text-xs font-mono text-[#8a857a] flex justify-between items-center">
        <span>AFFLICTION RATE</span>
        <span className="text-white font-bold">{stats}</span>
      </div>
    </div>
  );
};

// ============================================================================
// HEADER & FOOTER COMPONENTS
// ============================================================================

const SiteHeader: React.FC = () => {
  return (
    <header className="max-w-7xl mx-auto mb-10 relative border-b border-[#2a2418]">
      {/* Top Banner Navigation Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 border-b border-[#1c1912] bg-[#0a0a0d]">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 bg-[#c3a35e] rotate-45 shadow-[0_0_15px_#c3a35e] animate-pulse" />
          <span className="font-['Cormorant_Upright',serif] text-xl font-bold uppercase tracking-widest text-[#e6c278]">
            Codex Registry // Vol. I
          </span>
        </div>
        <div className="flex items-center space-x-6 text-xs font-mono text-[#8a857a]">
          <span>SYSTEM VERSION: 1.0.0</span>
          <span>STATUS: ACTIVE COMBAT</span>
          <span className="text-[#c3a35e]">PHASE ZER0 INTERACTIVE</span>
        </div>
      </div>

      <div className="relative overflow-hidden bg-[#08080a]">
        {/* DOT GRID */}
        <div className="absolute inset-0 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.09]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-12 md:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#c3a35e]" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#e6c278]">
                  Official Gameplay Unabridgment
                </span>
              </div>

              <h1 className="font-[var(--font-gloock)] text-5xl uppercase tracking-tight text-white md:text-7xl">
                Game{" "}
                <span className="text-[#c3a35e]">
                  Mechanics
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8a857a] md:text-base">
                Master the intricacies of Combat, Movement, Stand Combat,
                Progression Paths, and advanced mechanics in this complete
                tactical manual.
              </p>
            </div>

            {/* PATCH BOX */}
            <div className="border border-[#2a2418] bg-[#0b0b0d] p-5 lg:min-w-[270px]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-[#3d3423] bg-[#121116]">
                  <span className="text-xl text-[#c3a35e] animate-pulse shadow-[0_0_10px_#c3a35e]">♢</span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-[#8a857a]">
                    Current Patch
                  </span>
                  <strong className="font-mono text-sm text-white">
                    v1.00.0 — Combat Systems & Mechanics
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const SiteFooter: React.FC = () => {
  return (
    <footer className="max-w-7xl mx-auto mt-20 pt-8 pb-12 border-t border-[#2a2418] bg-[#050505] text-[#8a857a] text-xs font-mono">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 md:px-10">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 bg-[#c3a35e] rotate-45 shadow-[0_0_15px_#c3a35e] animate-pulse" />
          <span className="font-['Cormorant_Upright',serif] text-base font-bold uppercase tracking-widest text-[#e6c278]">
            Beyond Bizarre // Codex Registry
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <span>SYSTEM ARCHIVE: VOL. I</span>
          <span>STATUS: SECURE</span>
          <span className="text-[#e3e3e3]">PHASE ZER0 INTERACTIVE</span>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CombatPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('combat');

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0ded8] font-['Zen_Old_Mincho',serif] selection:bg-[#c3a35e] selection:text-black p-4 md:p-10 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#322714]/30 via-[#050505]/95 to-transparent pointer-events-none -z-10" />

      {/* Site Header */}
      <SiteHeader />

      {/* SUB-TABS */}
      <nav className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row justify-center gap-6">
        
        {/* COMBAT SYSTEMS SUB-TAB */}
        <button
          onClick={() => setActiveTab('combat')}
          className={`relative group overflow-hidden rounded-sm border transition-all duration-500 w-full md:w-1/3 h-32 md:h-28 shadow-lg bg-gradient-to-br from-[#121116] to-[#070709] ${
            activeTab === 'combat'
              ? 'border-[#c3a35e] shadow-[0_0_25px_rgba(195,163,94,0.35)] -translate-y-1'
              : 'border-[#2a2418] hover:border-[#615c52] hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent flex items-center justify-center p-4">
            <span className={`font-['Cormorant_Upright',serif] text-xl md:text-2xl font-bold uppercase tracking-widest transition-colors duration-300 ${
              activeTab === 'combat' 
                ? 'text-[#e6c278] drop-shadow-[0_0_12px_rgba(230,194,120,0.9)]' 
                : 'text-[#8a857a] group-hover:text-[#e0ded8]'
            }`}>
              ⚔️ Combat Systems
            </span>
          </div>
        </button>

        {/* MOBILITY & TRAVERSAL SUB-TAB */}
        <button
          onClick={() => setActiveTab('mobility')}
          className={`relative group overflow-hidden rounded-sm border transition-all duration-500 w-full md:w-1/3 h-32 md:h-28 shadow-lg bg-gradient-to-br from-[#121116] to-[#070709] ${
            activeTab === 'mobility'
              ? 'border-[#c3a35e] shadow-[0_0_25px_rgba(195,163,94,0.35)] -translate-y-1'
              : 'border-[#2a2418] hover:border-[#615c52] hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent flex items-center justify-center p-4">
            <span className={`font-['Cormorant_Upright',serif] text-xl md:text-2xl font-bold uppercase tracking-widest transition-colors duration-300 ${
              activeTab === 'mobility' 
                ? 'text-[#e6c278] drop-shadow-[0_0_12px_rgba(230,194,120,0.9)]' 
                : 'text-[#8a857a] group-hover:text-[#e0ded8]'
            }`}>
              🏃 Mobility & Traversal
            </span>
          </div>
        </button>

        {/* STAND COMBAT SUB-TAB */}
        <button
          onClick={() => setActiveTab('stand-combat')}
          className={`relative group overflow-hidden rounded-sm border transition-all duration-500 w-full md:w-1/3 h-32 md:h-28 shadow-lg bg-gradient-to-br from-[#16111f] to-[#070709] ${
            activeTab === 'stand-combat'
              ? 'border-[#c3a35e] shadow-[0_0_25px_rgba(195,163,94,0.35)] -translate-y-1'
              : 'border-[#2a2418] hover:border-[#615c52] hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:12px_12px] opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-[#120a1f]/30 flex items-center justify-center p-4 z-20">
            <span className={`font-['Cormorant_Upright',serif] text-xl md:text-2xl font-bold uppercase tracking-widest transition-colors duration-300 ${
              activeTab === 'stand-combat' 
                ? 'text-[#e6c278] drop-shadow-[0_0_12px_rgba(230,194,120,0.9)]' 
                : 'text-[#8a857a] group-hover:text-[#e0ded8]'
            }`}>
              ✨ Stand Combat
            </span>
          </div>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto">
        {/* =========================================================
            SUBTAB 1: COMBAT
            ========================================================= */}
        {activeTab === 'combat' && (
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Quote Card */}
            <CodexBox 
              title="Mind Over Matter"
              badge="CORE PHILOSOPHY"
              accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
            >
              <p className="text-[#c7c2b5] leading-relaxed text-lg md:text-xl">
                Beyond Bizarre completely redefines action RPG combat by stripping away mindless button spam and inescapable stun-locks. In their place stands a tight, responsive system driven by precision timing, momentum retention, spatial awareness, and deep mechanical mastery.
              </p>
            </CodexBox>

            {/* Core Pillars */}
            <div>
              <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase mb-6 border-b border-[#2a2418] pb-3">
                Core Combat Pillars
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CodexBox title="1. Precision & Power" badge="FOUNDATION">
                  <p className="text-base text-[#9a9488] leading-relaxed">
                    Victory is dictated by calculated decision-making rather than stat checks. Every swing carries recovery frames, making whiff punishing a core neutral tactic.
                  </p>
                </CodexBox>
                <CodexBox title="2. Momentum & Style" badge="FLOW">
                  <p className="text-base text-[#9a9488] leading-relaxed">
                    Custom combo creativity and fluid movement branching build Heat, empowering your Stand abilities and triggering high-damage Overdrive combat states.
                  </p>
                </CodexBox>
                <CodexBox title="3. Reactive Adaptability" badge="DEFENSE">
                  <p className="text-base text-[#9a9488] leading-relaxed">
                    A suite of active defensive options—Parries, Evasive Dodges, and Tech Recoveries—ensures no single offensive meta or infinite string can ever dominate a fight.
                  </p>
                </CodexBox>
              </div>
            </div>

            {/* Universal Offense Framework */}
            <div className="space-y-10">
              <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                Universal Offense Framework
              </h3>

              {/* SECTION 1: LIGHT STRIKES */}
              <CodexBox 
                title="1. Light Strike Series (LMB / M1)" 
                badge="BASIC OFFENSE"
              >
                <p className="text-base md:text-lg text-[#c7c2b5] leading-relaxed mb-6">
                  Light Strikes form the backbone of neutral interactions, pressure strings, and combo extension. They are designed to feel rapid yet weighty, enforcing movement decay to eliminate infinite run-and-strike spamming.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base my-4">
                  <CodexBox title="5-Hit Base String">
                    <p className="text-sm text-[#c7c2b5]">
                      Fluid strike sequence featuring bespoke martial animations for every active Stand, Weapon, or Fighting Style archetype.
                    </p>
                  </CodexBox>
                  <CodexBox title="Pacing & Velocity Decay">
                    <p className="text-sm text-[#c7c2b5]">
                      Forward velocity steadily throttles during consecutive M1 swings to eliminate bunny-hop chasing and enforce spacing discipline.
                    </p>
                  </CodexBox>
                  <CodexBox title="Hitstun Decay Curve">
                    <p className="text-sm text-[#c7c2b5]">
                      Base hitstun reduces by 5% on each subsequent connection within a single combo string, preventing inescapable infinite loops.
                    </p>
                  </CodexBox>
                  <CodexBox title="5th Hit Finisher">
                    <p className="text-sm text-[#c7c2b5]">
                      The 5th strike deals +50% bonus damage and delivers a 35-stud standing knockback, resetting neutral.
                    </p>
                  </CodexBox>
                </div>

                <ul className="list-disc list-inside text-[#c7c2b5] text-base space-y-3 leading-relaxed my-6">
                  <li><strong className="text-[#e6c278]">Uppercut M1 Branch:</strong> Hold <code className="bg-[#18161f] border border-[#3d3423] px-2 py-0.5 text-[#e6c278] font-mono text-sm">Space</code> during the 5th strike to launch both yourself and your target into an airborne juggling state.</li>
                  <li><strong className="text-[#e6c278]">Stand Downslam:</strong> Input LMB immediately following an Uppercut launch to drive the target back into the ground for a forced floor rebound.</li>
                </ul>

                <VideoPlate 
                  title="Move Demonstration: 5-Hit Light Strike Chain & Uppercut Branch"
                  inputTag="LMB x5 / Hold Space on 5th"
                  badge="OFFENSE DEMO"
                  duration="0:14"
                  description="Standard 5-hit M1 light string branching into an Uppercut launcher at the 5th strike to transition directly into an aerial juggle."
                  stats={[
                    { label: "Damage Scale", value: "100% → 150%" },
                    { label: "Hitstun Decay", value: "-5% / hit" },
                    { label: "Knockback", value: "35 Studs" }
                  ]}
                  videoSrc="UNIQUE VIDEO HERE"
                  posterSrc="UNIQUE VIDEO HERE"
                />

                <VideoPlate 
                  title="Move Demonstration: Stand Aerial Downslam"
                  inputTag="Airborne LMB (Post-Uppercut)"
                  badge="COMBO EXTENSION"
                  duration="0:09"
                  description="Executing an aerial M1 following a launcher causes your Stand to slam the opponent straight into the floor, creating a bounce for combo continuation."
                  stats={[
                    { label: "Execution Window", value: "0.8s" },
                    { label: "Rebound Height", value: "12 Studs" },
                    { label: "Heat Gained", value: "+10 Heat" }
                  ]}
                  videoSrc="UNIQUE VIDEO HERE"
                  posterSrc="UNIQUE VIDEO HERE"
                />
              </CodexBox>

              {/* SECTION 2: HEAVY STRIKES WITH DYNAMIC VARIANT SWITCHER */}
              <CodexBox 
                title="2. Heavy Strike (MMB / M2)"
                badge="HEAVY SYSTEM"
              >
                <div className="mb-6">
                  <span className="inline-block text-xs font-['Cormorant_Upright',serif] text-[#e6c278] tracking-widest uppercase font-bold bg-[#14121a] px-4 py-2 border border-[#2a2418] mb-4">
                    Cost: 15 Heat | Cooldown: 5.0 Seconds
                  </span>

                  <p className="text-base md:text-lg text-[#c7c2b5] leading-relaxed">
                    Heavy Strikes, or M2's, are meant to be the most versatile move in your kit. For stand off or specs, this move acts as a heavy punch that knocks away people slightly into the air with soft ragdoll. This also does twice your M1 damage and you slightly move forward. However, it will act as a special move that works with the stand's kit, whether it be a grab, counter, stun move, or combo ender of the sorts. Each stand has a special M2. Universally 5 sec cooldown but costs 15 heat. Use the interactive switcher below to preview all variations:
                  </p>
                </div>

                {/* DYNAMIC HEAVY STRIKE VARIANT SWITCHER */}
                <DynamicVideoPlate 
                  title="Heavy Strike (M2) Tactical Variations"
                  options={heavyStrikeOptions}
                  defaultOptionId="basic"
                  sectionBadge="SELECT M2 VARIANT"
                />
              </CodexBox>
            </div>

            {/* Defense & Guard Systems */}
            <div className="space-y-8">
              <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                Guard (F)
              </h3>

              <CodexBox title="Defensive Stance Framework" badge="DEFENSIVE SYSTEM">
                <p className="text-base md:text-lg text-[#c7c2b5] leading-relaxed mb-6">
                  Your Guard/Block system is your main defense tool that puts the user in a defensive stance. In this state they cannot move, but are impervious to many attacks. However, users must be smart when using this as there are viable counters and ways for opponents to use your blocking stance to their advantage. It is a quite simple mechanic once you get the gist of it.
                </p>

                {/* Guard Endurance */}
                <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                  <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">
                    Guard Endurance
                  </h4>
                  <p className="text-base text-[#c7c2b5]">
                    The guard endurance is simple, you have a bar that is used to see your guard endurance's health. This automatically recharges while you are outside of your guard stance.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-base text-[#c7c2b5]">
                    <li>Blocking attacks will "wear down" that endurance bar, and upon complete depletion you are <strong className="text-[#e6c278]">Guard Broken</strong>.</li>
                    <li>Blocking without receiving any attacks after 4 seconds will cause that bar to slowly deplete with <strong className="text-[#e6c278]">Guard Decay</strong>.</li>
                    <li>Upon using moves such as <strong className="text-[#e6c278]">Perfect Guard</strong>, <strong className="text-[#e6c278]">Reflective Guard</strong> and <strong className="text-[#e6c278]">Evasive Guard</strong> you can recharge the bar.</li>
                  </ul>
                  <p className="text-base text-[#c7c2b5]">
                    Should your block bar be full, it can overlap, (similar to <em>Sparking Mode in Dragon Ball: Sparking Zero</em>), storing as a golden charged bar. Once filled, this can be used as extra guard points as well, however this is used for something even greater!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-base">
                    <CodexBox title="(BREAK) Guard Break">
                      <p className="text-sm text-[#c7c2b5]">
                        The result of your guard bar depleting after either defending a move too strong for your defense, or defending more moves than you can endure. Stun time: 2.5 – 3s. Places offender in <strong className="text-[#e6c278]">Perception Zone</strong>.
                      </p>
                    </CodexBox>
                    <CodexBox title="(DECAY) Guard Decay">
                      <p className="text-sm text-[#c7c2b5]">
                        The result of staying in blocking stance for too long without incoming attacks, over-decaying the bar. Stun time: 1.5 – 2s.
                      </p>
                    </CodexBox>
                  </div>

                  <VideoPlate 
                    title="Defensive Demonstration: Guard Break & Guard Decay"
                    inputTag="Hold F Key"
                    badge="GUARD DEMO"
                    duration="0:14"
                    description="Visual reference demonstrating Guard Break stun state (2.5-3s) and Guard Decay over-holding penalty (1.5-2s)."
                    stats={[
                      { label: "Break Stun", value: "2.5 - 3.0s" },
                      { label: "Decay Stun", value: "1.5 - 2.0s" },
                      { label: "Decay Delay", value: "4.0 Seconds" }
                    ]}
                    videoSrc="UNIQUE VIDEO HERE"
                    posterSrc="UNIQUE VIDEO HERE"
                  />
                </div>

                {/* Perfect Guard / Parry */}
                <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                  <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">
                    Perfect Guard / Parry
                  </h4>
                  <p className="text-base text-[#c7c2b5]">
                    Performed up to 0.2s before a parriable attack. Perfect Guards reward a player by stunning the victim in a state known as <strong className="text-[#e6c278]">Perception Zone</strong>. This stun lasts 3 seconds, allowing you to freely attack your enemy. Perfect Guards also push the player back while the enemy stays in place.
                  </p>
                  <p className="text-base text-[#c7c2b5]">
                    There are 2 types of parries: <strong className="text-[#e6c278]">Light Parries</strong> and <strong className="text-[#e6c278]">Heavy Parries</strong>. Light Parries push you back a little, whereas heavy parries push you back a lot while giving more stun in return. Similar to <em>Zenless Zone Zero</em>.
                  </p>

                  <VideoPlate 
                    title="Defensive Demonstration: Perfect Guard / Parry"
                    inputTag="Timed F Key"
                    badge="PARRY DEMO"
                    duration="0:16"
                    description="Frame-perfect parry execution putting attacker into Perception Zone for 3 seconds."
                    stats={[
                      { label: "Parry Window", value: "0.20 Seconds" },
                      { label: "Perception Zone", value: "3.0 Seconds" },
                      { label: "Types", value: "Light & Heavy" }
                    ]}
                    videoSrc="UNIQUE VIDEO HERE"
                    posterSrc="UNIQUE VIDEO HERE"
                  />
                </div>

                {/* Evasive Guard / Dodge */}
                <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                  <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">
                    Evasive Guard / Dodge
                  </h4>
                  <p className="text-base text-[#c7c2b5]">
                    Performed by side dashing while using guard. Perfect for evading attacks without wasting block points, giving time to counter. Doesn't stun enemy, but punishes end lag. Casting outside zone puts dash on 5s CD and deducts 50 guard points. <em className="text-[#e6c278]">If missed below 2.5% hp explode into a fine red mist.</em>
                  </p>

                  <VideoPlate 
                    title="Defensive Demonstration: Evasive Guard / Dodge"
                    inputTag="Guard + Side Dash"
                    badge="DODGE DEMO"
                    duration="0:12"
                    description="Side-dashing while guarding to evade incoming moves without losing guard points."
                    stats={[
                      { label: "Miss Cooldown", value: "5.0 Seconds" },
                      { label: "Miss Cost", value: "50 Guard Pts" },
                      { label: "Low HP Penalty", value: "Explosion (<2.5%)" }
                    ]}
                    videoSrc="UNIQUE VIDEO HERE"
                    posterSrc="UNIQUE VIDEO HERE"
                  />
                </div>

                {/* Reflective Guard / Reflect */}
                <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                  <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">
                    Reflective Guard / Reflect
                  </h4>
                  <p className="text-base text-[#c7c2b5]">
                    Performed up to 0.3s before a reflectable attack. Reflect works only on projectiles. Unlike perfect parries, it doesn't push the user back, but allows defense against ranged attacks. Reflection speed depends on attack strength, HP, and Block Bar. Animated like <em>Sparking Zero's Sonic Sway</em>.
                  </p>

                  <VideoPlate 
                    title="Defensive Demonstration: Reflective Guard / Reflect"
                    inputTag="Timed F (vs Projectile)"
                    badge="REFLECT DEMO"
                    duration="0:13"
                    description="Reflecting incoming projectiles with precise timing up to 0.3s before impact."
                    stats={[
                      { label: "Reflect Window", value: "0.30 Seconds" },
                      { label: "Target", value: "Projectiles" },
                      { label: "Style", value: "Sonic Sway" }
                    ]}
                    videoSrc="UNIQUE VIDEO HERE"
                    posterSrc="UNIQUE VIDEO HERE"
                  />
                </div>

                {/* Critical Arts / Critical Strike */}
                <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                  <h4 className="text-2xl font-['Gilda_Display',serif] text-[#f21616]">
                    Critical Arts / Critical Strike
                  </h4>
                  <p className="text-base text-[#c7c2b5]">
                    Critical Arts are activated by using your M1 or M2 while in <strong className="text-[#f21616]">Perception Zone</strong> with a fully supercharged guard bar.
                  </p>
                  <p className="text-base text-[#c7c2b5]">
                    Casting initiates a Quick Time Bar where you must hit the casted keybind again. The closer to center, the more powerful the art. Hitting the thin blue inner zone triggers a <strong className="text-[#f21616]">Maximum Critical Strike</strong> for immense damage!
                  </p>

                  <ul className="list-disc list-inside space-y-2 text-base text-[#c7c2b5] my-4">
                    <li>★ M1 leaves opponent stunned; M2 deals Grand Knockback.</li>
                    <li>★ Block bar is fully depleted upon use.</li>
                    <li>★ Places user in <strong className="text-[##f21616]">[Overdrive]</strong> state.</li>
                    <li>★ Damage scales directly with <strong className="text-[##f21616]">WILL</strong> stat.</li>
                    <li>★ Applies debuffs to the victim.</li>
                  </ul>

                  {/* DYNAMIC CRITICAL ART SELECTOR */}
                  <DynamicVideoPlate 
                    title="Critical Art Execution Variants"
                    options={criticalArtOptions}
                    defaultOptionId="m1-max"
                    sectionBadge="SELECT ART VARIANT"
                    variantTheme="red"
                  />
                </div>

                {/* COMBAT ADD-ONS */}
                <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                  <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                    Combat Add-Ons
                  </h3>

                  {/* Combat Tag */}
                  <CodexBox title="Combat Tag System" badge="SYSTEM TAG">
                    <p className="text-base text-[#c7c2b5] leading-relaxed mb-3">
                      Fighting places a tag restricting features like wall running, climbing, NPC interaction, and fast travel.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-[#a09a8e] leading-relaxed">
                      <li>Disabled by defeating opponent, dying, or 30 seconds out of combat.</li>
                      <li>Only landing and receiving damage triggers tag (casting moves alone does not).</li>
                      <li>Combat logging/resetting applies <strong className="text-[#e6c278]">combat LOCK</strong> (1 min fight lockout + highlight).</li>
                      <li>Includes a <strong className="text-[#e6c278]">Combat Apology</strong> pop-up to clear tag after accidental hits.</li>
                    </ul>
                    <VideoPlate 
                      title="System Demonstration: Combat Apology Pop-Up"
                      inputTag="Contextual Pop-Up"
                      badge="COMBAT TAG"
                      duration="0:08"
                      description="Pop-up prompt allowing players to apologize after an accidental hit to immediately exit combat state."
                      stats={[
                        { label: "Tag Duration", value: "30 Seconds" },
                        { label: "Log Penalty", value: "1 Min Lockout" }
                      ]}
                      videoSrc="UNIQUE VIDEO HERE"
                      posterSrc="UNIQUE VIDEO HERE"
                    />
                  </CodexBox>

                  {/* Burst */}
                  <CodexBox title="Burst (Combo Breaker / Anti Team)" badge="COMBO BREAKER">
                    <div className="mb-3">
                      <span className="text-xs font-mono text-[#e6c278] bg-[#14121a] px-3 py-1 border border-[#2a2418]">
                        Cost: 15 Heat [M1] / 15 HP [M2]
                      </span>
                    </div>
                    <p className="text-base text-[#c7c2b5] leading-relaxed mb-3">
                      Holding M1 or M2 while stunned releases a blast of energy blasting nearby enemies away. Features True Block Bypass, True Stun, and Hyper Armor/Counter Bypass. Stuns for 1.0s and scales damage with current combo length.
                    </p>
                    <VideoPlate 
                      title="System Demonstration: Stand/Spec Combo Breaker Burst"
                      inputTag="Hold M1 / M2 during Stun"
                      badge="COMBO BREAKER"
                      duration="0:11"
                      description="Executing a Burst while stunned to blast surrounding enemies away with True Block Bypass and 1.0s AOE stun."
                      stats={[
                        { label: "AOE Stun", value: "1.0 Second" },
                        { label: "Properties", value: "True Bypass" },
                        { label: "Scaling", value: "Combo Length" }
                      ]}
                      videoSrc="UNIQUE VIDEO HERE"
                      posterSrc="UNIQUE VIDEO HERE"
                    />
                  </CodexBox>

                  {/* Finishers & Combo Scaling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CodexBox title="Finishers" badge="MASTERY">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed">
                        Unlocked upon mastering stand/spec/weapon. Most knockback moves feature universal finishers sending victims flying further, similar to <em>Roblox is Unbreakable</em>.
                      </p>
                    </CodexBox>

                    <CodexBox title="Combo Scaling" badge="BALANCE">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed">
                        Longer combos reduce damage output. Moves retain 100% strength up to B Style Rank, then lose 10% damage per subsequent tier.
                      </p>
                    </CodexBox>
                  </div>

                  {/* Targeting Mechanics */}
                  <CodexBox title="Targeting & Sense Mechanics" badge="TARGETING">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="p-3 bg-[#0a0a0d] border border-[#1a1820]">
                        <strong className="text-[#e6c278] block font-['Gilda_Display',serif] text-base mb-1">Target Mark [L]</strong>
                        Locks onto opponent without facing them, granting auto-aim to projectiles.
                      </div>
                      <div className="p-3 bg-[#0a0a0d] border border-[#1a1820]">
                        <strong className="text-[#e6c278] block font-['Gilda_Display',serif] text-base mb-1">Spiritual Sight [Hold L]</strong>
                        Reveals inner Will Power auras, sensing stands and Burst users through obstacles.
                      </div>
                      <div className="p-3 bg-[#0a0a0d] border border-[#1a1820]">
                        <strong className="text-[#e6c278] block font-['Gilda_Display',serif] text-base mb-1">Target Re-Lock [Hold L + Mark]</strong>
                        Tracks opponent positions through buildings based on stat upgrades.
                      </div>
                    </div>
                    <VideoPlate 
                      title="System Demonstration: Spiritual Sight & Target Tracking"
                      inputTag="L / Hold L Key"
                      badge="TARGET SYSTEM"
                      duration="0:14"
                      description="Demonstrating Spiritual Sight aura vision through obstacles and soft auto-aim targeting."
                      stats={[
                        { label: "Target Lock", value: "Soft Directional" },
                        { label: "Obstacle Bypass", value: "Active" }
                      ]}
                      videoSrc="UNIQUE VIDEO HERE"
                      posterSrc="UNIQUE VIDEO HERE"
                    />
                  </CodexBox>

                  {/* Joestar's Will */}
                  <CodexBox title="Joestar’s Will" badge="WILL POWER">
                    <p className="text-base text-[#c7c2b5] leading-relaxed">
                      Special mechanic scaling with <strong className="text-[#e6c278]">WILL</strong> stat. Equipping a <strong className="text-[#e6c278]">Joestar’s Mark</strong> grants specialized buffs (e.g. Dark Determination, Burning Passion). Activated via MMB after a Critical Art while in <strong className="text-[#e6c278]">[Overdrive]</strong>.
                    </p>
                  </CodexBox>
                </div>

                {/* GAUGE AND STYLE SYSTEMS */}
                <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                  <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                    Gauge and Style Systems
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                    <CodexBox title="Health/Vitality Gauge">
                      <p className="text-xs text-[#c7c2b5]">Displays HP and remaining damage tolerance before defeat.</p>
                    </CodexBox>
                    <CodexBox title="Level / XP Gauge">
                      <p className="text-xs text-[#c7c2b5]">Tracks overall level and progress toward next node point.</p>
                    </CodexBox>
                    <CodexBox title="Heat Gauge (0 - 100)">
                      <p className="text-xs text-[#c7c2b5]">Divided into 20-point bars. Built via parries, dodges, combos, and low HP scaling.</p>
                    </CodexBox>
                  </div>

                  {/* Combo Style Ranks */}
                  <CodexBox title="Combo Style Ranks (DMC-Inspired)" badge="STYLE SYSTEM">
                    <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                      Built by attacking creatively. Repeating identical moves degrades rank. Inactivity decays rank, but taking damage pauses decay. High ranks reduce cooldowns and windup times!
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 text-center text-xs font-mono">
                      {styleRanks.map((item, idx) => (
                        <div key={idx} className={`p-2.5 bg-[#0a0a0d] border ${item.color} transition-transform hover:scale-105`}>
                          <span className="block text-sm font-bold mb-0.5">{item.rank}</span>
                          <span className="text-[10px] block truncate">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </CodexBox>
                </div>

                {/* STATUS EFFECTS */}
                <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                  <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                    Status Effects
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CodexBox title="[Overwhelmed]" badge="DEBUFF">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-2">
                        Triggered taking combo damage reaching A Rank. Blurs vision 8%, darkens 6%, adds vignette. Clears after 5s without damage or using Burst.
                      </p>
                    </CodexBox>

                    <CodexBox title="[Overdrive]" badge="BUFF">
                      <ul className="text-xs text-[#c7c2b5] space-y-1 list-disc list-inside">
                        <li>+50% damage, endurance, special power, defense</li>
                        <li>Attacks gain +5% speed per hit (capped at 25%)</li>
                        <li>Restores max heat bar, 25% HP, resets cooldowns</li>
                        <li>Cleanses status effects & increases parry windows</li>
                      </ul>
                    </CodexBox>
                  </div>

                  {/* DOT Cards */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-['Gilda_Display',serif] text-[#e6c278]">DOT Indicators & Body Part Damage</h4>
                    <p className="text-xs text-[#a09a8e]">All DOT effects last 4 seconds. Stacking same tier increases tier (Tier 1 + Tier 1 = Tier 2).</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                      <StatusEffectCard
                        type="bleed"
                        title="Bleed"
                        badgeText="Debuff"
                        duration="DOT"
                        description="Causes continuous damage over time and reduces overall movement speed."
                        stats="Less Speed"
                      />
                      <StatusEffectCard
                        type="burn"
                        title="Burn"
                        badgeText="Debuff"
                        duration="DOT"
                        description="Sears the victim, draining stamina and reducing max endurance pool."
                        stats="Less Endurance"
                      />
                      <StatusEffectCard
                        type="poison"
                        title="Poison"
                        badgeText="Toxic"
                        duration="DOT"
                        description="Corrodes defensive capabilities while draining endurance over time."
                        stats="Endurance + Defense"
                      />
                      <StatusEffectCard
                        type="wither"
                        title="Wither"
                        badgeText="Curse"
                        duration="Debuff"
                        description="Severely dampens health regeneration rates and impairs endurance recovery."
                        stats="Regen + Endurance"
                      />
                    </div>

                    <CodexBox title="Body Part Damage Breakdown" badge="LOCATIONAL DAMAGE">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#c7c2b5]">
                        <div>• <strong className="text-[#e6c278]">Skull:</strong> Blur + Ringing SFX, Stun increase, Slowness</div>
                        <div>• <strong className="text-[#e6c278]">Torso:</strong> Reduced endurance & damage resistance</div>
                        <div>• <strong className="text-[#e6c278]">Legs:</strong> Sprint, jump, and speed nerfed</div>
                        <div>• <strong className="text-[#e6c278]">Arms:</strong> Block & damage nerfed, ledge grab jump spam</div>
                      </div>
                    </CodexBox>
                  </div>
                </div>

                {/* ADVANCED COMBAT MECHANICS */}
                <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                  <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                    Advanced Combat Mechanics
                  </h3>

                  <CodexBox title="Dynamic Destruction & Stage Pinning" badge="MAP DESTRUCTION">
                    <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                      Knocking enemies into walls enables continuous wall-pin combos until wall destruction. Destroying walls grants +15% bonus damage. Select maps support full Stage Destruction!
                    </p>
                    <VideoPlate 
                      title="Advanced Demonstration: Dynamic Wall Destruction & Pin"
                      inputTag="Heavy Knockback to Wall"
                      badge="DESTRUCTION"
                      duration="0:16"
                      description="Knocking an opponent into destructible map walls to initiate a wall-pin combo string until wall collapse."
                      stats={[
                        { label: "Wall Damage", value: "+15% Extra" },
                        { label: "Knockback Range", value: "25 - 75 Studs" }
                      ]}
                      videoSrc="UNIQUE VIDEO HERE"
                      posterSrc="UNIQUE VIDEO HERE"
                    />
                  </CodexBox>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CodexBox title="Long Range & Mixing" badge="NEUTRAL">
                      <p className="text-xs text-[#c7c2b5] leading-relaxed">
                        Features options like Flash Step approach or ranged projectiles (guns) to maintain style rank without burning close-combat moves.
                      </p>
                    </CodexBox>

                    <CodexBox title="Move Shift Mechanic" badge="VARIANT TECH">
                      <p className="text-xs text-[#c7c2b5] leading-relaxed">
                        Allows unlocking move variants by executing a move WHILE another action is being performed mid-animation or windup.
                      </p>
                    </CodexBox>
                  </div>
                </div>
              </CodexBox>
            </div>
          </section>
        )}

        {/* =========================================================
            SUBTAB 2: MOBILITY
            ========================================================= */}
        {activeTab === 'mobility' && (
          <section className="space-y-12">
            <CodexBox 
              title="Combat IS Movement"
              badge="TRAVERSAL PHILOSOPHY"
              accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
            >
              <p className="text-[#c7c2b5] leading-relaxed text-lg md:text-xl">
                Movement in Beyond Bizarre is not merely traversal—it is an offensive and defensive weapon. Positioning, verticality, momentum preservation, and recovery techniques seamlessly connect directly into combat strings.
              </p>
            </CodexBox>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ground Mobility Suite */}
              <CodexBox title="Ground & Dash Suite" badge="GROUND MOVEMENT">
                <ul className="list-disc list-inside text-base text-[#c7c2b5] space-y-3 leading-relaxed mb-6">
                  <li><strong className="text-[#e6c278]">Omnidirectional Dashes (<code className="font-mono text-sm">Q + Direction</code>):</strong> Directional bursts with invincibility frames on startup.</li>
                  <li><strong className="text-[#e6c278]">Burst Dash:</strong> Double tap direction while sprinting for explosive acceleration.</li>
                  <li><strong className="text-[#e6c278]">Flash Step (<code className="font-mono text-sm">Shift + Q</code>):</strong> Short-range instant teleportation auto-orienting relative to target.</li>
                  <li><strong className="text-[#e6c278]">Momentum Sliding (<code className="font-mono text-sm">C / Crouch while sprinting</code>):</strong> Duck under high projectiles while carrying slope momentum.</li>
                </ul>

                <VideoPlate 
                  title="Mobility Demonstration: Omnidirectional Dashes & Momentum Sliding"
                  inputTag="Q + Direction / Shift + Q"
                  badge="TRAVERSAL"
                  duration="0:14"
                  description="Chaining a side dash into a momentum slide under a projectile, ending with a Flash Step behind the opponent."
                  stats={[
                    { label: "Dash I-Frames", value: "6 Frames" },
                    { label: "Slide Speed", value: "+30% Boost" },
                    { label: "Stamina Cost", value: "15 Stamina" }
                  ]}
                  videoSrc="UNIQUE VIDEO HERE"
                  posterSrc="UNIQUE VIDEO HERE"
                />
              </CodexBox>

              {/* Verticality & Environment */}
              <CodexBox title="Verticality & Traversals" badge="AIR & WALLS">
                <ul className="list-disc list-inside text-base text-[#c7c2b5] space-y-3 leading-relaxed mb-6">
                  <li><strong className="text-[#e6c278]">Wall Running & Vaulting:</strong> Sprinting into vertical surfaces scales walls up to stamina limit.</li>
                  <li><strong className="text-[#e6c278]">Ledge Grabs & Climb Recovery:</strong> Automatic ledge snapping when falling near elevated platforms.</li>
                  <li><strong className="text-[#e6c278]">Air Recovery / Tech Roll:</strong> Press jump upon touching ground during ragdoll state to instantly recover feet.</li>
                  <li><strong className="text-[#e6c278]">Stand Launch:</strong> Command Stand to propel you upward for extreme vertical height.</li>
                </ul>

                <VideoPlate 
                  title="Mobility Demonstration: Wall Running & Tech Roll Recovery"
                  inputTag="Jump on Impact / Space at Wall"
                  badge="RECOVERY"
                  duration="0:16"
                  description="Demonstrating a wall run climb to re-engage, followed by a Tech Roll recovery after being knocked down."
                  stats={[
                    { label: "Wall Climb Height", value: "30 Studs" },
                    { label: "Tech Roll Window", value: "0.25 Seconds" },
                    { label: "Invincibility", value: "On Recovery" }
                  ]}
                  videoSrc="UNIQUE VIDEO HERE"
                  posterSrc="UNIQUE VIDEO HERE"
                />
              </CodexBox>
            </div>
          </section>
        )}

        {/* =========================================================
            SUBTAB 3: STAND COMBAT
            ========================================================= */}
        {activeTab === 'stand-combat' && (
          <section className="space-y-12">
            <CodexBox 
              title="Manifestation of the Soul"
              badge="STAND OVERVIEW"
              accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
            >
              <p className="text-[#c7c2b5] leading-relaxed text-lg md:text-xl">
                Stands operate as distinct entity overlays that extend reach, provide independent hurtboxes, and modify core combat properties. Mastering Stand positioning and activation timing is essential to high-level play.
              </p>
            </CodexBox>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CodexBox title="Stand Summoning & Off-Body Combat" badge="STAND BASICS">
                <ul className="list-disc list-inside text-base text-[#c7c2b5] space-y-3 leading-relaxed mb-6">
                  <li><strong className="text-[#e6c278]">Stand On/Off (<code className="font-mono text-sm">E</code>):</strong> Toggle Stand manifestation. Boosts reach and unlocks unique move trees.</li>
                  <li><strong className="text-[#e6c278]">Pilot Mode:</strong> Remote-control Stand away from user body at the cost of shared damage.</li>
                  <li><strong className="text-[#e6c278]">Stand Barrages:</strong> Rapid multi-hit strike sequences capable of clashing against opposing barrages.</li>
                </ul>

                <VideoPlate 
                  title="Stand Demonstration: Stand Summoning & Barrage Clashing"
                  inputTag="E Key / Hold Special"
                  badge="STAND DEMO"
                  duration="0:15"
                  description="Manifesting Stand during combo neutral, escalating into a full Stand Barrage clash against enemy Stand."
                  stats={[
                    { label: "Summon Delay", value: "Instant" },
                    { label: "Reach Bonus", value: "+40% Range" },
                    { label: "Clash State", value: "Equal Speed" }
                  ]}
                  videoSrc="UNIQUE VIDEO HERE"
                  posterSrc="UNIQUE VIDEO HERE"
                />
              </CodexBox>

              <CodexBox title="Advanced Stand Techniques" badge="ADVANCED TECH">
                <ul className="list-disc list-inside text-base text-[#c7c2b5] space-y-3 leading-relaxed mb-6">
                  <li><strong className="text-[#e6c278]">Stand Cancelling:</strong> Desummon Stand mid-animation to eliminate recovery frames and setup mixups.</li>
                  <li><strong className="text-[#e6c278]">Stand Parrying:</strong> Command Stand to absorb incoming high-damage attacks while user maintains free movement.</li>
                  <li><strong className="text-[#e6c278]">Stand Jump Boost:</strong> Synchronize Stand punch into ground with Jump for extreme upward launch.</li>
                </ul>

                <VideoPlate 
                  title="Stand Demonstration: Stand Animation Cancelling"
                  inputTag="E (Mid-Animation)"
                  badge="ADVANCED TECH"
                  duration="0:12"
                  description="Cancelling a heavy Stand finisher recovery frames using Stand-Toggle to execute an instant follow-up strike."
                  stats={[
                    { label: "Frame Saver", value: "14 Frames" },
                    { label: "Heat Cost", value: "10 Heat" },
                    { label: "Difficulty", value: "High" }
                  ]}
                  videoSrc="UNIQUE VIDEO HERE"
                  posterSrc="UNIQUE VIDEO HERE"
                />
              </CodexBox>
            </div>
          </section>
        )}
      </main>

      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
}