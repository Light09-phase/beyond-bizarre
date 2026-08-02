"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  Flame, 
  Swords, 
  Sparkles, 
  Award, 
  BookOpen, 
  Target, 
  Crosshair, 
  Activity, 
  Compass, 
  Layers, 
  Feather, 
  Radio, 
  Info, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Cpu,
  GitBranch,
  ArrowUpRight,
  Lock,
  Unlock,
  CheckCircle2,
  Star,
  Crown
} from 'lucide-react';

// ============================================================================
// ANIMATION & SCROLL UTILITIES
// ============================================================================

function useVisibility(rootMargin = "0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, [rootMargin]);

  return [ref as any, isVisible];
}

const FadeScaleIn: React.FC<{ children: React.ReactNode, delay?: number, className?: string }> = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useVisibility("-40px 0px");
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const ScrollBackground: React.FC<{ activeOpacity?: string, className?: string }> = ({ activeOpacity = "opacity-100", className = "" }) => {
  const [ref, isVisible] = useVisibility("0px 0px");
  return (
    <div
      ref={ref}
      className={`absolute transition-opacity duration-1000 ease-in-out ${
        isVisible ? activeOpacity : "opacity-0"
      } ${className}`}
    />
  );
};

const TypewriterText: React.FC<{ text?: string, delay?: number, speed?: number, className?: string }> = ({ text = "", delay = 0, speed = 10, className = "" }) => {
  const [ref, isVisible] = useVisibility("-20px 0px");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCharCount(0); 
      return;
    }
    setCharCount(0); 
    const timeout = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        if (i <= text.length) {
          setCharCount(i);
          i += 2; 
        } else {
          clearInterval(timer);
        }
      }, speed);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isVisible, text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      {text.substring(0, charCount)}
      <span className="opacity-0">{text.substring(charCount)}</span>
    </span>
  );
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type MainTab = 'overview' | 'core-mechanics' | 'progression';
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
  variantTheme?: 'gold' | 'red' | 'purple' | 'cyan';
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
  title?: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
}

interface StatAttribute {
  id: string;
  name: string;
  icon: React.ReactNode;
  currentValue: number;
  maxValue: number;
  scalingBonus: string;
  description: string;
  keyUnlocks: string[];
}

interface SkillNode {
  id: string;
  title: string;
  treeBranch: 'combat' | 'stand' | 'survival';
  tier: number;
  cost: number;
  unlocked: boolean;
  description: string;
  perks: string[];
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
    badge: "HEAVY COMBO ENDER",
    duration: "0:12",
    inputTag: "M2 / RMB",
    description: "Used while grounded; can be used to end combos or as a quick way to destroy defensive options if used right. Usable casually, but can be parried, so use wisely. Deals triple M1 damage with soft ragdoll launch.",
    properties: ["Guard Break", "Light Parriable", "Super Knockback & Ragdoll"],
    stats: [{ label: "Damage", value: "3x M1 Base" }, { label: "Heat Cost", value: "15 Heat" }, { label: "Cooldown", value: "2.0s" }],
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
    properties: ["Guard Bypass", "Parriable", "Super Knockback & Ragdoll", "Grand Down-Spike", "Rebound"],
    stats: [{ label: "Spike Type", value: "Grand Down-Spike" }, { label: "Guard Property", value: "Guard Bypass" }, { label: "Cooldown", value: "2.0s" }],
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
    properties: ["Guard Bypass", "Parriable", "Super Knockback & Ragdoll", "Grand Up-Spike"],
    stats: [{ label: "Spike Type", value: "Grand Up-Spike" }, { label: "Guard Property", value: "Guard Bypass" }, { label: "Cooldown", value: "2.0s" }],
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
    properties: ["Guard Break", "Parriable", "Grounded & Ragdoll Bypass", "Ground Pin"],
    stats: [{ label: "Pin Property", value: "Ground Pin" }, { label: "Bypass", value: "Grounded & Ragdoll" }, { label: "Cooldown", value: "2.0s" }],
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
    properties: ["Guardable", "Parriable", "Super Knockback & Ragdoll", "Grand Upper Strike"],
    stats: [{ label: "Strike Type", value: "Grand Upper" }, { label: "Guard Property", value: "Guardable" }, { label: "Cooldown", value: "2.0s" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "flash",
    label: "Flash Strike & Flash Rush",
    badge: "TELEPORTING STRIKE",
    duration: "0:15",
    inputTag: "Flash Step + M2",
    description: "Instantaneous strike that can surprise opponents with a sudden strike. Effective range is roughly half of flash step range. Can chain into Flash Rush by using your M2 multiple times in succession that end in a Down Strike. [Limit decided by skill tree upgrades].",
    properties: ["Guardable", "Parriable", "Super Knockback & Ragdoll"],
    stats: [{ label: "Strike Type", value: "Stun & Down Spike" }, { label: "Effective Range", value: "1/2 Flash-Step Range" }, { label: "Chain Input", value: "M2 After Flash-Step" }, { label: "Guard Property", value: "Light Parriable" }, { label: "Finisher", value: "Down Strike" }, { label: "Cooldown", value: "2.0s & 8.0s" }],
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
    properties: ["Mutual Pushback", "No Victor", "Stun Neutralization", "2/3 used heat refunded"],
    stats: [{ label: "Result", value: "Mutual Pushback" }, { label: "Victor", value: "None" }, { label: "Cooldown", value: "10.0s Triggered" }, { label: "Heat", value: "10 heat refund" }],
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

const mobilityOptions: VideoOption[] = [
  {
    id: "walk-sprint",
    label: "3-Stage Walk / Run / Sprint",
    badge: "GROUND TRAVERSAL",
    duration: "0:10",
    inputTag: "WASD + Left Shift / Ctrl",
    description: "Seamlessly transition between Walk, Combat Run, and Full Sprint. Higher speed stages increase directional momentum for air launches, slide cancels, and evasive repositioning.",
    properties: ["3 Velocity Tiers", "Momentum Retention", "Stamina Passive"],
    stats: [{ label: "Walk Speed", value: "12 Studs/s" }, { label: "Run Speed", value: "22 Studs/s" }, { label: "Sprint Speed", value: "36 Studs/s" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "flash-step",
    label: "Flash Step & Directional Evade",
    badge: "BURST MOBILITY",
    duration: "0:12",
    inputTag: "Q + Direction Key",
    description: "Instant high-speed blink in any chosen cardinal or diagonal direction. Grants brief invincible frames (i-frames) and instantly cancels recovery frames from non-committal attacks.",
    properties: ["Invincibility Frames", "Recovery Cancel", "Omnidirectional"],
    stats: [{ label: "Distance", value: "28 Studs" }, { label: "i-Frames", value: "0.18 Seconds" }, { label: "Cooldown", value: "3.5s Base" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "wall-run",
    label: "Wall Run & Ledge Vaulting",
    badge: "VERTICALITY",
    duration: "0:14",
    inputTag: "Hold Space against Vertical Surface",
    description: "Run directly up or along horizontal wall surfaces for up to 3 seconds. Pressing Jump during a Wall Run launches you into a High Vertical Leap or Wall Kick off the surface.",
    properties: ["Vertical Traversal", "Wall Kick Launch", "Auto-Ledge Grab"],
    stats: [{ label: "Max Run Duration", value: "3.0 Seconds" }, { label: "Wall Kick Force", value: "45 Studs Vector" }, { label: "Ledge Snap", value: "Instant" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "tech-recovery",
    label: "Tech Recovery & Air Teching",
    badge: "RECOVERY TECH",
    duration: "0:11",
    inputTag: "Space or Roll on Surface Contact",
    description: "When launched or knocked down by soft ragdolls, precise timing upon touching any surface allows you to Tech Roll to immediately regain footing, bypassing wakeup pressure.",
    properties: ["Wakeup Bypass", "Knockback Reset", "Invulnerable Tech Roll"],
    stats: [{ label: "Timing Window", value: "0.25 Seconds" }, { label: "Heat Cost", value: "10 Heat (Air Tech)" }, { label: "I-Frames", value: "0.3s" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "momentum-slide",
    label: "Momentum Preservation & Slide Cancel",
    badge: "MOMENTUM TECH",
    duration: "0:13",
    inputTag: "Crouch (C) during High Speed Sprint",
    description: "Convert high sprint velocity into a low-profile ground slide that evades high-hitbox projectiles. Can be weapon-switched or jump-canceled mid-slide for extreme neutral mixups.",
    properties: ["Hitbox Reduction", "Jump-Cancelable", "Speed Carryover"],
    stats: [{ label: "Slide Distance", value: "20 Studs" }, { label: "Speed Carry", value: "115% Base Sprint" }, { label: "Cooldown", value: "1.5s" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "stand-assisted",
    label: "Stand-Assisted Traversal & Gliding",
    badge: "SPECTRAL MOBILITY",
    duration: "0:15",
    inputTag: "Hold Jump with Active Stand",
    description: "Utilize your active Stand's kinetic force to perform boosted super leaps or hover gracefully through airborne neutral space, extending air time and repositioning range.",
    properties: ["Air Hover", "Boosted Jump Vector", "Stand Heat Drain"],
    stats: [{ label: "Jump Height", value: "+80% Base Height" }, { label: "Glide Speed", value: "26 Studs/s" }, { label: "Drain Rate", value: "2 Heat/s" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  }
];

const standCombatOptions: VideoOption[] = [
  {
    id: "stand-summon",
    label: "Stand Summoning & Stance Switching",
    badge: "SPECTRAL MANIFEST",
    duration: "0:10",
    inputTag: "E Key (Toggle)",
    description: "Summon or recall your Stand entity into battle. Manifesting your Stand alters your movement speed, expands melee reach, and unlocks specialized Stand move-sets.",
    properties: ["Stance Swap", "Reach Expansion", "Quick-Summon Cancel"],
    stats: [{ label: "Summon Speed", value: "0.15s Startup" }, { label: "Cooldown", value: "1.0s Toggle" }, { label: "Range Boost", value: "+3.5 Studs" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "barrage-clash",
    label: "Stand Barrage & Barrage Clashing",
    badge: "HIGH FREQUENCY ATTACK",
    duration: "0:16",
    inputTag: "E / R Key (Hold or Press)",
    description: "Unleash a devastating high-speed punch barrage dealing multi-hit stun damage. Colliding with an opposing Stand's barrage initiates an active Barrage Clash QTE exchange!",
    properties: ["Multi-Hit Stun", "Clash Initiation", "Super Armor Frames"],
    stats: [{ label: "Hit Rate", value: "18 Hits/sec" }, { label: "Heat Gain", value: "+1.5 per Hit" }, { label: "Clash Multiplier", value: "100% Heat Drain" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "pilot-mode",
    label: "Remote Pilot Mode & Projection",
    badge: "REMOTE CONTROL",
    duration: "0:18",
    inputTag: "Shift + E (Long Distance)",
    description: "Detach your Stand from your physical body, controlling the spectral avatar across long distances. Damage dealt to the Stand transfers to user, while your body remains vulnerable.",
    properties: ["Long Distance Tether", "Body Vulnerability", "Damage Reflection"],
    stats: [{ label: "Max Tether", value: "120 Studs" }, { label: "Pilot Speed", value: "32 Studs/s" }, { label: "Dmg Transfer", value: "100% User" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "stand-leap",
    label: "Stand Traversal & High Leaps",
    badge: "SPECTRAL LAUNCH",
    duration: "0:12",
    inputTag: "Space + Stand Ability",
    description: "Use your Stand's physical prowess to propel your character across massive vertical or horizontal distances, clearing arenas or initiating aerial drop-down strikes.",
    properties: ["Super Launch", "Impact Shockwave", "Aerial Transition"],
    stats: [{ label: "Launch Height", value: "55 Studs" }, { label: "Heat Cost", value: "10 Heat" }, { label: "Cooldown", value: "4.0s" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "stand-guard",
    label: "Sub-Stand Auto-Guard & Defenses",
    badge: "SPECTRAL SHIELD",
    duration: "0:14",
    inputTag: "F Key (Stand Active)",
    description: "When guarding with your Stand active, the Stand physicalizes in front of you, taking the brunt of incoming attacks and absorbing 25% extra guard damage before breaking.",
    properties: ["Enhanced Guard Capacity", "Reflective Block", "Heavy Armor"],
    stats: [{ label: "Guard Boost", value: "+30% Resilience" }, { label: "Block Stun", value: "-15% Duration" }, { label: "Heat Save", value: "Passive" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  },
  {
    id: "awakening-state",
    label: "Stand Awakening & Requiem Overdrive",
    badge: "SPECTRAL TRANSCENDENCE",
    duration: "0:20",
    inputTag: "G Key (100% Heat / Max Overdrive)",
    description: "Unleash the full latent potential of your Stand. Enters an empowered state with visual spectral aura, zero barrage cooldowns, boosted strike damage, and unique ultimate arts.",
    properties: ["Full Stat Overcharge", "Zero Cooldown Barrage", "Immunity Frames"],
    stats: [{ label: "Duration", value: "15.0 Seconds" }, { label: "Damage Buff", value: "+35% Global" }, { label: "Cooldown Reduct.", value: "50%" }],
    videoSrc: "UNIQUE VIDEO HERE",
    posterSrc: "UNIQUE VIDEO HERE"
  }
];

const statAttributesList: StatAttribute[] = [
  {
    id: "strength",
    name: "Strength & Physicality",
    icon: <Swords className="w-5 h-5 text-[#e6c278]" />,
    currentValue: 85,
    maxValue: 100,
    scalingBonus: "+1.8% Physical Strike Damage per point",
    description: "Governs base M1/M2 strike force, wall-destruction impact power, and heavy attack knockback distance. High strength breaks opponent defense faster.",
    keyUnlocks: ["Heavy Strike Shatter Tier I", "Wall Pin Slam Multiplier", "Hyper Armor Break Threshold"]
  },
  {
    id: "will",
    name: "Joestar's Will & Spirit",
    icon: <Sparkles className="w-5 h-5 text-[#e6c278]" />,
    currentValue: 90,
    maxValue: 100,
    scalingBonus: "+2.2% Critical Art Damage & +0.5s Overdrive",
    description: "Scales Maximum Critical Strike damage, Joestar's Mark activation efficiency, and status effect resistance. Essential for unleashing explosive comeback finishers.",
    keyUnlocks: ["Critical QTE Green Zone Expansion", "Overdrive Regeneration Boost", "True Will Burst Resistance"]
  },
  {
    id: "endurance",
    name: "Endurance & Fortitude",
    icon: <Shield className="w-5 h-5 text-[#e6c278]" />,
    currentValue: 75,
    maxValue: 100,
    scalingBonus: "+15 Max Health & +2% Guard Bar Resilience",
    description: "Expands your overall health pool and fortifies your Guard stance. Higher endurance slows down Guard Decay and accelerates guard recharge speed.",
    keyUnlocks: ["Iron Guard Shielding", "Bleed & Poison Resistance II", "Second Wind Health Threshold"]
  },
  {
    id: "agility",
    name: "Agility & Speed",
    icon: <Activity className="w-5 h-5 text-[#e6c278]" />,
    currentValue: 80,
    maxValue: 100,
    scalingBonus: "+0.8 Studs/s Sprint & +10% Flash Step Distance",
    description: "Increases movement velocity across all 3 ground speed stages, extends Flash Step reach, and reduces dodge recovery lag for high-mobility playstyles.",
    keyUnlocks: ["Triple Flash Rush Combo Chain", "Wall Run Duration Extension", "Air Tech Recovery Frame Saver"]
  },
  {
    id: "stand-power",
    name: "Stand Mastery & Control",
    icon: <Zap className="w-5 h-5 text-[#e6c278]" />,
    currentValue: 88,
    maxValue: 100,
    scalingBonus: "+2.0% Stand Special Move Damage & +5 Studs Tether",
    description: "Enhances Stand barrage strike power, extends Remote Pilot mode tether distance, and reduces Stand summon startup frames.",
    keyUnlocks: ["Barrage Clash Overpower Multiplier", "Sub-Stand Auto-Guard Trigger", "Requiem Awakening Duration Extension"]
  },
  {
    id: "precision",
    name: "Precision & Perception",
    icon: <Crosshair className="w-5 h-5 text-[#e6c278]" />,
    currentValue: 70,
    maxValue: 100,
    scalingBonus: "+0.02s Parry Timing Window & +15% Auto-Lock",
    description: "Widens the Perfect Guard / Parry window, expands the center Blue QTE zone during Critical Arts, and improves Spiritual Sight lock accuracy.",
    keyUnlocks: ["Sonic Reflect Timing Expansion", "Perception Zone Stun Extension (+0.5s)", "Maximum Critical Blue Zone Precision"]
  }
];

const skillTreeNodesList: SkillNode[] = [
  {
    id: "node-c1",
    title: "Light String Mastery",
    treeBranch: "combat",
    tier: 1,
    cost: 2,
    unlocked: true,
    description: "Unlocks the 5th M1 chain strike with +50% bonus damage and 35-stud knockback.",
    perks: ["5-Hit M1 Chain Unlock", "+50% Finisher Damage", "Aerial M1 Juggle Enabled"]
  },
  {
    id: "node-c2",
    title: "Flash Rush Finisher",
    treeBranch: "combat",
    tier: 2,
    cost: 4,
    unlocked: true,
    description: "Allows chaining up to 3 Flash Strikes in rapid sequence after a Flash Step.",
    perks: ["Flash Rush Combo Multiplier", "Teleporting Air Down-Spike", "Guard Pressure Boost"]
  },
  {
    id: "node-s1",
    title: "Spectral Barrage Overcharge",
    treeBranch: "stand",
    tier: 1,
    cost: 3,
    unlocked: true,
    description: "Increases Stand barrage hit frequency by 25% and boosts barrage clash winning odds.",
    perks: ["18 Hits/Sec Barrage Speed", "+15% Barrage Clash Pressure", "Heat Regeneration on Hit"]
  },
  {
    id: "node-s2",
    title: "Remote Pilot Projection",
    treeBranch: "stand",
    tier: 2,
    cost: 5,
    unlocked: false,
    description: "Unlocks long-distance Stand control up to 120 studs away from character body.",
    perks: ["Remote Pilot Tether", "Spectral Stealth Mode", "Long-Range Drop Strike"]
  },
  {
    id: "node-v1",
    title: "Tech Recovery & Roll",
    treeBranch: "survival",
    tier: 1,
    cost: 2,
    unlocked: true,
    description: "Timing jump on surface contact instantly resets ragdoll state into a invulnerable Tech Roll.",
    perks: ["Soft Ragdoll Instant Reset", "0.3s Invincibility Window", "Wakeup Counter Opportunity"]
  },
  {
    id: "node-v2",
    title: "Overdrive Transcendance",
    treeBranch: "survival",
    tier: 3,
    cost: 6,
    unlocked: false,
    description: "Entering Overdrive restores 25% max HP, resets all cooldowns, and boosts speed by 25%.",
    perks: ["Full Status Effect Cleanse", "25% Instant Health Restore", "50% Global Damage Reduction"]
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
    <FadeScaleIn className={className}>
      <div className={`group relative bg-[#0a0a0d] border ${accentColor} transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(195,163,94,0.18)] p-6 rounded-sm overflow-hidden h-full`}>
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
    </FadeScaleIn>
  );
};

// ============================================================================
// VIDEO COMPONENT BOILERPLATES
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
    <FadeScaleIn className="my-6">
      <div className="group relative bg-[#0a0a0d] border border-[#2a2418] hover:border-[#c3a35e] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(195,163,94,0.22)] rounded-sm">
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

        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 relative aspect-video bg-[#121216] overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[#2a2418]">
            <ScrollBackground className="bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:14px_14px] group-hover:opacity-30 transition-opacity" activeOpacity="opacity-15" />
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

          <div className="md:col-span-7 p-5 flex flex-col justify-between bg-gradient-to-br from-[#0a0a0d] to-[#050505]">
            <div>
              <h5 className="text-xl font-['Gilda_Display',serif] text-[#e6c278] tracking-wide mb-2 group-hover:text-white transition-colors">
                {title}
              </h5>
              <p className="text-sm md:text-base text-[#b8b3a8] font-['Zen_Old_Mincho',serif] leading-relaxed mb-4">
                <TypewriterText text={description} delay={200} />
              </p>
            </div>

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
    </FadeScaleIn>
  );
};

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

  const themeMap = {
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
    },
    purple: {
      containerHover: 'hover:border-[#c084fc] hover:shadow-[0_0_35px_rgba(192,132,252,0.25)]',
      badge: 'bg-[#a855f7] text-white',
      title: 'text-[#c084fc]',
      tabActive: 'bg-[#260a3d] text-[#c084fc] border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.4)]',
      tabHover: 'hover:border-[#a855f7]/50',
      flash: 'shadow-[0_0_15px_3px_rgba(168,85,247,0.8),0_0_20px_5px_rgba(0,0,0,0.9)] border-[#a855f7]',
      radial: 'bg-[radial-gradient(#a855f7_1px,transparent_1px)]',
      playBtn: 'border-[#c084fc] text-[#c084fc] group-hover:bg-[#a855f7] group-hover:text-white',
      tag: 'bg-[#260a3d] text-[#c084fc] border-[#a855f7]/50',
      propTag: 'text-[#c084fc] border-[#a855f7]/40 bg-[#160b24]',
      stat: 'text-[#c084fc]'
    },
    cyan: {
      containerHover: 'hover:border-[#38bdf8] hover:shadow-[0_0_35px_rgba(56,189,248,0.25)]',
      badge: 'bg-[#0284c7] text-white',
      title: 'text-[#38bdf8]',
      tabActive: 'bg-[#032838] text-[#38bdf8] border-[#0284c7] shadow-[0_0_12px_rgba(2,132,199,0.4)]',
      tabHover: 'hover:border-[#0284c7]/50',
      flash: 'shadow-[0_0_15px_3px_rgba(2,132,199,0.8),0_0_20px_5px_rgba(0,0,0,0.9)] border-[#0284c7]',
      radial: 'bg-[radial-gradient(#0284c7_1px,transparent_1px)]',
      playBtn: 'border-[#38bdf8] text-[#38bdf8] group-hover:bg-[#0284c7] group-hover:text-white',
      tag: 'bg-[#032838] text-[#38bdf8] border-[#0284c7]/50',
      propTag: 'text-[#38bdf8] border-[#0284c7]/40 bg-[#071824]',
      stat: 'text-[#38bdf8]'
    }
  };

  const theme = themeMap[variantTheme] || themeMap.gold;

  return (
    <FadeScaleIn className="my-8">
      <div className={`group relative bg-[#0a0a0d] border border-[#2a2418] transition-all duration-300 transform hover:-translate-y-1 shadow-2xl rounded-sm overflow-hidden ${theme.containerHover}`}>
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

        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 relative aspect-video bg-[#121216] overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[#2a2418]">
            <ScrollBackground className={`[background-size:14px_14px] group-hover:opacity-35 transition-opacity ${theme.radial}`} activeOpacity="opacity-20" />
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
              <p className="text-base text-[#b8b3a8] font-['Zen_Old_Mincho',serif] leading-relaxed mb-4 min-h-[60px]">
                <TypewriterText key={selectedId} text={activeOption.description} delay={200} />
              </p>
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
    </FadeScaleIn>
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
      border: "border-[#f21616] shadow-[0_0_15px_rgba(255,42,75,0.3)] hover:shadow-[0_0_30px_rgba(255,42,75,0.6)]",
      badge: "bg-[#38060c] text-[#f21616] border-[#f21616]",
      title: "text-[#f21616]",
      gradient: "from-[#1a0508] to-[#0a0a0d]",
      pulse: "bg-[#f21616]"
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
    <FadeScaleIn>
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
            <TypewriterText text={description} delay={300} speed={10} />
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 text-xs font-mono text-[#8a857a] flex justify-between items-center">
          <span>DEBUFF</span>
          <span className="text-white font-bold">{stats}</span>
        </div>
      </div>
    </FadeScaleIn>
  );
};

// ============================================================================
// HEADER & FOOTER COMPONENTS
// ============================================================================

const SiteHeader: React.FC = () => {
  return (
    <header className="max-w-7xl mx-auto mb-4 relative border-b border-[#2a2418]">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:16px_16px]" />
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
      
      <div className="relative overflow-hidden bg-[#000000]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:16px_16px]" />
        <ScrollBackground className="bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:16px_16px]" activeOpacity="opacity-[0.09]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-12 md:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#c3a35e]" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#e6c278]">
                  Official Gameplay Unabridgment
                </span>
              </div>

              <FadeScaleIn delay={100}>
                <h1 className="font-[var(--font-gloock)] text-5xl uppercase tracking-tight text-white md:text-7xl">
                  Game{" "}
                  <span className="text-[#c3a35e]">
                    Mechanics
                  </span>
                </h1>
              </FadeScaleIn>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8a857a] md:text-base">
                <TypewriterText text="Master the intricacies of Combat, Movement, Stand Combat, Progression Paths, and advanced mechanics in this complete tactical manual." delay={200} />
              </p>
            </div>

            <FadeScaleIn delay={250}>
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
            </FadeScaleIn>
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

export default function GameGuide() {
  const [activeTab, setActiveTab] = useState<MainTab>('overview');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('combat');
  const [selectedStatId, setSelectedStatId] = useState<string>('strength');
  const [activeBranch, setActiveBranch] = useState<'all' | 'combat' | 'stand' | 'survival'>('all');

  const selectedStatObj = statAttributesList.find(s => s.id === selectedStatId) || statAttributesList[0];

  // Navigation Bar
  const MainNav = () => (
    <nav id="tab-navigation" className="flex space-x-2 sm:space-x-4 mb-10 overflow-x-auto pb-2 border-b border-[#2a2418] pt-2 justify-center max-w-7xl mx-auto z-20 relative">
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex items-center space-x-2 px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
          activeTab === 'overview'
            ? 'bg-[#1c1810] text-[#e6c278] border-[#c3a35e] shadow-[0_0_15px_rgba(195,163,94,0.15)]'
            : 'bg-[#09090c] text-[#8a8578] border-[#1e1b24] hover:text-[#c7c2b5] hover:border-[#3d3322]'
        }`}
      >
        <Info className="w-4 h-4" />
        <span>Overview</span>
      </button>

      <button
        onClick={() => setActiveTab('core-mechanics')}
        className={`flex items-center space-x-2 px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
          activeTab === 'core-mechanics'
            ? 'bg-[#1c1810] text-[#e6c278] border-[#c3a35e] shadow-[0_0_15px_rgba(195,163,94,0.15)]'
            : 'bg-[#09090c] text-[#8a8578] border-[#1e1b24] hover:text-[#c7c2b5] hover:border-[#3d3322]'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span>Core Mechanics</span>
      </button>

      <button
        onClick={() => setActiveTab('progression')}
        className={`flex items-center space-x-2 px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
          activeTab === 'progression'
            ? 'bg-[#1c1810] text-[#e6c278] border-[#c3a35e] shadow-[0_0_15px_rgba(195,163,94,0.15)]'
            : 'bg-[#09090c] text-[#8a8578] border-[#1e1b24] hover:text-[#c7c2b5] hover:border-[#3d3322]'
        }`}
      >
        <TrendingUp className="w-4 h-4" />
        <span>Character Progression</span>
      </button>
    </nav>
  );
  
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0ded8] font-['Zen_Old_Mincho',serif] selection:bg-[#c3a35e] selection:text-black p-4 md:p-10 relative overflow-hidden">
      <ScrollBackground className="top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#322714]/30 via-[#050505]/95 to-transparent pointer-events-none -z-10" activeOpacity="opacity-100" />

      {/* Global Header */}
      <SiteHeader />
      <MainNav />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto">
        
        {/* =========================================================
            TAB 1: OVERVIEW 
            ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <CodexBox 
              title="Welcome to Project Bizarre"
              badge="SYSTEM MANUAL"
              accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
            >
              <p className="text-sm sm:text-base text-[#c7c2b5] leading-relaxed mb-6">
                 Project Bizarre is an action-driven fighting experience built around precision movement, frame-canceling, and Stand synergy. Whether you are engaging in high-stakes PvP duels or mastering world encounters, understanding the foundational mechanics is key to dominance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#1e1a12] pt-6">
                <div className="p-3 bg-[#0d0c10] border border-[#1e1b24]">
                  <div className="text-xs text-[#8a8578] uppercase">Genre</div>
                  <div className="text-sm font-bold text-[#e6c278]">Action Fighter / RPG</div>
                </div>
                <div className="p-3 bg-[#0d0c10] border border-[#1e1b24]">
                  <div className="text-xs text-[#8a8578] uppercase">Controls</div>
                  <div className="text-sm font-bold text-[#e6c278]">Keyboard / Controller</div>
                </div>
                <div className="p-3 bg-[#0d0c10] border border-[#1e1b24]">
                  <div className="text-xs text-[#8a8578] uppercase">Combat Style</div>
                  <div className="text-sm font-bold text-[#e6c278]">Fast-Paced, Multi Layer Complexity</div>
                </div>
              </div>
            </CodexBox>

            {/* Core Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div 
                onClick={() => { 
                  setActiveTab('core-mechanics'); 
                  setActiveSubTab('combat'); 
                  setTimeout(() => {
                    document.getElementById('tab-navigation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="cursor-pointer"
              >
                <CodexBox 
                  title="Prioritized Offense" 
                  badge="COMBAT" 
                  accentColor="border-[#2a2418] hover:border-[#c3a35e]"
                >
                  <div className="w-10 h-10 bg-[#14121a] border border-[#3d3322] flex items-center justify-center mb-4">
                    <Swords className="w-5 h-5 text-[#e6c278]" />
                  </div>
                  <p className="text-xs text-[#8a8578] leading-relaxed">
                    Chain light strikes, heavy punishers, and special moves with tight timing windows. Utilize cancel tech to extend strings or stay safe on block.
                  </p>
                </CodexBox>
              </div>

              <div 
                onClick={() => { 
                  setActiveTab('core-mechanics'); 
                  setActiveSubTab('mobility');
                  setTimeout(() => {
                    document.getElementById('tab-navigation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="cursor-pointer"
              >
                <CodexBox 
                  title="Dynamic Movement" 
                  badge="MOBILITY" 
                  accentColor="border-[#2a2418] hover:border-[#c3a35e]"
                >
                  <div className="w-10 h-10 bg-[#14121a] border border-[#3d3322] flex items-center justify-center mb-4">
                    <Activity className="w-5 h-5 text-[#e6c278]" />
                  </div>
                  <p className="text-xs text-[#8a8578] leading-relaxed">
                    Master perfect parries, directional dashes, and stand-blocking to turn defensive moments into punishing counter-offensives.
                  </p>
                </CodexBox>
              </div>

              <div 
                onClick={() => { 
                  setActiveTab('core-mechanics'); 
                  setActiveSubTab('stand-combat'); 
                  setTimeout(() => {
                    document.getElementById('tab-navigation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="cursor-pointer"
              >
                <CodexBox 
                  title="Stand Combat Improvements" 
                  badge="STANDS" 
                  accentColor="border-[#2a2418] hover:border-[#c3a35e]"
                >
                  <div className="w-10 h-10 bg-[#14121a] border border-[#3d3322] flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-[#e6c278]" />
                  </div>
                  <p className="text-xs text-[#8a8578] leading-relaxed">
                    Summon unique spectral Stand entities to fight alongside you, providing specialized barrage attacks, range extensions, and tactical buffs.
                  </p>
                </CodexBox>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: CORE MECHANICS 
            ========================================================= */}
        {activeTab === 'core-mechanics' && (
          <>
            {/* CORE MECHANICS SUB-TABS */}
            <nav className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row justify-center gap-6">
  
            {/* Combat */}
            <FadeScaleIn className="w-full md:w-1/3" delay={100}>
                <button
                onClick={() => setActiveSubTab('combat')}
                className={`relative group overflow-hidden rounded-sm border transition-all duration-500 w-full h-20 md:h-16 shadow-lg bg-gradient-to-br from-[#121116] to-[#070709] ${
                    activeSubTab === 'combat'
                    ? 'border-[#c3a35e] shadow-[0_0_25px_rgba(195,163,94,0.35)] -translate-y-1'
                    : 'border-[#2a2418] hover:border-[#615c52] hover:-translate-y-0.5'
                }`}
                >
                <ScrollBackground className="bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:12px_12px]" activeOpacity="opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent flex items-center justify-center p-4">
                    <span className={`flex items-center gap-3 font-['Cormorant_Upright',serif] text-xl md:text-2xl font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
                    activeSubTab === 'combat' 
                        ? 'text-[#e6c278] drop-shadow-[0_0_12px_rgba(230,194,120,0.9)]' 
                        : 'text-[#8a857a] group-hover:text-[#e0ded8]'
                    }`}>
                    <Swords className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Combat</span>
                    <Swords className="w-5 h-5 md:w-6 md:h-6" />
                    </span>
                </div>
                </button>
            </FadeScaleIn>

            {/* Mobility */}
            <FadeScaleIn className="w-full md:w-1/3" delay={200}>
                <button
                onClick={() => setActiveSubTab('mobility')}
                className={`relative group overflow-hidden rounded-sm border transition-all duration-500 w-full h-20 md:h-16 shadow-lg bg-gradient-to-br from-[#121116] to-[#070709] ${
                    activeSubTab === 'mobility'
                    ? 'border-[#c3a35e] shadow-[0_0_25px_rgba(195,163,94,0.35)] -translate-y-1'
                    : 'border-[#2a2418] hover:border-[#615c52] hover:-translate-y-0.5'
                }`}
                >
                <ScrollBackground className="bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:12px_12px]" activeOpacity="opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent flex items-center justify-center p-4">
                    <span className={`flex items-center gap-3 font-['Cormorant_Upright',serif] text-xl md:text-2xl font-bold uppercase tracking-widest transition-colors duration-300 ${
                    activeSubTab === 'mobility' 
                        ? 'text-[#e6c278] drop-shadow-[0_0_12px_rgba(230,194,120,0.9)]' 
                        : 'text-[#8a857a] group-hover:text-[#e0ded8]'
                    }`}>
                    <Activity className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Mobility</span>
                    <Activity className="w-5 h-5 md:w-6 md:h-6" />
                    </span>
                </div>
                </button>
            </FadeScaleIn>

            {/* Stand Combat */}
            <FadeScaleIn className="w-full md:w-1/3" delay={300}>
                <button
                onClick={() => setActiveSubTab('stand-combat')}
                className={`relative group overflow-hidden rounded-sm border transition-all duration-500 w-full h-20 md:h-16 shadow-lg bg-gradient-to-br from-[#16111f] to-[#070709] ${
                    activeSubTab === 'stand-combat'
                    ? 'border-[#c3a35e] shadow-[0_0_25px_rgba(195,163,94,0.35)] -translate-y-1'
                    : 'border-[#2a2418] hover:border-[#615c52] hover:-translate-y-0.5'
                }`}
                >
                <ScrollBackground className="bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:12px_12px]" activeOpacity="opacity-15" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-[#120a1f]/30 flex items-center justify-center p-4 z-20">
                    <span className={`flex items-center gap-3 font-['Cormorant_Upright',serif] text-xl md:text-2xl font-bold uppercase tracking-widest transition-colors duration-300 ${
                    activeSubTab === 'stand-combat' 
                        ? 'text-[#e6c278] drop-shadow-[0_0_12px_rgba(230,194,120,0.9)]' 
                        : 'text-[#8a857a] group-hover:text-[#e0ded8]'
                    }`}>
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Stand Combat</span>
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                    </span>
                </div>
                </button>
            </FadeScaleIn>

            </nav>

            {/* COMBAT SUBTAB CONTENT */}
            {activeSubTab === 'combat' && (
              <section className="space-y-12">
                <CodexBox 
                  title="Mind Over Matter"
                  badge="COMBAT OVERVIEW"
                  accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
                >
                  <p className="text-[#c7c2b5] leading-relaxed text-lg md:text-xl">
                    <TypewriterText text="In this game, you have to utilize a series of Skill, Strategy and Style to overcome opponents, so make sure you know exactly how to utilize and take advantage of your strengths and defend your weak points to become a master at combat. The base combat was designed to help new players learn the semi-complex nature of the games combat, and experienced players to compliment their combos. As stated before, you are rewarded for Precision, not mindless Pressure, Style, not Spam, and Skills, not Slop." delay={200} />
                  </p>
                </CodexBox>

                <div>
                  <FadeScaleIn delay={100}>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase mb-6 border-b border-[#2a2418] pb-3">
                      Core Combat Pillars
                    </h3>
                  </FadeScaleIn>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CodexBox title="1. Precision & Raw Power" badge="OFFENSE">
                      <p className="text-base text-[#9a9488] leading-relaxed">
                        <TypewriterText text="Victory is dictated by calculated decision-making rather than stat checks. Every swing has weight, giving your strikes and moves untold power." delay={200} />
                      </p>
                    </CodexBox>
                    <CodexBox title="2. Momentum & Combat Style" badge="MOVEMENT">
                      <p className="text-base text-[#9a9488] leading-relaxed">
                        <TypewriterText text="Custom combo creativity and fluid movement branching build Heat, empowering your Stand abilities and triggering high-damage Overdrive combat states." delay={300} />
                      </p>
                    </CodexBox>
                    <CodexBox title="3. Endurance & Adaptability" badge="DEFENSE">
                      <p className="text-base text-[#9a9488] leading-relaxed">
                        <TypewriterText text="A suite of active defensive options—Parries, Evasive Dodges, and Tech Recoveries—ensures no single offensive meta or infinite string can ever dominate a fight." delay={400} />
                      </p>
                    </CodexBox>
                  </div>
                </div>

                <div className="space-y-10">
                  <FadeScaleIn delay={100}>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                      Universal Offense Framework
                    </h3>
                  </FadeScaleIn>

                  <CodexBox title="1. Light Strike (LMB / M1)" badge="BASIC OFFENSE">
                    <p className="text-base md:text-lg text-[#c7c2b5] leading-relaxed mb-6">
                      <TypewriterText text="Light Strikes form the backbone of neutral interactions, pressure strings, and combo extension. They are designed to feel swift, smooth yet simple, enforcing movement decay to eliminate infinite run-and-strike spamming." delay={200} />
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base my-4">
                      <CodexBox title="5-Hit Base String">
                        <p className="text-sm text-[#c7c2b5]"><TypewriterText text="Fluid strike sequence featuring bespoke martial animations for every active Stand, Weapon, or Fighting Style archetype. The 5th strike deals +50% bonus damage and delivers a 35-stud knockback, resetting neutral." /></p>
                      </CodexBox>
                      <CodexBox title="Pacing & Velocity Decay">
                        <p className="text-sm text-[#c7c2b5]"><TypewriterText text="Each M1 swing moves you slightly forward, additionally, with your aerial M1's and your slowed momentum during M1's, this eliminates the classic bunny-hop most Jojo games feature and enforces spacing discipline and correct timing." /></p>
                      </CodexBox>
                      <CodexBox title="Hitstun Decay Curve">
                        <p className="text-sm text-[#c7c2b5]"><TypewriterText text="Base hitstun reduces by 5% on each subsequent connection within a single combo string, preventing inescapable infinite loops and annoying M1 resets." /></p>
                      </CodexBox>
                      <CodexBox title="Non-Stun Based Combat">
                        <p className="text-sm text-[#c7c2b5]"><TypewriterText text="M1's are Semi-True, and with the hit-stun decay, your M1's are meant to be poking tools rather than main combo starters like in battleground games." /></p>
                      </CodexBox>
                    </div>

                    <ul className="list-disc list-inside text-[#c7c2b5] text-base space-y-3 leading-relaxed my-6">
                      <li><strong className="text-[#e6c278]">Uppercut M1 Branch:</strong> Hold <code className="bg-[#18161f] border border-[#3d3423] px-2 py-0.5 text-[#e6c278] font-mono text-sm">Space</code> during any M1 to launch both yourself and your target into an airborne state, putting your M1 on cooldown, regardless of the sequence.</li>
                      <li><strong className="text-[#e6c278]">Aerial M1 Branch:</strong> While in the air, you can use M1's to juggle your opponents in the air, allowing for air combos, your falling is paused per M1 keeping you with your opponent manually instead of basic hovering.</li>
                    </ul>

                    <VideoPlate 
                      title="Move Demonstration: 5-Hit Light Strike Chain & Aerial Variant"
                      inputTag="LMB x5 / LMB x3 while airborne"
                      badge="M1's"
                      duration="0:14"
                      description="Standard 5-hit M1 light string ending with a stronger strike at the 5th chain and its airborne variant."
                      stats={[
                        { label: "Damage Scale", value: "100% each | 150% final strike" },
                        { label: "Hitstun Decay", value: "-5% per hit" },
                        { label: "Knockback", value: "35 Studs" }
                      ]}
                      videoSrc="/video/test.mp4"
                      posterSrc="UNIQUE VIDEO HERE"
                    />

                    <VideoPlate 
                      title="Move Demonstration: Light Uppercut"
                      inputTag="Airborne LMB (Post-Uppercut)"
                      badge="COMBO EXTENSION"
                      duration="0:09"
                      description="Execute a launcher M1 by holding space with your M1, regardless of which sequence you were on."
                      stats={[
                        { label: "Damage Scale", value: "150%" },
                        { label: "Launch Height", value: "30 Studs" }
                      ]}
                      videoSrc="UNIQUE VIDEO HERE"
                      posterSrc="UNIQUE VIDEO HERE"
                    />
                  </CodexBox>

                  <CodexBox title="2. Heavy Strike (MMB / M2)" badge="HEAVY SYSTEM">
                    <div className="mb-6">
                      <span className="inline-block text-xs font-['Cormorant_Upright',serif] text-[#e6c278] tracking-widest uppercase font-bold bg-[#14121a] px-4 py-2 border border-[#2a2418] mb-4">
                        Cost: 15 Heat | Cooldown: 5.0 Seconds
                      </span>
                      <p className="text-base md:text-lg text-[#c7c2b5] leading-relaxed">
                        <TypewriterText text="Heavy Strikes, or M2's, are meant to be the most versatile move in your kit. For stand off or specs, this move acts as a heavy punch that knocks away people slightly into the air with soft ragdoll. This also does twice your M1 damage and you slightly move forward. However, it will act as a special move that works with the stand's kit, whether it be a grab, counter, stun move, or combo ender of the sorts. Stands, however, have a specialized M2. Use the interactive switcher below to preview all variations:" delay={200} />
                      </p>
                    </div>
                    <DynamicVideoPlate 
                      title="Heavy Strike (M2) Tactical Variations"
                      options={heavyStrikeOptions}
                      defaultOptionId="basic"
                      sectionBadge="SELECT M2 VARIANT"
                    />
                  </CodexBox>
                </div>

                <div className="space-y-8">
                  <FadeScaleIn delay={100}>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                      Guard (F)
                    </h3>
                  </FadeScaleIn>
                  <CodexBox title="Defensive Stance Framework" badge="DEFENSIVE SYSTEM">
                    <p className="text-base md:text-lg text-[#c7c2b5] leading-relaxed mb-6">
                      <TypewriterText text="Your Guard/Block system is your main defense tool that puts the user in a defensive stance. In this state they cannot move, but are impervious to many attacks. However, users must be smart when using this as there are viable counters and ways for opponents to use your blocking stance to their advantage. It is a quite simple mechanic once you get the gist of it." delay={200} />
                    </p>

                    <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                      <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">Guard Endurance</h4>
                      <p className="text-base text-[#c7c2b5]"><TypewriterText text="The guard endurance is simple, you have a bar that is used to see your guard endurance's health. This automatically recharges while you are outside of your guard stance." /></p>
                      <ul className="list-disc list-inside space-y-2 text-base text-[#c7c2b5]">
                        <li>Blocking attacks will 'wear down' that endurance bar, and upon complete depletion you are <strong className="text-[#e6c278]">Guard Broken</strong>.</li>
                        <li>Blocking without receiving any attacks after 4 seconds will cause that bar to slowly deplete with <strong className="text-[#e6c278]">Guard Decay</strong>.</li>
                        <li>Upon using moves such as <strong className="text-[#e6c278]">Perfect Guard</strong>, <strong className="text-[#e6c278]">Reflective Guard</strong> and <strong className="text-[#e6c278]">Evasive Guard</strong> you can recharge the bar.</li>
                      </ul>
                      <p className="text-base text-[#c7c2b5]">
                        <TypewriterText text="Should your block bar be full, it can overlap, storing as a golden charged bar. Once filled, this can be used as extra guard points as well, however this is used for something even greater!" />
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-base">
                        <CodexBox title="(BREAK) Guard Break">
                          <p className="text-sm text-[#c7c2b5]"><TypewriterText text="The result of your guard bar depleting after either defending a move too strong for your defense, or defending more moves than you can endure. Stun time: 2.5 – 3s. Places offender in Perception Zone." /></p>
                        </CodexBox>
                        <CodexBox title="(DECAY) Guard Decay">
                          <p className="text-sm text-[#c7c2b5]"><TypewriterText text="The result of staying in blocking stance for too long without incoming attacks, over-decaying the bar. Stun time: 1.5 – 2s." /></p>
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

                    <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                      <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">Perfect Guard / Parry</h4>
                      <p className="text-base text-[#c7c2b5]"><TypewriterText text="Performed up to 0.2s before a parriable attack. Perfect Guards reward a player by stunning the victim in a state known as Perception Zone. This stun lasts 3 seconds, allowing you to freely attack your enemy. Perfect Guards also push the player back while the enemy stays in place." delay={100} /></p>
                      <p className="text-base text-[#c7c2b5]"><TypewriterText text="There are 2 types of parries: Light Parries and Heavy Parries. Light Parries push you back a little, whereas heavy parries push you back a lot while giving more stun in return." delay={100} /></p>
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

                    <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                      <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">Evasive Guard / Dodge</h4>
                      <p className="text-base text-[#c7c2b5]"><TypewriterText text="Performed by side dashing while using guard. Perfect for evading attacks without wasting block points, giving time to counter. Doesn't stun enemy, but punishes end lag. Casting outside zone puts dash on 5s CD and deducts 50 guard points. If missed below 2.5% hp explode into a fine red mist." delay={100} /></p>
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

                    <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                      <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">Reflective Guard / Reflect</h4>
                      <p className="text-base text-[#c7c2b5]"><TypewriterText text="Performed up to 0.3s before a reflectable attack. Reflect works only on projectiles. Unlike perfect parries, it doesn't push the user back, but allows defense against ranged attacks. Reflection speed depends on attack strength, HP, and Block Bar." delay={100} /></p>
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

                    <div className="space-y-4 border-t border-[#2a2418] pt-6 my-6">
                      <h4 className="text-2xl font-['Gilda_Display',serif] text-[#f21616]">Critical Arts / Critical Strike</h4>
                      <p className="text-base text-[#c7c2b5]"><TypewriterText text="Critical Arts are activated by using any M1 or any M2 variant while in Perception Zone with a fully supercharged guard bar." delay={100} /></p>
                      <p className="text-base text-[#c7c2b5]"><TypewriterText text="Casting initiates a Quick Time Bar where you must hit the casted keybind again. The closer to center, the more powerful the art. Hitting the thin blue inner zone triggers a MAXIMUM CRITICAL STRIKE for immense damage!" delay={150} /></p>
                      <ul className="list-disc list-inside space-y-2 text-base text-[#c7c2b5] my-4">
                        <li>★ M1 leaves opponent stunned; M2 deals Grand Knockback. Additionally, <strong className="text-[#f21616]">[Any M1 or M2 variant (Excluding Flash Rush)]</strong> can be used.</li>
                        <li>★ Block bar is fully depleted upon use.</li>
                        <li>★ Places user in <strong className="text-[#1e5eff]">[Overdrive]</strong> state.</li>
                        <li>★ Damage buff scales directly with <strong className="text-[#fdee4a]">WILL</strong> stat.</li>
                        <li>★ Applies debuffs to the victim.</li>
                      </ul>
                      <DynamicVideoPlate 
                        title="Critical Art Execution Variants"
                        options={criticalArtOptions}
                        defaultOptionId="m1-max"
                        sectionBadge="SELECT ART VARIANT"
                        variantTheme="red"
                      />
                    </div>

                    <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                      <FadeScaleIn delay={100}>
                        <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">Combat Add-Ons</h3>
                      </FadeScaleIn>
                      <CodexBox title="Combat Tag System" badge="SYSTEM TAG">
                        <p className="text-base text-[#c7c2b5] leading-relaxed mb-3"><TypewriterText text="Fighting places a tag restricting features like wall running, climbing, NPC interaction, and fast travel." /></p>
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

                      <CodexBox title="Burst (Combo Breaker / Anti Team)" badge="COMBO BREAKER">
                        <div className="mb-3">
                          <span className="text-xs font-mono text-[#e6c278] bg-[#14121a] px-3 py-1 border border-[#2a2418]">
                            Cost: 15 Heat [M1] / 15 HP [M2]
                          </span>
                        </div>
                        <p className="text-base text-[#c7c2b5] leading-relaxed mb-3">
                          <TypewriterText text="Holding M1 or M2 while stunned releases a blast of energy blasting nearby enemies away. Features True Block Bypass, True Stun, and Hyper Armor/Counter Bypass. Stuns for 1.0s and scales damage with current combo length." />
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CodexBox title="Finishers" badge="Executions">
                          <p className="text-sm text-[#c7c2b5] leading-relaxed"><TypewriterText text="Gained upon unlocking a new move, finishers offer a style grade bump, heat and more depending on the finisher. Most knockback moves feature universal finishers sending victims flying further. Finishers can also be disabled in the respective move's Move Tab." /></p>
                        </CodexBox>
                        <CodexBox title="Combo Scaling" badge="COMBO BALANCING">
                          <p className="text-sm text-[#c7c2b5] leading-relaxed"><TypewriterText text="Longer combos reduce damage output. Moves retain 100% strength up to D Style Rank, then lose 5% damage per subsequent tier. This allows for players in any combo a better chance at survival rather than being completely overwhelmed with damage. This feature is disabled for Boss Fights, Supers and Ultimates." /></p>
                        </CodexBox>
                        <CodexBox title="Buff / De-Buffs Tier Scaling" badge="BALANCING">
                          <p className="text-sm text-[#c7c2b5] leading-relaxed"><TypewriterText text="Each buff/de-buff you receive has different tiers, the higher the tier, the less effective the buff/de-buff, this balances buff/de-buff stacking as it can lead to unwanted circumstances such as basic M1's doing 100 damage or a basic M1 insta killing you because of de-buffs. This works on Stat Buffs/De-buffs, Passive Buffs/De-Buffs, Skill Buffs/De-Buffs & Awakening Buffs/De-buffs." /></p>
                        </CodexBox>
                        <CodexBox title="Pose" badge="MECHANIC">
                          <p className="text-sm text-[#c7c2b5] leading-relaxed"><TypewriterText text="Using your P key after any ragdolling move allows you to do a quick pose similar to All Star Battle/R. This resets your Style Rank countdown back to full and rewards you with 15 heat. In the pose, you and your opponent watch the short cutscene and then go back to normal. However, you can be interrupted and this does have a short 0.25s window after the move to be done." /></p>
                        </CodexBox>
                        <CodexBox title="Taunt / Aura Farm" badge="MECHANIC">
                          <p className="text-sm text-[#c7c2b5] leading-relaxed"><TypewriterText text="Using your P key DURING a move (must be hitting an opponent) allows you to do a quick Aura Farm/ Taunt during the move (especially useful with Stands). This rewards you with Heat and boosts your Style meter. However be careful as this can give an opening to opponents since you're vulnerable during the animation, and getting hit while aurafarming deducts from your Style Bar." /></p>
                        </CodexBox>
                        <CodexBox title="Weapon Switch" badge="TOOL SWITCHER">
                          <p className="text-sm text-[#c7c2b5] leading-relaxed"><TypewriterText text="Referenced from the Devil May Cry series, using your Middle Mouse Scroll (MMB Scroll), you can freely switch between any weapon you have equipped in your inventory, however you do slow down for a second to equip it (some abilities may assist this/shorten this). This is perfect for keeping combos fresh and your Style Bar pumping!" /></p>
                        </CodexBox>
                      </div>

                      <VideoPlate 
                        title="System Demonstration: Pose, Aurafarm, Weapon Switcher"
                        inputTag="P | MMB"
                        badge="TAUNT/TOOL SYSTEM"
                        duration="0:25"
                        description="Demonstrating Pose and Aurafarming system to Taunt enemies for style, and Weapon switch system to utilize multiple weapons in combat."
                        stats={[
                          { label: "Pose", value: "After Ragdoll" },
                          { label: "Aura Farm", value: "During Move Casting" },
                          { label: "Weapon Switch", value: "Scroll with MMB"}
                        ]}
                        videoSrc="UNIQUE VIDEO HERE"
                        posterSrc="UNIQUE VIDEO HERE"
                      />

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
                            <strong className="text-[#e6c278] block font-['Gilda_Display',serif] text-base mb-1">Target Re-Lock [Mark + Hold L]</strong>
                            Re-focuses opponent positions similar to a lock on, ignoring buildings and obstacles with a distance limit based on stat upgrades.
                          </div>
                        </div>
                        <VideoPlate 
                          title="System Demonstration: Spiritual Sight, Target Mark & Target Re-Lock"
                          inputTag="L | Hold L Key"
                          badge="TARGET SYSTEM"
                          duration="0:14"
                          description="Demonstrating Spiritual Sight aura vision through obstacles and soft auto-aim targeting, and target relocating."
                          stats={[
                            { label: "Target Lock", value: "Soft Directional" },
                            { label: "Obstacle Bypass", value: "Active" }
                          ]}
                          videoSrc="UNIQUE VIDEO HERE"
                          posterSrc="UNIQUE VIDEO HERE"
                        />
                      </CodexBox>

                      <CodexBox title="Joestar’s Will" badge="WILL POWER">
                        <p className="text-base text-[#c7c2b5] leading-relaxed">
                          Special mechanic scaling with <strong className="text-[#e6c278]">WILL</strong> stat. Equipping a <strong className="text-[#e6c278]">Joestar’s Mark</strong> grants specialized buffs (e.g. Dark Determination, Burning Passion). Activated via clicking MMB after a Critical Art while in <strong className="text-[#e6c278]">[Overdrive]</strong>.
                        </p>
                      </CodexBox>
                    </div>

                    <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                      <FadeScaleIn delay={100}>
                        <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">Gauge and Style Systems</h3>
                      </FadeScaleIn>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                        <CodexBox title="Health/Vitality Gauge">
                          <p className="text-xs text-[#c7c2b5]"><TypewriterText text="Displays HP and remaining damage tolerance before defeat." delay={100}/></p>
                        </CodexBox>
                        <CodexBox title="Level / XP Gauge">
                          <p className="text-xs text-[#c7c2b5]"><TypewriterText text="Tracks overall level and progress toward next node point." delay={150} /></p>
                        </CodexBox>
                        <CodexBox title="Heat Gauge (0 - 100)">
                          <p className="text-xs text-[#c7c2b5]"><TypewriterText text="Divided into 20-point bars. Built via parries, dodges, combos, and low HP scaling." delay={200}/></p>
                        </CodexBox>
                      </div>

                      <CodexBox title="Combo Style Ranks (DMC-Inspired)" badge="STYLE SYSTEM">
                        <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                          <TypewriterText text="Built by attacking creatively. Repeating identical moves degrades rank. Inactivity decays rank, but taking damage pauses decay. High ranks reduce cooldowns and windup times!" delay={100} />
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

                    <VideoPlate 
                      title="System Demonstration: Gauge and Style Systems Showcase"
                      inputTag="Passive"
                      badge="GAUGE SYSTEM"
                      duration="0:35"
                      description="Showcasing your Health, Level, Guard, Heat and Style Gauges that players will utilize in their everyday combat."
                      stats={[
                        { label: "Heat", value: "Active" },
                        { label: "Experience/Level", value: "Active" },
                        { label: "Guard", value: "Active" },
                        { label: "Health", value: "Active" },
                        { label: "Style", value: "Semi-Active" }
                      ]}
                      videoSrc="UNIQUE VIDEO HERE"
                      posterSrc="UNIQUE VIDEO HERE"
                    />

                    <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                      <FadeScaleIn delay={100}>
                        <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">Status Effects</h3>
                      </FadeScaleIn>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <CodexBox title="[Overwhelmed]" badge="DEBUFF + BUFF">
                          <p className="text-sm text-[#c7c2b5] leading-relaxed mb-2">
                            <TypewriterText text="Triggered taking combo damage reaching A Rank. Blurs vision 8%, darkens 6%, adds vignette. Clears after 5s without damage or using Burst." />
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

                      <div className="space-y-4">
                        <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">DOT Indicators & Body Part Damage</h4>
                        <p className="text-s text-[#a09a8e]"><TypewriterText text="All DOT (Damage Over Time) effects last 4 seconds. Stacking same tier increases tier (Tier 1 + Tier 1 = Tier 2)." /></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                          <StatusEffectCard type="bleed" title="Bleed" badgeText="INJURED" duration="DOT" description="Causes continuous damage over time and reduces overall movement speed and regen speed." stats="Less Speed + Regen" />
                          <StatusEffectCard type="burn" title="Burn" badgeText="SCORCH" duration="DOT" description="Sears the victim in flames, hindering defences and reducing max endurance pool." stats="Less Endurance + Defence" />
                          <StatusEffectCard type="poison" title="Poison" badgeText="Toxic" duration="DOT" description="Deadly Poisons infect the victim, corroding defensive capabilities while draining endurance over time." stats="Endurance + Defense" />
                          <StatusEffectCard type="wither" title="Wither" badgeText="Curse" duration="DOT" description="A deadly curse that severely dampens health regeneration rates and impairs endurance recovery." stats="Regeneration + Endurance" />
                        </div>

                        <CodexBox title="Body Part Damage Breakdown" badge="LOCATIONAL DAMAGE">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-s text-[#c7c2b5]">
                            <div>• <strong className="text-[#e6c278]">Skull:</strong> Blur + Ringing SFX, Stun increase, Slowness</div>
                            <div>• <strong className="text-[#e6c278]">Torso:</strong> Reduced endurance & damage resistance</div>
                            <div>• <strong className="text-[#e6c278]">Legs:</strong> Sprint, jump, and speed nerfed</div>
                            <div>• <strong className="text-[#e6c278]">Arms:</strong> Block & damage nerfed, ledge grab jump spam</div>
                          </div>
                        </CodexBox>
                      </div>
                    </div>

                    <div className="space-y-6 border-t border-[#2a2418] pt-6 my-6">
                      <FadeScaleIn delay={100}>
                        <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">Advanced Combat Mechanics</h3>
                      </FadeScaleIn>

                      <CodexBox title="Dynamic Destruction & Stage Pinning" badge="MAP DESTRUCTION">
                        <p className="text-s text-[#c7c2b5] leading-relaxed mb-4">
                          <TypewriterText text="Knocking enemies into walls enables continuous wall-pin combos until wall destruction. Destroying walls grants +15% bonus damage. Select maps support full Stage Destruction!" />
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
                          <p className="text-s text-[#c7c2b5] leading-relaxed">
                            <TypewriterText text="Features options like Flash Step approach or ranged projectiles (guns) to maintain style rank without burning close-combat moves." />
                          </p>
                        </CodexBox>
                        <CodexBox title="Move Shift Mechanic" badge="VARIANT TECH">
                          <p className="text-s text-[#c7c2b5] leading-relaxed">
                            <TypewriterText text="Allows unlocking move variants by executing a move WHILE another action is being performed mid-animation or windup." />
                          </p>
                        </CodexBox>
                      </div>
                    </div>
                  </CodexBox>
                </div>
              </section>
            )}

            {/* MOBILITY SUBTAB CONTENT */}
            {activeSubTab === 'mobility' && (
              <section className="space-y-12">
                <CodexBox 
                  title="Combat and Movement are One"
                  badge="MOBILITY OVERVIEW"
                  accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
                >
                  <p className="text-[#c7c2b5] leading-relaxed text-lg md:text-xl">
                    <TypewriterText text="Movement in Beyond Bizarre is not merely traversal—it is an offensive and defensive weapon. Positioning, verticality, momentum preservation, and recovery techniques seamlessly connect directly into combat strings. In this game, you have to utilize Speed & Momentum when you’re moving around. However, your mobility also heavily compliments other aspects such as combat and more allowing for stylish gameplay. It's not just knowing how, but also when to move." delay={100} />
                  </p>
                </CodexBox>

                <div>
                  <FadeScaleIn delay={100}>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase mb-6 border-b border-[#2a2418] pb-3">
                      Interactive Mobility Mechanics
                    </h3>
                  </FadeScaleIn>
                  <DynamicVideoPlate 
                    title="Mobility & Traversal Demonstrations"
                    options={mobilityOptions}
                    defaultOptionId="walk-sprint"
                    sectionBadge="SELECT MOBILITY TECH"
                    variantTheme="cyan"
                  />
                </div>

                <div className="space-y-8">
                  <FadeScaleIn delay={100}>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                      Advanced Traversal & Recovery Mechanics
                    </h3>
                  </FadeScaleIn>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CodexBox title="1. Ground Movement & Velocity Tiers" badge="WASD + SHIFT/CTRL">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="3 distinct speed modes govern your ground footwork. Transitioning smoothly between Walk, Combat Run, and Sprint allows for precise spacing outside enemy melee reach while managing stamina decay." />
                      </p>
                      <div className="p-3 bg-[#0d0c10] border border-[#1e1b24] text-xs font-mono space-y-1">
                        <div className="text-[#e6c278] font-bold">• Walk (12 Studs/s): Perfect Guard mobility</div>
                        <div className="text-[#e6c278] font-bold">• Run (22 Studs/s): Standard combat neutral</div>
                        <div className="text-[#e6c278] font-bold">• Sprint (36 Studs/s): High-speed rushdowns</div>
                      </div>
                    </CodexBox>

                    <CodexBox title="2. Flash Step & Directional Dashes" badge="BURST DASH [Q]">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="Flash Step grants instant 28-stud spatial relocation with 0.18s invincibility frames. Can be executed omnidirectionally to side-step projectiles or cancel attack recovery." />
                      </p>
                      <div className="p-3 bg-[#0d0c10] border border-[#1e1b24] text-xs font-mono space-y-1">
                        <div className="text-[#38bdf8]">• Cooldown: 3.5 Seconds</div>
                        <div className="text-[#38bdf8]">• Cancel Tech: Usable during light attack startup</div>
                        <div className="text-[#38bdf8]">• M2 Synergy: Extends into Flash Rush chain</div>
                      </div>
                    </CodexBox>

                    <CodexBox title="3. Verticality & Wall Running" badge="ENVIRONMENT TECH">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="Holding Jump against vertical architecture initiates vertical wall runs for up to 3 seconds. Wall kicking off surfaces launches your character forward with 45 studs of kinetic momentum." />
                      </p>
                      <div className="p-3 bg-[#0d0c10] border border-[#1e1b24] text-xs font-mono space-y-1">
                        <div className="text-[#e6c278]">• Wall Run Max: 3.0 Seconds</div>
                        <div className="text-[#e6c278]">• Ledge Snap: Auto-vaults onto walkable ledges</div>
                        <div className="text-[#e6c278]">• Aerial Reset: Wall kick restores air dash</div>
                      </div>
                    </CodexBox>

                    <CodexBox title="4. Tech Recovery & Air Teching" badge="ANTI-PRESSURE">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="Bypass hard knockdown wakeups by timing jump upon surface impact. Air Teching consumes 10 Heat to immediately neutralize ragdoll momentum and regain full air control." />
                      </p>
                      <div className="p-3 bg-[#0d0c10] border border-[#1e1b24] text-xs font-mono space-y-1">
                        <div className="text-[#38bdf8]">• Timing Window: 0.25 Seconds</div>
                        <div className="text-[#38bdf8]">• Heat Cost: 10 Heat (Air Tech)</div>
                        <div className="text-[#38bdf8]">• Invulnerability: 0.3s post-roll</div>
                      </div>
                    </CodexBox>
                  </div>

                  <VideoPlate 
                    title="Traversal Showcase: Wall Running, Tech Recovery & Slide Canceling"
                    inputTag="Space / Crouch / Q"
                    badge="TRAVERSAL REEL"
                    duration="0:24"
                    description="Comprehensive demonstration of fluid wall running, airborne tech recovery after ragdoll hits, and sprint slide canceling."
                    stats={[
                      { label: "Wall Run", value: "3.0s Limit" },
                      { label: "Tech Roll", value: "0.25s Window" },
                      { label: "Slide Speed", value: "115% Base" }
                    ]}
                    videoSrc="UNIQUE VIDEO HERE"
                    posterSrc="UNIQUE VIDEO HERE"
                  />
                </div>
              </section>
            )}

            {/* STAND COMBAT SUBTAB CONTENT */}
            {activeSubTab === 'stand-combat' && (
              <section className="space-y-12">
                <CodexBox 
                  title="Spectral Manifestation & Dual Fighting System"
                  badge="STAND COMBAT OVERVIEW"
                  accentColor="border-l-4 border-l-[#a855f7] border-[#2a2418]"
                >
                  <p className="text-[#c7c2b5] leading-relaxed text-lg md:text-xl">
                    <TypewriterText text="Stands represent physical manifestations of psychological willpower. In Beyond Bizarre, Stand combat introduces a dual fighting layer where toggling your Stand (E) alters your frame data, extends hitboxes, enables remote pilot maneuvering, and unlocks high-frequency barrage clashes." delay={100} />
                  </p>
                </CodexBox>

                <div>
                  <FadeScaleIn delay={100}>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#c084fc] tracking-widest uppercase mb-6 border-b border-[#2a2418] pb-3">
                      Interactive Stand Combat Variations
                    </h3>
                  </FadeScaleIn>
                  <DynamicVideoPlate 
                    title="Stand Combat Mechanics & Abilities"
                    options={standCombatOptions}
                    defaultOptionId="stand-summon"
                    sectionBadge="SELECT STAND TECH"
                    variantTheme="purple"
                  />
                </div>

                <div className="space-y-8">
                  <FadeScaleIn delay={100}>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#c084fc] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                      Deep Stand Mechanics Breakdown
                    </h3>
                  </FadeScaleIn>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CodexBox title="1. Stand-On vs Stand-Off Modes" badge="STANCE SYSTEM">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="Toggling your Stand (E) switches between nimble human strikes and heavy spectral attacks. Stand-On grants extra range and armor, while Stand-Off boosts raw movement speed." />
                      </p>
                      <div className="p-3 bg-[#13091c] border border-[#2e1840] text-xs font-mono space-y-1">
                        <div className="text-[#c084fc]">• Summon Startup: 0.15s</div>
                        <div className="text-[#c084fc]">• Reach Multiplier: +3.5 Studs</div>
                        <div className="text-[#c084fc]">• Guard Cap: +30% Resilience</div>
                      </div>
                    </CodexBox>

                    <CodexBox title="2. Barrages & Clash Dynamics" badge="BARRAGE SYSTEM">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="Unleash rapid multi-punch strings. When two barrages hit simultaneously, a high-intensity Barrage Clash begins, requiring QTE inputs to overpower opponent Heat." />
                      </p>
                      <div className="p-3 bg-[#13091c] border border-[#2e1840] text-xs font-mono space-y-1">
                        <div className="text-[#c084fc]">• Hit Rate: 18 Strikes / second</div>
                        <div className="text-[#c084fc]">• Heat Generation: +1.5 per hit</div>
                        <div className="text-[#c084fc]">• Clash Drain: Equalized Heat</div>
                      </div>
                    </CodexBox>

                    <CodexBox title="3. Remote Pilot Mode" badge="LONG-RANGE PROJECTION">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="Detach your Stand to fly up to 120 studs away. Ideal for ambushes and scouting, but leaves your physical user body defenseless against counter-attacks." />
                      </p>
                      <div className="p-3 bg-[#13091c] border border-[#2e1840] text-xs font-mono space-y-1">
                        <div className="text-[#c084fc]">• Max Radius: 120 Studs</div>
                        <div className="text-[#c084fc]">• Pilot Speed: 32 Studs/s</div>
                        <div className="text-[#c084fc]">• Damage Share: 100% to User</div>
                      </div>
                    </CodexBox>

                    <CodexBox title="4. Stand Awakenings & Requiem" badge="ULTIMATE FORM">
                      <p className="text-sm text-[#c7c2b5] leading-relaxed mb-4">
                        <TypewriterText text="Reaching 100% Heat during max Overdrive activates Stand Awakening. Grants massive spectral aura, removes barrage cooldowns, and increases global damage by +35%." />
                      </p>
                      <div className="p-3 bg-[#13091c] border border-[#2e1840] text-xs font-mono space-y-1">
                        <div className="text-[#c084fc]">• Duration: 15.0 Seconds</div>
                        <div className="text-[#c084fc]">• Cooldown Reduct: 50% Global</div>
                        <div className="text-[#c084fc]">• Immunity: Frame Invulnerability</div>
                      </div>
                    </CodexBox>
                  </div>

                  <VideoPlate 
                    title="Stand Showcase: Barrage Clash, Pilot Mode & Spectral Awakenings"
                    inputTag="E / R / Shift+E / G"
                    badge="STAND REEL"
                    duration="0:30"
                    description="Visual breakdown of Stand summoning, high-frequency Barrage Clashing, remote pilot detachment, and Requiem Overdrive states."
                    stats={[
                      { label: "Barrage Speed", value: "18 Hits/s" },
                      { label: "Pilot Range", value: "120 Studs" },
                      { label: "Awakening", value: "+35% Damage" }
                    ]}
                    videoSrc="UNIQUE VIDEO HERE"
                    posterSrc="UNIQUE VIDEO HERE"
                  />
                </div>
              </section>
            )}
          </>
        )}

        {/* =========================================================
            TAB 3: CHARACTER PROGRESSION (UPDATED UI)
            ========================================================= */}
        {activeTab === 'progression' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* Progression Hero Box */}
            <CodexBox 
              title="Path of Mastery & Character Growth"
              badge="PROGRESSION SYSTEM"
              accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
            >
              <p className="text-[#c7c2b5] leading-relaxed text-base md:text-lg mb-6">
                <TypewriterText text="Forge your combat legacy through meticulous stat allocation, specialized skill node branches, and breakthrough prestige tiers. Customizing your attributes alters your combo limits, critical timings, and Stand capabilities." delay={100} />
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1e1a12]">
                <div className="bg-[#0d0c10] p-3 border border-[#2a2418]">
                  <span className="text-[10px] font-mono text-[#8a857a] uppercase block">Max Level Cap</span>
                  <span className="text-xl font-bold text-[#e6c278] font-mono">Level 100</span>
                </div>
                <div className="bg-[#0d0c10] p-3 border border-[#2a2418]">
                  <span className="text-[10px] font-mono text-[#8a857a] uppercase block">Total Stat Points</span>
                  <span className="text-xl font-bold text-[#e6c278] font-mono">500 Points</span>
                </div>
                <div className="bg-[#0d0c10] p-3 border border-[#2a2418]">
                  <span className="text-[10px] font-mono text-[#8a857a] uppercase block">Prestige Breakthroughs</span>
                  <span className="text-xl font-bold text-[#e6c278] font-mono">5 Tiers</span>
                </div>
                <div className="bg-[#0d0c10] p-3 border border-[#2a2418]">
                  <span className="text-[10px] font-mono text-[#8a857a] uppercase block">Mastery Nodes</span>
                  <span className="text-xl font-bold text-[#e6c278] font-mono">36 Nodes</span>
                </div>
              </div>
            </CodexBox>

            {/* SECTION 1: STAT ALLOCATION MATRIX */}
            <div className="space-y-6">
              <FadeScaleIn delay={100}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2a2418] pb-3 gap-2">
                  <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase">
                    Attribute Matrix & Stat Allocations
                  </h3>
                  <span className="text-xs font-mono text-[#8a857a] bg-[#121116] px-3 py-1 border border-[#2a2418]">
                    Click Stat Card to Preview Bonuses
                  </span>
                </div>
              </FadeScaleIn>

              {/* Stat Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statAttributesList.map((stat) => {
                  const isSelected = selectedStatId === stat.id;
                  return (
                    <div
                      key={stat.id}
                      onClick={() => setSelectedStatId(stat.id)}
                      className={`cursor-pointer p-4 transition-all duration-300 border rounded-sm relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#181510] border-[#c3a35e] shadow-[0_0_20px_rgba(195,163,94,0.2)] -translate-y-1'
                          : 'bg-[#0a0a0d] border-[#2a2418] hover:border-[#615c52] hover:bg-[#0e0d12]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 border ${isSelected ? 'border-[#c3a35e] bg-[#211b12]' : 'border-[#2a2418] bg-[#121116]'}`}>
                            {stat.icon}
                          </div>
                          <div>
                            <h4 className={`font-['Gilda_Display',serif] text-base ${isSelected ? 'text-[#e6c278]' : 'text-[#c7c2b5]'}`}>
                              {stat.name}
                            </h4>
                            <span className="text-[10px] font-mono text-[#8a857a]">
                              {stat.scalingBonus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stat Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-[#8a857a]">Allocated:</span>
                          <span className="text-[#e6c278] font-bold">{stat.currentValue} / {stat.maxValue}</span>
                        </div>
                        <div className="w-full bg-[#14121a] h-2 border border-[#2a2418] overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#8e733b] to-[#e6c278] h-full transition-all duration-500"
                            style={{ width: `${(stat.currentValue / stat.maxValue) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Stat Detail Panel */}
              {selectedStatObj && (
                <FadeScaleIn key={selectedStatObj.id} delay={150}>
                  <div className="bg-[#0e0d12] border border-[#c3a35e]/60 p-6 rounded-sm relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      {selectedStatObj.icon}
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="p-2 bg-[#1c1810] border border-[#c3a35e]">
                        {selectedStatObj.icon}
                      </span>
                      <div>
                        <h4 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278]">
                          {selectedStatObj.name} Breakdown
                        </h4>
                        <span className="text-xs font-mono text-[#c3a35e]">
                          Scaling Bonus: {selectedStatObj.scalingBonus}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm md:text-base text-[#b8b3a8] leading-relaxed mb-6">
                      {selectedStatObj.description}
                    </p>

                    <div className="border-t border-[#2a2418] pt-4">
                      <span className="text-xs font-mono text-[#8a857a] uppercase tracking-wider block mb-3">
                        Key Milestone Unlocks at Max Tier:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedStatObj.keyUnlocks.map((unlock, idx) => (
                          <div key={idx} className="bg-[#050505] p-3 border border-[#2a2418] flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-[#e6c278] shrink-0" />
                            <span className="text-xs font-mono text-[#c7c2b5]">{unlock}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeScaleIn>
              )}
            </div>

            {/* SECTION 2: SKILL TREE BRANCHES */}
            <div className="space-y-6">
              <FadeScaleIn delay={100}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2a2418] pb-3 gap-4">
                  <div>
                    <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase">
                      Skill Tree & Node Mastery
                    </h3>
                    <p className="text-xs font-mono text-[#8a857a]">
                      Unlock combat perks and move variations by spending Skill Points earned per level.
                    </p>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'combat', 'stand', 'survival'] as const).map((branch) => (
                      <button
                        key={branch}
                        onClick={() => setActiveBranch(branch)}
                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all ${
                          activeBranch === branch
                            ? 'bg-[#1c1810] text-[#e6c278] border-[#c3a35e]'
                            : 'bg-[#09090c] text-[#716c62] border-[#221e15] hover:text-[#a09a8e]'
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeScaleIn>

              {/* Skill Nodes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillTreeNodesList
                  .filter(node => activeBranch === 'all' || node.treeBranch === activeBranch)
                  .map((node) => (
                    <CodexBox 
                      key={node.id} 
                      title={node.title} 
                      subtitle={`Tier ${node.tier} Node | Cost: ${node.cost} SP`}
                      badge={node.unlocked ? "UNLOCKED" : "LOCKED"}
                      accentColor={node.unlocked ? "border-[#c3a35e]/50 hover:border-[#c3a35e]" : "border-[#2a2418] opacity-75"}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#14121a] border border-[#2a2418] text-[#e6c278]">
                          Branch: {node.treeBranch}
                        </span>
                        {node.unlocked ? (
                          <Unlock className="w-4 h-4 text-[#e6c278]" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#8a857a]" />
                        )}
                      </div>

                      <p className="text-xs text-[#b8b3a8] leading-relaxed mb-4">
                        {node.description}
                      </p>

                      <div className="border-t border-[#2a2418] pt-3 space-y-1">
                        <span className="text-[10px] font-mono text-[#8a857a] uppercase block">Passive Benefits:</span>
                        {node.perks.map((perk, idx) => (
                          <div key={idx} className="text-xs font-mono text-[#c7c2b5] flex items-center space-x-1.5">
                            <span className="text-[#e6c278]">•</span>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </CodexBox>
                ))}
              </div>
            </div>

            {/* SECTION 3: PRESTIGE & BREAKTHROUGH SYSTEM */}
            <div className="space-y-6 border-t border-[#2a2418] pt-8">
              <FadeScaleIn delay={100}>
                <h3 className="text-3xl font-['Cormorant_Upright',serif] font-bold text-[#e6c278] tracking-widest uppercase border-b border-[#2a2418] pb-3">
                  Prestige Breakthrough Tiers
                </h3>
              </FadeScaleIn>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CodexBox title="Prestige I: Awakened Spirit" badge="TIER I">
                  <div className="space-y-3">
                    <p className="text-xs text-[#b8b3a8] leading-relaxed">
                      Resets character level from 100 to 1, raising stat cap per attribute from 100 to 110. Unlocks Golden Critical Arts.
                    </p>
                    <div className="bg-[#0a0a0d] p-2.5 border border-[#2a2418] text-xs font-mono text-[#e6c278]">
                      +10 Stat Cap Increase | Golden QTE
                    </div>
                  </div>
                </CodexBox>

                <CodexBox title="Prestige III: Requiem Bond" badge="TIER III">
                  <div className="space-y-3">
                    <p className="text-xs text-[#b8b3a8] leading-relaxed">
                      Deepens spiritual sync with your Stand. Increases Stand Barrage clash power by +25% and grants instant Heat regeneration on Parry.
                    </p>
                    <div className="bg-[#0a0a0d] p-2.5 border border-[#2a2418] text-xs font-mono text-[#e6c278]">
                      +25% Clash Power | Parry Heat Regen
                    </div>
                  </div>
                </CodexBox>

                <CodexBox title="Prestige V: Overdrive Zenith" badge="MAX TIER">
                  <div className="space-y-3">
                    <p className="text-xs text-[#b8b3a8] leading-relaxed">
                      The pinnacle of martial mastery. Permanently unlocks the Joestar's Determination passive trait and grants 100% status immunity in Overdrive.
                    </p>
                    <div className="bg-[#0a0a0d] p-2.5 border border-[#2a2418] text-xs font-mono text-[#e6c278]">
                      Status Immunity | Zenith Title & Aura
                    </div>
                  </div>
                </CodexBox>
              </div>
            </div>

            {/* Visual Screenshot Replica Plate */}
            <VideoPlate 
              title="System Showcase: Character Progression & Mastery Matrix"
              inputTag="P / Tab Menu"
              badge="PROGRESSION REEL"
              duration="0:28"
              description="Visual walkthrough of the in-game progression UI showing level up milestones, stat allocations, and node skill trees."
              stats={[
                { label: "Level Cap", value: "Level 100" },
                { label: "Prestige Tiers", value: "5 Max" },
                { label: "Skill Nodes", value: "36 Nodes" }
              ]}
              videoSrc="UNIQUE VIDEO HERE"
              posterSrc="UNIQUE VIDEO HERE"
            />

          </div>
        )}

      </main>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}