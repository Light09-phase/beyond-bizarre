"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Wrench,
  Swords,
  ChevronLeft,
  Info,
  Lock,
  HelpCircle,
  PlayCircle,
  Check,
  X
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

  return [ref as any, isVisible] as const;
}

const FadeScaleIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = "",
}) => {
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

const ScrollBackground: React.FC<{ activeOpacity?: string; className?: string }> = ({
  activeOpacity = "opacity-100",
  className = "",
}) => {
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

// ============================================================================
// TYPES
// ============================================================================

type AbilityTab = 'stands' | 'specs' | 'weapons';

type StandPart = 'Part 3' | 'Part 4' | 'Part 5' | 'Part 6' | 'Part 7' | 'Part 8';

interface Move {
  id: string;
  name: string;
  description: string;
  videoSrc: string;
  hasFinisher?: boolean;
  finisherDescription?: string;
  finisherVideoSrc?: string;
  blockable?: boolean;  // optional override (default: derived from Tags)
  parryable?: boolean;  // optional override (default: derived from Tags)
  armor?: string;       // optional override, e.g. 'Hyper Armor' (default: derived from Tags)
  blockExtras?: string[]; // optional override of the extra block properties (default: derived from Tags)
  hasVariant?: boolean; // this move has variants (e.g. M2/LMB [🧱]) shown as tabs on the same card
  variants?: Move[];    // each variant is a full Move with its own description, video and optional finisher
}

interface Stand {
  id: string;
  name: string;
  part: StandPart;
  quote: string;
  color: string;
  secondaryColor?: string;
  confirmed: boolean;
  description?: string;
  rarity?: string;
  standType?: string;
  moves?: Move[];
  awakeningMoves?: Move[];
  pfpSrc?: string;      // NEW: Individually insert Stand PFP path
  fullArtSrc?: string;  // NEW: Individually insert Stand Full Art path
}

interface CodexBoxProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
}

// ============================================================================
// DATA
// ============================================================================

const PART_ORDER: StandPart[] = ['Part 3', 'Part 4', 'Part 5', 'Part 6', 'Part 7', 'Part 8'];

const PART_TITLES: Record<StandPart, string> = {
  'Part 3': 'Stardust Crusaders',
  'Part 4': 'Diamond is Unbreakable',
  'Part 5': 'Golden Wind',
  'Part 6': 'Stone Ocean',
  'Part 7': 'Steel Ball Run',
  'Part 8': 'JoJolion',
};

const STANDS: Stand[] = [
  // --- Part 3: 12 confirmed ---
  { 
    id: 'star-platinum', 
    name: 'Star Platinum', 
    part: 'Part 3', 
    color: '#8144e4', 
    confirmed: true,
    pfpSrc: 'Source Here', // <-- Example of how to individually insert the PFP path
    fullArtSrc: '/Star Platinum Full Art.png', // <-- Example of how to individually insert the Full Art path
    quote: "I can't beat your ass without getting closer",
    description: `Awakened in 1988, Jotaro Kujo was possessed by what he deemed an evil spirit.[cite: 2] Star Platinum is the pinnacle of close-range combat, capable of breaking even the planet.[cite: 2]\n\nBase Stats: M1 Damage: 8.1, M1 Uppercut: 10.2, Speed Tier: A, Power Tier: A.[cite: 3]\n\nExtra Traits: Combo Break [Star Burst + Unstoppable Force] replaces standard combo break, stunning nearby opponents and canceling non-I-Frame moves.[cite: 3]\n\nAdd-on Passives:\n- Star Guardian: Guard hitbox increased from 200° to 300°.[cite: 3] Guard HP increases 100%-200% based on player's hp loss.[cite: 3] Perfect Guards trigger a swift jab doing 20hp (cannot kill) and grant 10% more damage on the next hit.[cite: 3]\n- True Stardust Spirit: Awakening costs 20 meters and 25% Stand Endurance.[cite: 2] Special moves use 25% less endurance but require more heat.[cite: 2] Dashes in awakening become flash warps.[cite: 2] Awakening grants Super Armour (tanks up to 50 damage).[cite: 2]\n\nMaturity Refineries:\n- Power (Immesurable Power): All damage becomes TRUE DAMAGE.[cite: 2] Barrage Finisher gets a true block break end hit.[cite: 2]\n- Agility (Shooting Star): Grab moves get 10% damage increase.[cite: 2] Attack speed increases by 35% under 50% HP or in awakening.[cite: 2]\n- Endurance (Unstoppable Force): Perfect guards give 15% more guard bar and 10 heat.[cite: 2] Under 20% HP, combo break does a burst Timestop automatically putting you in awakening.[cite: 2]`,
    rarity: "High Tier Rarity[cite: 2]", 
    standType: "Awakening (Class: Strength/Pow) - Close Range Grappler[cite: 2, 3]",
    moves: [
      {
        id: "m2-brute-force",
        name: "M2/LMB - [Brute Force] 🔴",
        description: "Star Platinum grabs the opponent's neck and performs a secondary punch with their other hand straight to the victim's skull, sending them hurdling back.[cite: 3]\n\nDamage: 3.3(Grab) + 13.6 + (Skull Damage) | CD: 10s[cite: 3]\nTags: Grab | Ragdoll+Knockback | Guardable | COMBO ENDER/GRAB | CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 10 | Endlag: 0.15s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/m2-brute-force.mp4"
      },
      {
        id: "m2-you-bastard",
        name: "M2/LMB [🧱] - [\"You Bastard!\"] 🔴",
        description: "Star Platinum chokes the enemy to the wall before using their other arm to release a one armed barrage of strikes to the opponent before punching them through the wall.[cite: 3]\n\nDamage: 1.2 + 0.5*10 + 5.3 | CD: 10s[cite: 3]\nTags: Ragdoll+Knockback | Guardable | Wall Crash | COMBO ENDER | CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 10 | Endlag: 0.2s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/m2-you-bastard.mp4"
      },
      {
        id: "m2-stand-uppercut",
        name: "M2/LMB [🔼] - [Stand Uppercut] 🔴",
        description: "The stand uppercuts the enemy into the air, allowing for air combos.[cite: 3]\n\nDamage: 8.5 | CD: 10s[cite: 3]\nTags: Stun (1.0s) | Guardable | Upper-Spike | COMBO EXTENDER | CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 10 | Endlag: 0.1s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/m2-stand-uppercut.mp4"
      },
      {
        id: "e-barrage",
        name: "E [♦️] - [Barrage] 🔴",
        description: "Stand unleashes a burst of rapid punches, dealing stun (lasts 3.5s).[cite: 3]\n\nDamage: 1.2*28 @8 hits/s | CD: 8s[cite: 3]\nTags: Stun (0.5/hit) | Stun Evasive | Ragdoll Bypass | Guardable | Uncancellable | COMBO EXTENDER | EXTENDED CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 1*12 @4/s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/star-platinum-barrage.mp4",
        hasFinisher: true,
        finisherDescription: "E+M2 - [Barrage Finisher] 🔴: Stand ends the barrage with a heavy strike that knocks away the opponent.[cite: 3]\n\nDamage: 6.8 | CD: (E+2s)[cite: 3]\nTags: Guard Break | True Follow-Up | Soft Ragdoll | Slight Knockback | Parriable | Uncancellable | COMBO ENDER [MINI CUTSCENE] | EXTENDED CLOSE RANGE[cite: 3]\nHeat Cost: 5 | Heat Gain: 0 | Endlag: 0.15s[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/star-platinum-barrage-finisher.mp4"
      },
      {
        id: "r-star-breaker",
        name: "R - [Star Breaker] 🔴",
        description: "Star Platinum strikes the victim's skull with immense force, dealing massive damage.[cite: 3]\n\nDamage: 19.5 | CD: 16s[cite: 3]\nTags: Guard Break| Ragdoll | Heavy Knockback | Hyper Armor | Hyper Armor Crash | Heavy Parriable | Uncancellable | COMBO ENDER | CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 20 | Endlag: 0.3s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/r-star-breaker.mp4"
      },
      {
        id: "r-skull-crusher",
        name: "R [🟥] - [Skull Crusher] 🔴",
        description: "Star Platinum charges its strike to unleash an even more powerful blow, crushing the opponents skull and sending them flying away. (User moves slightly forward upon use)[cite: 3]\n\nDamage: 29.5 + (Skull Damage) | CD: 18s[cite: 3]\nTags: Guard Break | Stand Crasher | Ragdoll | Heavy Knockback | Hyper Armor | Hyper Armor Bypass | Heavy Parriable | COMBO ENDER | CLOSE RANGE+ | STAND POSITIONABLE[cite: 3]\nHeat Cost: 25 | Heat Gain: 0 | Endlag: 0.3s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/r-skull-crusher.mp4",
        hasFinisher: true,
        finisherDescription: "R [🟥] - [Skull Crusher] Finisher: Partial Cutscene/Impact Frame. Star Platinum crushes the opponent's skull, shattering it 3 times before the entire skeleton is shattered, right before the stand launches the body miles away.[cite: 3]\n\nHP Required: >40hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/r-skull-crusher-finisher.mp4"
      },
      {
        id: "t-star-finger",
        name: "T - [\"Star Finger!\"] 🔴",
        description: "Star Platinum extends its index and middle fingers to pierce anyone within its range.[cite: 3]\n\nDamage: 10.3 + [BLEED(T1)] | CD: 12s[cite: 3]\nTags: True Stun (0.85s) | Guardable | Dodge Bypass | Enemy Pull | Knockback Cancel | COMBO EXTENDER/MIXUP | CLOSE RANGE+[cite: 3]\nHeat Cost: 0 | Heat Gain: 5[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/t-star-finger.mp4"
      },
      {
        id: "t-down",
        name: "T [🔝] - [\"I’ll stop him before he kills me!\"] 🔴",
        description: "Star Platinum swipes its finger, slicing the opponent downwards.[cite: 3]\n\nDamage: 12.3 + [BLEED(T1)] | CD: 14s[cite: 3]\nTags: Soft Ragdoll | Guardable | Rebound | Enemy Pull | Knockback Cancel | Grounded Bypass | Stun (0.45s) | COMBO EXTENDER/MIXUP | CLOSE RANGE+[cite: 3]\nHeat Cost: 0 | Heat Gain: 5[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/t-down.mp4"
      },
      {
        id: "t-whirling",
        name: "T [✴️] - [Whirling Star] 🔴",
        description: "Star Platinum zooms out, grabs their opponent and spins them around a couple times, before throwing them away (User is left behind).[cite: 3]\n\nDamage: 9.1 | CD: 12s[cite: 3]\nTags: Aimable(Camera) | Guardable | Knockback | Stun (0.65s) | COMBO EXTENDER | SEMI MID RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 6[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/t-whirling.mp4"
      },
      {
        id: "g-stardust-smash",
        name: "G [♦️+❇️] - [Stardust Smash] 🔴",
        description: "Star Platinum destroys the ground beneath them with its fist, forming a massive crater that is larger and more spiked towards the front. Each of the 3 charge stages do 15% more dmg. Can be used to get out stun.[cite: 3]\n\nDamage: 20.8 (Front) + 18.2 (AOE) | CD: 23s[cite: 3]\nTags: Grounded Bypass | Guard Break | Knockback+Ragdoll | Stand Crash | Hyper Armor+Break | Heavy Parriable[Unparriable at 3rd charge] | Dodge Bypass | Stun Evasive | COMBO ENDER | AOE (SMALL - SUB-MID SCALE)[cite: 3]\nHeat Cost: 0 | Heat Gain: 8 | Endlag: 0.35s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/g-stardust-smash.mp4"
      },
      {
        id: "g-stardust-meteor",
        name: "G [⏏️]  - [Stardust Meteor] 🔴",
        description: "Star Platinum does a diving downward punch into the ground after a stand jump to unleash an even more powerful impact, destroying anything in the area.[cite: 3]\n\nDamage: 28.7 | CD: 23s[cite: 3]\nTags: Grounded Bypass | True Guard Break | Knockback+Ragdoll | Stand Crash | Hyper Armor+Hyper Armor Bypass | Aimable | Dodge Bypass | COMBO ENDER | AOE (SUB-MID - MID SCALE)[cite: 3]\nHeat Cost: 0 | Heat Gain: 8 | Endlag: 0.35s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/g-stardust-meteor.mp4"
      },
      {
        id: "x-mach-impact",
        name: "X [🛡️] - [Mach Impact] 🔴",
        description: "Star Platinum lunges forward for a powerful skull punch to the opponent, knocking them back from the impact (Has 3 charge stages, this is 1st stage).[cite: 3]\n\nDamage: 16.2 | CD: 12s[cite: 3]\nTags: Standing Knockback | Guard Break | Stun (0.35s) | Light Parriable | COMBO EXTENDER | SEMI-MID RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 5 | Endlag: 0.3s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/x-mach-impact.mp4"
      },
      {
        id: "x-supersonic-impact",
        name: "X [1st 🟥] [🛡️] - [Supersonic Impact] 🔴",
        description: "Star Platinum lunges forward for a hard hitting punch to the opponent’s skull, (2nd Stage).[cite: 3]\n\nDamage: 18.2 | CD: 12s[cite: 3]\nTags: Knockback+Soft Ragdoll | Guard Break | Heavy Parriable | COMBO EXTENDER/ENDER | SEMI-MID RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 7 | Endlag: 0.35s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/x-supersonic-impact.mp4"
      },
      {
        id: "x-hypersonic-impact",
        name: "X [ 2nd 🟥] [🛡️] - [Hypersonic Impact] 🔴",
        description: "Star Platinum lunges out for a powerful punch to the opponent’s skull, knocking them away from the impact. (Third and final charge of mach impact).[cite: 3]\n\nDamage: 20.2 | CD: 12s[cite: 3]\nTags: Heavy Knockback+Ragdoll | True Guard Break | COMBO ENDER | SEMI-MID RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 9 | Endlag: 0.4s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/x-hypersonic-impact.mp4",
        hasFinisher: true,
        finisherDescription: "X [🟥] - [Hypersonic Impact] Finisher: Non-Cutscene. A hitstop effect occurs right before the victim is sent flying miles away (body causes destruction).[cite: 3]\n\nHP Required >40hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/x-hypersonic-impact-finisher.mp4"
      },
      {
        id: "x-c-judge-you",
        name: "X [🟥]+C  - [\"I’ll Judge You Myself!\"] 🔴",
        description: "Star Platinum lunges forward and grabs the opponent before doing a series of punches with its right arm and finally uppercutting them into the air. Each charge variant does a different version upon impact (Variant 1: Non-Cutscene, Variant 2: Short Cutscene, Variant 3: Cutscene w/ Skull Damage + Grand Upper-Spike).[cite: 3]\n\nDamage: Dependant on variant | CD: Dependant on Variant[cite: 3]\nTags: Light Parriable[Unparriable at 3rd charge] | Guard Bypass | Knockback+Ragdoll | Grab | Hyper Armor Crash | Rebound | Uncancellable | Upper-Spike | COMBO ENDER [SUPER] | SEMI-MID RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 40 | Heat Gain: 0 | Endlag: 0.5s (if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/x-c-judge-you.mp4",
        hasFinisher: true,
        finisherDescription: "X+C (Variant 3) - [\"I’ll Judge You Myself!\"] Finisher: Cutscene Finisher. On the final uppercut hit, Star Platinum puts in more force, releasing its punch as the victim is seen in the background flying in the sky with a cartoon twinkle.[cite: 3]\n\nHP Required >65hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/x-c-judge-you-finisher.mp4"
      },
      {
        id: "x-t-beat-breath",
        name: "X+T - [\"Beat In A Breath\"] 🔴",
        description: "Star Platinum does a strong inhale that can pull multiple enemies towards him.[cite: 3]\n\nDamage: 0 | CD: 10s[cite: 3]\nTags: True Stun (0.75s) | Guard Bypass | Dodge Bypass | Enemy Pull | Knockback Cancel | COMBO EXTENDER/MIXUP | SEMI-MID | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 0 | Endlag: 0.45s (if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/x-t-beat-breath.mp4"
      },
      {
        id: "y-jaw-breaker",
        name: "Y - [Jaw Breaker] 🔴",
        description: "Star Platinum does a shoving elbow jab at the opponent’s jaw that stuns them.[cite: 3]\n\nDamage: 9.5 | CD: 12s[cite: 3]\nTags: Guardable | Stun (0.65s) | Push Back | MIXUP | EXTENDED CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 8[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/y-jaw-breaker.mp4"
      },
      {
        id: "c-immense-power",
        name: "C - [\"What Immense Power!\"] 🔴",
        description: "Star Platinum lunges out and drags the opponent on the ground before throwing them in the air.[cite: 3]\n\nDamage: 5.3 | CD: 12s[cite: 3]\nTags: Guardable | Grab | Medium Knockback+Soft Ragdoll | Stun (0.5s) | Rebound | COMBO EXTENDER/ENDER | EXTENDED CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 12 | Endlag: 0.2s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/c-immense-power.mp4"
      },
      {
        id: "c-space-immense-power",
        name: "C+[SPACE]{HELD} [🔼] - [\"What Immense Power!\"] 🔴",
        description: "Star Platinum lunges out and drags the opponent on the ground before throwing them in the air.[cite: 3]\n\nDamage: 5.3 | CD: 12s[cite: 3]\nTags: Guardable | Grab | Knockback+Soft Ragdoll | Stun (0.5s) | Rebound | Upper-Spike | COMBO EXTENDER/ENDER | EXTENDED CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 12 | Endlag: 0.2s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/c-space-immense-power.mp4"
      },
      {
        id: "c-up-no-mercy",
        name: "C [⬆️] - [\"No Mercy!\"] 🔴",
        description: "Star Platinum does an uppercut, before slamming the opponent back down to the ground with a strong hit.[cite: 3]\n\nDamage: 8.2 + 11.2 | CD: 12s[cite: 3]\nTags: True Guard Break | Knockback+Ragdoll | Down-Spike | COMBO ENDER [PARTIAL CUTSCENE] | CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 4+10 | Endlag: 0.2s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/c-up-no-mercy.mp4"
      },
      {
        id: "z-star-synchrony",
        name: "Z - [Star Synchrony] 🔴",
        description: "The user runs up and grabs the opponent, tumbling over with the victim’s neck in their arms. Star Platinum summons and the user chokes the victim, allowing Star Platinum to M1 before spinning them around and throwing them away.[cite: 3]\n\nDamage: 8.2 (grab) + 6.3 (throw) | CD: 25s[cite: 3]\nTags: Grab | Guard-Bypass | Light Parriable | Hyper Armor | Dodge Bypass > Knockback + Ragdoll | Rebound | COMBO ENDER [SUPER & PARTIAL CUTSCENE] | MID RANGE[cite: 3]\nHeat Cost: 30 | Heat Gain: 0 | Endlag: 0.5s(if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/z-star-synchrony.mp4",
        hasFinisher: true,
        finisherDescription: "Z - [Star Synchrony] Finisher: Cutscene. A cinematic beatdown where Star Platinum comes forward to face the victim, finishing with a black screen impact.[cite: 3]\n\nHP Required >45hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/z-star-synchrony-finisher.mp4"
      },
      {
        id: "z-up-star-drive",
        name: "Z [⬆️/✴️] - [Star Drive] 🔴",
        description: "Star Platinum catches the enemy, throws them in the air, before catching them and pile driving them to the floor.[cite: 3]\n\nDamage: 5.2 (grab) + 29.3 (ground hit) | CD: 20s[cite: 3]\nTags: Camera Aimable | Hyper Armor | True Guard Bypass | Grab | Knockback+Ragdoll | COMBO ENDER | CLOSE RANGE[cite: 3]\nHeat Cost: 20 | Heat Gain: 0 | Endlag: 0.4s(if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/z-up-star-drive.mp4"
      },
      {
        id: "h-stellar-resolve",
        name: "H - [Stellar Resolve] 🟣",
        description: "The user awakens its inner resolve and grows more powerful, as Star platinum goes in front of the user as the user does the iconic pose and yells in rage before returning to its original stance.[cite: 3]\n\nDamage: 1*10+25 | CD: 50s[cite: 3]\nTags: I-frames | True Guard/Counter/Dodge/Ragdoll/Grounded Bypass | Slows if in AOE | Stun (0.9s) | Push-Back | AWAKENING MOVE + PARTIAL-CUTSCENE | SUB-MID AOE[cite: 3]\nHeat Cost: 50 | Heat Gain: 0[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/h-stellar-resolve.mp4"
      },
      {
        id: "h-up-stellar-resolve",
        name: "H [⬆️] - [Stellar Resolve] 🟣",
        description: "The user awakens its inner resolve and grows more powerful, as Star platinum bursts out with rage.[cite: 3]\n\nDamage: 1*10+25 | CD: 50s[cite: 3]\nTags: I-frames | True Guard/Counter/Dodge/Ragdoll/Grounded Bypass | Slows if in AOE | Stun (0.9s) | Push-Back | AWAKENING MOVE + PARTIAL-CUTSCENE | SUB-MID AOE[cite: 3]\nHeat Cost: 50 | Heat Gain: 0[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/h-up-stellar-resolve.mp4"
      },
      {
        id: "h-red-stellar-resolve",
        name: "H [🟥] - [Stellar Resolve] 🟣",
        description: "CUTSCENE: The user drops to the floor on his knees then enters a flashback. Star Platinum's arm partially manifests and causes a massive crater, bigger than G move, and the roar stuns players and knocks them away at the end.[cite: 3]\n\nDamage: 12.2+ 1.2*7+7.3 | CD: 50s[cite: 3]\nTags: True I-frames | True Guard/Counter/Dodge/Ragdoll/Grounded Bypass | 90% Slowed after groundslam | Knockback+Ragdoll after roar | Stun (0.55s) | AWAKENING MOVE [SUPER & PARTIAL CUTSCENE] | MID+ AOE[cite: 3]\nHeat Cost: 50 | Heat Gain: 0[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/h-red-stellar-resolve.mp4"
      },
      {
        id: "j-destructive-uppercut",
        name: "J - [Destructive Uppercut] 🔴",
        description: "Star Platinum lunges forward and grabs the opponent, and launches them into the air before doing a second uppercut punch.[cite: 3]\n\nDamage: 3.2 (grab)+ 21.3 (punch)+ (Torso Damage) | CD: 16s[cite: 3]\nTags: Guardable | Grab | Knockback | Soft Ragdoll | Upper-Spike | COMBO EXTENDER | EXTENDED CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 10 | Endlag: 0.3s(if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/j-destructive-uppercut.mp4",
        hasFinisher: true,
        finisherDescription: "J - [Destructive Uppercut] Finisher: Cutscene. As the victim flies in the air, Star Platinum ZOOMS out to deliver a final punch to the victim.[cite: 3]\n\nHP Required >30hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/j-destructive-uppercut-finisher.mp4"
      },
      {
        id: "j-x-destructive-impact",
        name: "J+X - [Destructive Impact] 🔴",
        description: "Star Platinum lunges forward and grabs the opponent, and launches them into the air before doing a second skull punch to send them away.[cite: 3]\n\nDamage: 3.2 (grab)+ 26.3 (punch)+ (Skull Damage) | CD: 16s[cite: 3]\nTags: Guardable | Grab | Knockback | Soft Ragdoll | Rebound | COMBO EXTENDER | EXTENDED CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 12 | Endlag: 0.3s(if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/j-x-destructive-impact.mp4",
        hasFinisher: true,
        finisherDescription: "J+X - [Destructive Impact] Finisher: Cutscene. As the victim flies in the air, The user flash steps behind the enemy and follows up with an uppercut.[cite: 3]\n\nHP Required >45hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/j-x-destructive-impact-finisher.mp4"
      },
      {
        id: "j-up-sparking-fist",
        name: "J [🔼] - [Sparking Fist] 🔴",
        description: "Star Platinum and the user charges before lunging a punch forward that hits the enemy’s head before a second gut punch that sends the victim flying far away.[cite: 3]\n\nDamage: 25.3 + (Aimed Body Part Damage) | CD: 16s[cite: 3]\nTags: Guard Break | Knockback | Soft Ragdoll | Light Parriable | Hyper Armor | Grounded Bypass | COMBO EXTENDER | SEMI-MID RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 10 | Endlag: 0.3s(if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/j-up-sparking-fist.mp4"
      },
      {
        id: "j-wall-crushing-fist",
        name: "J [🧱] - [Crushing Fist] 🔴",
        description: "Star Platinum does a series of punches to the victim on the wall before a final punch to send them away.[cite: 3]\n\nDamage: 25.3 + (Aimed Body Part Damage) | CD: 16s[cite: 3]\nTags: Guard Break | Knockback | Soft Ragdoll | Light Parriable | Hyper Armor | Grounded Bypass | COMBO EXTENDER | SEMI-MID RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 10 | Endlag: 0.3s(if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/j-wall-crushing-fist.mp4"
      },
      {
        id: "j-up-red-nova",
        name: "J [🔼🟥] - [Nova Sparking Fist] 🔴",
        description: "Star Platinum and the user charges even more before lunging a punch forward. Upon impact, the stand drives their fist into the victim slowly until they blow away from the impact.[cite: 3]\n\nDamage: 29.3 (punch)+ (Aimed Body Part Damage) | CD: 16s[cite: 3]\nTags: True Guard Break | Heavy Knockback | Ragdoll | Counter Bypass | Hyper Armor+ Crash | Grounded Bypass | COMBO ENDER | SEMI-MID RANGE[cite: 3]\nHeat Cost: 15 | Heat Gain: 0 | Endlag: 0.4s(if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/j-up-red-nova.mp4",
        hasFinisher: true,
        finisherDescription: "J [🔼🟥] - [Nova Sparking Fist] Finisher: Non-Cutscene. Upon Impact, the screen goes grey for a second as the stand’s fist drives deeper into the victim's skull. Until their skull explodes due to the sheer force.[cite: 3]\n\nHP Required >30hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/j-up-red-nova-finisher.mp4"
      },
      // --- STAND-OFF MOVES ---
      {
        id: "so-e-blitz",
        name: "[Stand-Off] E - [Blitz Strike] 🔴",
        description: "Star Platinum zooms forward to punch the nearest opponent if they're in range.[cite: 4]\n\nDamage: 8.5 | CD: 12s[cite: 4]\nTags: Auto-Aim | Stun (0.7s) | Guardable | MIXUP | CLOSE RANGE+ | STAND POSITIONABLE[cite: 4]\nHeat Cost: 0 | Heat Gain: 10[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-e-blitz.mp4"
      },
      {
        id: "so-ee-rising",
        name: "[Stand-Off] E+E - [Rising Star] 🔴",
        description: "Star Platinum follows up with an upper punch that knocks the opponent away.[cite: 4]\n\nDamage: 7.9 | CD: 10s[cite: 4]\nTags: Follow-Up | Knockback+Ragdoll | Guard Break | Rebound | Light Parriable | Upper-Spike | ENDER | CLOSE RANGE+ | STAND POSITIONABLE[cite: 4]\nHeat Cost: 5 | Heat Gain: 0[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-ee-rising.mp4"
      },
      {
        id: "so-r-skull-shredder",
        name: "[Stand-Off] R - [Skull Shredder] 🔴",
        description: "Star Platinum blitzes out, grabs and crashes the victim to the floor and them tosses them away.[cite: 4]\n\nDamage: 9.4 + 4.2 | CD: 15s[cite: 4]\nTags: Knockback+Ragdoll | Guardable | COMBO ENDER | CLOSE+ RANGE | STAND POSITIONABLE[cite: 4]\nHeat Cost: 0 | Heat Gain: 3+1[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-r-skull-shredder.mp4"
      },
      {
        id: "so-t-neo-star",
        name: "[Stand-Off] T [♦️] - [Neo Star Breaker] 🔴",
        description: "Star Platinum charges one of its strongest punches at the victim. For every 3 seconds this is held, the move gets 50% more damage.[cite: 4]\n\nDamage: [Minimum] 16.0 | CD: 30s (+10s if past 4s charge)[cite: 4]\nTags: Heavy Knockback+Ragdoll | True Guard Break | Counter Bypass | Dodge Bypass | COMBO ENDER | CLOSE+ RANGE | STAND POSITIONABLE | AUTO STAND SUMMON[cite: 4]\nHeat Cost: 15 | Heat Gain: 0[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-t-neo-star.mp4"
      },
      {
        id: "so-y-back-off",
        name: "[Stand-Off] Y - [\"Back Off!\"] 🔴",
        description: "The user grabs the opponent as star platinum knocks them away.[cite: 4]\n\nDamage: 9.2 | CD: 15s[cite: 4]\nTags: Knockback+Soft Ragdoll | Guardable | Counter Bypass | COMBO ENDER/EXTENDER | CLOSE RANGE | AUTO STAND SUMMON[cite: 4]\nHeat Cost: 0 | Heat Gain: 5[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-y-back-off.mp4"
      },
      {
        id: "so-yr-understand",
        name: "[Stand-Off] Y+R - [\"Do You Understand?\"] 🔴",
        description: "The user grabs the opponent and restrains from behind for a couple seconds.[cite: 4]\n\nDamage: 2.1 | CD: 15s[cite: 4]\nTags: Knockback+Soft Ragdoll | Guardable | Counter Bypass | COMBO ENDER/EXTENDER | CLOSE RANGE | AUTO STAND SUMMON[cite: 4]\nHeat Cost: 0 | Heat Gain: 1[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-yr-understand.mp4"
      },
      {
        id: "so-yr-missed",
        name: "[Stand-Off] Y+R [🛑] - [\"Do You Understand\" Missed] 🔴",
        description: "When Missed, Star Platinum does a strong inhale that pulls in the enemy.[cite: 4]\n\nDamage: 0.0 | CD: 15s[cite: 4]\nTags: True Stun (0.85s) | Guardable | Dodge Bypass | Enemy Pull | Knockback Cancel | COMBO EXTENDER/MIXUP | SEMI MID[cite: 4]\nHeat Cost: 0 | Heat Gain: 0[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-yr-missed.mp4"
      },
      {
        id: "so-yre-brutal",
        name: "[Stand-Off] Y+R+E - [Brutal Beatdown] 🔴",
        description: "When used, Star Platinum comes out and does a swift combo of attacks leading to an uppercut hit before throwing them away from their legs.[cite: 4]\n\nDamage: 2.1 + X | CD: 15s[cite: 4]\nTags: Knockback+Soft Ragdoll | Guardable | Counter Bypass | COMBO ENDER/EXTENDER | CLOSE RANGE | AUTO STAND SUMMON[cite: 4]\nHeat Cost: 0 | Heat Gain: 1+X[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-yre-brutal.mp4"
      },
      {
        id: "so-y-knockout",
        name: "[Stand-Off] Y [✴️] - [\"Knockout!\"] 🔴",
        description: "Star Platinum appears in front of the enemy and grabs them before slamming them vertically to the ground.[cite: 4]\n\nDamage: 13.3 (-10% per 10 studs past 20 stud range, limit=70) | CD: 15s[cite: 4]\nTags: Knockback+Soft Ragdoll | Guardable | Dodge Bypass | COMBO ENDER/EXTENDER | MID + RANGE[cite: 4]\nHeat Cost: 15 | Heat Gain: 0[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-y-knockout.mp4"
      },
      {
        id: "so-h-platinum-fists",
        name: "[Stand-Off] H - [Platinum Fists] 🔴",
        description: "Star Platinum engulfs the user’s arms partially, acting as a damage, defence and attack speed buff. Mode can be toggled on and off freely.[cite: 4]\n\nDamage: Null | CD: 10s[cite: 4]\nTags: Move Buff | PASSIVE BUFFER | RANGE IRRELEANT[cite: 4]\nHeat Cost: 20 + 5/s | Heat Gain: 0[cite: 4]",
        videoSrc: "MOVE VIDEO HERE/so-h-platinum-fists.mp4"
      }
    ],
    awakeningMoves: [
      {
        id: "awk-m2-crushing-grip",
        name: "M2 - [Crushing Grip] 🔴",
        description: "Star Platinum grabs the opponent and throws them away with one arm.[cite: 3]\n\nDamage: 14.2 | CD: 10s[cite: 3]\nTags: Guardable | Knockback | Soft Ragdoll | COMBO ENDER | CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 6[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-m2-crushing-grip.mp4"
      },
      {
        id: "awk-m2x-crushing-rage",
        name: "M2+X - [Crushing Rage] 🔴",
        description: "Star Platinum grabs the opponent and slams them on the ground before tossing them away with one arm.[cite: 3]\n\nDamage: 17.2 + 3.2 + (Torso Damage) | CD: 10s[cite: 3]\nTags: Guardable | Knockback | Soft Ragdoll | COMBO ENDER | CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 6[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-m2x-crushing-rage.mp4"
      },
      {
        id: "awk-m2xc-crushing-fury",
        name: "M2+X+C - [Crushing Fury] 🔴",
        description: "Star Platinum grabs the opponent and slams them on the ground, dragging them on the floor and throwing them into the air.[cite: 3]\n\nDamage: 17.2 + 3.2 | CD: 10s[cite: 3]\nTags: Guardable | Knockback | Soft Ragdoll | COMBO ENDER | CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 6[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-m2xc-crushing-fury.mp4"
      },
      {
        id: "awk-r-star-breaker",
        name: "R [♦️] - [Star Breaker] 🔴",
        description: "This move loses the charged variant, however, for every 2 seconds this is held, the move’s power is increased by 50%.[cite: 3]\n\nDamage: 20.0 + (Skull Damage) | CD: 18s[cite: 3]\nTags: Guard Break | True Follow-Up | Ragdoll | Heavy Knockback | Hyper Armor | Hyper Armor Crash | Heavy Parriable | Uncancellable | COMBO ENDER | CLOSE RANGE[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-r-star-breaker.mp4"
      },
      {
        id: "awk-x-lightspeed-impact",
        name: "X [3nd 🟥] [🛡️] - [Lightspeed Impact] 🔴",
        description: "Star Platinum blitzes out for a powerful lightspeed punch to the opponent’s skull. The pressure from the wind acts as a projectile.[cite: 3]\n\nDamage: 40.4 | CD: 20s[cite: 3]\nTags: Heavy Knockback+Ragdoll | True Guard Bypass | Rebound | COMBO ENDER | MID RANGE + SEMI-MID RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 15 | Heat Gain: 5 | Endlag: 0.8s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-x-lightspeed-impact.mp4"
      },
      {
        id: "awk-h-timestop",
        name: "H - [\"Star Platinum!\"] 🟣",
        description: "Star Platinum stops the flow of time down to a standstill. Can be pre-emptively ended. Counters other timestops.[cite: 3]\n\nCD: 30s (-10s for each second cut short) | Cost: 50% Stand Endurance/s[cite: 3]\nTags: True Stun | Hyper Armor | SPECIAL MOVE [PARTIAL CUTSCENE] | AOE (HYPER LARGE SCALE)[cite: 3]\nHeat Requirement: 25 | Heat Gain Reduction: 50%[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-h-timestop.mp4"
      },
      {
        id: "awk-hm2-grab",
        name: "H+M2/LMB - [Grab] 🔴",
        description: "Star Platinum simply grabs the opponent, clicking again throws them.[cite: 3]\n\nDamage: 5.0 | CD: 10s[cite: 3]\nTags: Grab | Ragdoll+Knockback | Guardable | GRAB | CLOSE RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 0 | Endlag: 0.15s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-hm2-grab.mp4"
      },
      {
        id: "awk-g-neo-stardust-smash",
        name: "G [♦️] + G [🔳] - [Neo Stardust Smash] 🔴",
        description: "Star Platinum does a charged ground slam, if pressed again at the right time, causes a stronger shockwave impact.[cite: 3]\n\nDamage: 31.3 + 19.9 (shockwave) | CD: 23s[cite: 3]\nTags: Follow-up | Guardable | Stun | Bypass Getup I-Frames | Grounded Bypass | Hyper Armor | Trip Ragdoll | Dodge Bypass | Stage Destruction | COMBO EXTENDER | AOE[cite: 3]\nHeat Cost: 0 | Heat Gain: 2+2+5[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-g-neo-stardust-smash.mp4"
      },
      {
        id: "awk-gm2-meteor-launch",
        name: "G+M2 - [Meteor Launch] 🔴",
        description: "Star Platinum punches the floor for a giant spiked boulder to flip out. Charges up to throw it.[cite: 3]\n\nDamage: 44.2 | CD: 25s[cite: 3]\nTags: True Guard Bypass | Counter Bypass | I-Frame Charge Up | Bypass Getup I-Frames | Insta Stand Crash | Ragdoll + Hyper Armor Bypass | Knockback + Ragdoll | Dodge Bypass | Grounded Bypass | COMBO ENDER / HEAVY PROJECTILE | MID RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 20[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-gm2-meteor-launch.mp4",
        hasFinisher: true,
        finisherDescription: "G+M2 - [Meteor Launch] Finisher: Non-Cutscene. The victim just splats in blood upon impact.[cite: 3]\n\nHP Required: >50hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/awk-gm2-meteor-launch-finisher.mp4"
      },
      {
        id: "awk-y-keep-change",
        name: "Y [🟥] - [\"And Keep The Damn Change!\"] 🔴",
        description: "Star Platinum punches the enemy, does a long, extensive barrage of punches, with stronger individual punches in-between.[cite: 3]\n\nDamage: 45.4 | CD: 30s[cite: 3]\nTags: Guardable | Counter Bypass | Grab | Hyper Armor | Heavy Knockback + Ragdoll | COMBO ENDER [SUPER] | EXTENDED CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 20 | Heat Gain: 0[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-y-keep-change.mp4",
        hasFinisher: true,
        finisherDescription: "Y [🟥] - [Platinum Fists] Finisher: Cutscene. A cinematic barrage sequence ending with an impact frame and shattered glass effect as the victim flies away.[cite: 3]\n\nHP Required: >50hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/awk-y-keep-change-finisher.mp4"
      },
      {
        id: "awk-hy-ora-ora",
        name: "H+Y [🟥] - [\"Ora Ora Ora!\"] 🔴",
        description: "In timestop, Star Platinum uppercuts the enemy, cracks knuckles, delivers a swift barrage, and the user casually dodges the flying victim and writes a receipt.[cite: 3]\n\nDamage: XX.XX | CD: 30s[cite: 3]\nTags: Guardable | Counter Bypass | Grab | Hyper Armor | Heavy Knockback + Ragdoll | COMBO ENDER [SUPER + MINI CUTSCENE] | CLOSE RANGE[cite: 3]\nHeat Cost: 20 | Heat Gain: 0[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-hy-ora-ora.mp4"
      },
      {
        id: "awk-c-crusading-comet",
        name: "C - [Crusading Comet] 🔴",
        description: "The user and star platinum rams a short distance, knocking away anyone in their path.[cite: 3]\n\nDamage: 17.2 | CD: 19s[cite: 3]\nTags: Guard Break | Counter Bypass | Hyper Armor | Light Parriable | Hyper Armor Bypass | Knockback + Soft Ragdoll | Dodge Bypass | Grounded Bypass | COMBO EXTENDER | SEMI-MID RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 7 | Endlag: 0.55s (if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-c-crusading-comet.mp4"
      },
      {
        id: "awk-c-run-up",
        name: "C [▶️/🟥] - [Crusading Comet] 🔴",
        description: "The user readies up and does a run up, grabbing anyone caught, holding them with Star Platinum's arms, then jumping and throwing them to the floor.[cite: 3]\n\nDamage: 13.2 (Grab) + 8.2 (Throw) | CD: 19s[cite: 3]\nTags: Guard Bypass | Grab | Hyper Armor Charge Up | Heavy Parriable | Insta Stand Crash | Hyper Armor Bypass | Knockback + Ragdoll | Dodge Bypass | Grounded Bypass | COMBO EXTENDER | LONG RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 3+2 | Endlag: 0.6s (if missed)[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-c-run-up.mp4"
      },
      {
        id: "awk-cg-destructive-rage",
        name: "C [▶️/🟥]+G - [Destructive Rage] 🔴+🟣",
        description: "After the throw, a QTE triggers 2 extra punches. If successful, user flash-warps behind the victim for a final back punch.[cite: 3]\n\nDamage: 17*3 + 25.9 + (Torso Damage) | CD: 30s | Cost: 20% Stand Endurance[cite: 3]\nTags: Grab Follow Up | Heavy Knockback+Ragdoll | Guard Bypass | Heavy Parriable | Insta Stand Crash | Hyper Armor Bypass | Dodge Bypass | Grounded Bypass | COMBO ENDER[cite: 3]\nHeat Cost: 0 | Heat Gain: 3+2[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-cg-destructive-rage.mp4",
        hasFinisher: true,
        finisherDescription: "C [🟥]+G - [Destructive Rage] Finisher: Cutscene Ender. The final punch breaks ribs, then zooms out showing the skeleton fracturing, sending the body miles away.[cite: 3]\n\nHP Required: >80hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/awk-cg-destructive-rage-finisher.mp4"
      },
      {
        id: "awk-fh-no-pity",
        name: "F+H [⚠️] - [\"I feel no pity for you at all...\"] 🟣",
        description: "Counter Move: Stops time, shatters victim's shins from behind, then gut punches them away. If missed, Star Platinum swipes fist.[cite: 3]\n\nDamage: 6.2 + 15.1 + (Leg Damage) . 12.3 if missed | CD: 25s + 3s Block CD | Cost: 40% Stand Endurance[cite: 3]\nTags: Ragdoll + Knockback | True Guard Break | Melee Counter | Missed > Stun + Push-Back | COMBO ENDER [MINI CUTSCENE + Counter] | SEMI-MID RANGE[cite: 3]\nHeat Cost: 20 (1 bar) | Heat Gain: 0 | Endlag: 0.35s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-fh-no-pity.mp4"
      },
      {
        id: "awk-x-ora-strike",
        name: "X [⏩] - [Ora Strike] 🔴",
        description: "As the user flashsteps, Star Platinum has already prepared a skull crushing punch to knock the victim away.[cite: 3]\n\nDamage: 18.5 | CD: 12s[cite: 3]\nTags: Standing Knockback | Guardable | Stun (0.35s) | COMBO EXTENDER | SEMI-MID RANGE[cite: 3]\nHeat Cost: 0 | Heat Gain: 8 | Endlag: 0.3s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-x-ora-strike.mp4",
        hasFinisher: true,
        finisherDescription: "X [⏩] - [Ora Strike] Finisher: Cutscene Ender. The punch sends the victim flying as the user and Star Platinum swiftly follow up for a quick combo of punches, ending with a final one to the skull.[cite: 3]\n\nHP Required: >20hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/awk-x-ora-strike-finisher.mp4"
      },
      {
        id: "awk-z-stardust-showdown",
        name: "Z - [Stardust Showdown] 🔴+🟡",
        description: "Star Platinum strikes the opponent as the camera pans to cutscene mode. The stand then delivers a series of punches to the victim before its final strike.[cite: 3]\n\nDamage: 10.0 + 2*49 + 42 | CD: 45s[cite: 3]\nTags: Guard Bypass | Counter Bypass | Hyper Armor Charge Up | Parriable | Insta Stand Crash | Hyper Armor Bypass | Heavy Knockback + Ragdoll | Dodge Bypass | COMBO ENDER [ULTIMATE & CUTSCENE] | CLOSE RANGE+[cite: 3]\nHeat Cost: 40 (2 Bars) | Heat Gain: 0 | Endlag: 0.85s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-z-stardust-showdown.mp4",
        hasFinisher: true,
        finisherDescription: "Z - [Stardust Showdown] Finisher: Cutscene. The victim imitates Dio in Cairo before the beatdown, ending with Star Platinum charging up its strongest skull punch to send the victim flying.[cite: 3]\n\nHP Required: >150hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/awk-z-stardust-showdown-finisher.mp4"
      },
      {
        id: "awk-hz-time-stands-still",
        name: "H+Z - [\"While Time Stands Still\"] 🔴+🟡",
        description: "Similar beatdown, but extends the timestop and does not grant endurance fatigue immunity. Time resumes when finished.[cite: 3]\n\nDamage: 125.0 | CD: 45s[cite: 3]\nTags: Guard Bypass | Counter Bypass | Hyper Armor Charge Up | Parriable | Insta Stand Crash | Hyper Armor Bypass | Heavy Knockback + Ragdoll | Dodge Bypass | Auto Timestop Ender | COMBO ENDER [ULTIMATE & CUTSCENE] | CLOSE RANGE+[cite: 3]\nHeat Cost: 40 (2 Bars) | Heat Gain: 0 | Endlag: 0.85s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-hz-time-stands-still.mp4"
      },
      {
        id: "awk-j-supernova-strike",
        name: "J - [Supernova Strike] 🔴",
        description: "Star Platinum charges up its strongest punch. Player mashes button to increase gigatons. Has 4 charges (Charged, Super Charged, Hyper Charged, Neo Charged).[cite: 3]\n\nDamage: [Base] 55.9 [Ultra] 185.9 (+ Skull Damage) | CD: 80s (40s if missed)[cite: 3]\nTags: True Guard Bypass | Counter Bypass | Hyper Armor | Heavy Parriable | Insta Stand Crash | Hyper Armor Bypass | Extreme Knockback + Ragdoll | True Damage | Dodge Bypass | COMBO ENDER [ULTIMATE & NON-CUTSCENE] | CLOSE RANGE+ | STAND POSITIONABLE[cite: 3]\nHeat Cost: 40 (2 Bars) | Heat Gain: 0 | Endlag: 0.65s[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-j-supernova-strike.mp4",
        hasFinisher: true,
        finisherDescription: "J - [Supernova Strike] Finisher: Cutscene. (Neo Charge) The stand downward hooks the victim, charging up to 100,000 gigatons and unleashing a punch that shatters the skeleton and sends a shockwave visible from outer space.[cite: 3]\n\nHP Required: >200hp[cite: 3]",
        finisherVideoSrc: "MOVE VIDEO HERE/awk-j-supernova-strike-finisher.mp4"
      },
      {
        id: "awk-hj-swift-fist",
        name: "H+J [💠] - [Swift Fist] 🔴",
        description: "Star Platinum lunges out and does a straight jab. Can be re-casted a total of 5 times with the last one being a mini cutscene and stronger.[cite: 3]\n\nDamage: 15.3 | CD: 0s[cite: 3]\nTags: Guardable | Standing Knockback | Ragdoll Bypass | Stun | COMBO EXTENDER/ENDER | EXTENDED CLOSE RANGE | STAND POSITIONABLE[cite: 3]\nHeat Cost: 0 | Heat Gain: 5[cite: 3]",
        videoSrc: "MOVE VIDEO HERE/awk-hj-swift-fist.mp4"
      }
    ]
  },
  { 
    id: 'the-world', name: 'The World', part: 'Part 3', color: '#F1C232', confirmed: true,
    quote: 'Invincibility, Immortality, STAND POWER!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'silver-chariot', name: 'Silver Chariot', part: 'Part 3', color: '#7CA9DE', confirmed: true,
    quote: 'Bravo OH Bravo!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'hierophant-green', name: 'Hierophant Green', part: 'Part 3', color: '#0DCB74', confirmed: true,
    quote: "It's time for your punishment, baby",
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'anubis', name: 'Anubis', part: 'Part 3', color: '#70237c', confirmed: true,
    quote: 'No one is stronger than you….use me and kill!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'magicians-red', name: "Magician's Red", part: 'Part 3', color: '#FF3C00', confirmed: true,
    quote: 'Hell 2 U!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'cursed-chariot', name: 'Cursed Chariot', part: 'Part 3', color: '#990000', confirmed: true,
    quote: "You're no match for two master swordsmen combined!",
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'horus', name: 'Horus', part: 'Part 3', color: '#3CC2FF', confirmed: true,
    quote: 'CRAWWWW!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'hermit-purple', name: 'Hermit Purple', part: 'Part 3', color: '#B651F0', confirmed: true,
    quote: 'OH MY GOD!!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'cream', name: 'Cream', part: 'Part 3', color: '#9c93c5', confirmed: true,
    quote: "One by one, one after the other, I'll scatter your atoms across my void",
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'emperor-hanged-man', name: 'Emperor + Hanged Man', part: 'Part 3', color: '#BF9000', secondaryColor: '#E7C279', confirmed: true,
    quote: 'Aye Aye Sir!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'shadow-the-world', name: 'Shadow The World', part: 'Part 3', color: '#A83AA6', confirmed: true,
    quote: 'What is it that you truly desire?',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },

  // --- Part 3: 6 unconfirmed, expected ---
  { 
    id: 'the-fool', name: 'The Fool', part: 'Part 3', color: '#E7C279', confirmed: false,
    quote: "Seems like I can't let a kid who likes dogs die",
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'justice', name: 'Justice', part: 'Part 3', color: '#CCCCCC', confirmed: false,
    quote: 'Justice Always wins!',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'death-13', name: 'Death 13', part: 'Part 3', color: '#4B2FA0', secondaryColor: '#F1C232', confirmed: false,
    quote: 'Lali-Ho',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'tower-of-grey', name: 'Tower of Grey', part: 'Part 3', color: '#6FA8DC', confirmed: false,
    quote: 'M A S S A C R E',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'sun', name: 'Sun', part: 'Part 3', color: '#E69138', confirmed: false,
    quote: 'THE SUN IS A DEADLY LASER',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
  { 
    id: 'geb', name: 'Geb', part: 'Part 3', color: '#3C7DE0', confirmed: false,
    quote: 'I do not fear death, for evil needs a saviour as well',
    description: "Desc Here", rarity: "Desc Here", standType: "Desc Here", moves: []
  },
];

function useStandsByPart(stands: Stand[]): Record<StandPart, Stand[]> {
  return useMemo(() => {
    const map = {} as Record<StandPart, Stand[]>;
    PART_ORDER.forEach((p) => (map[p] = []));
    stands.forEach((s) => {
      if (map[s.part]) map[s.part].push(s);
    });
    return map;
  }, [stands]);
}

// ============================================================================
// DATA LOADING + EDIT MODE
// Viewers: stands load from /data/stands.json (falls back to the built-in
// STANDS array above if that file is missing).
// Owner: visit any page URL with ?edit=1 and enter the password once (?edit=0 turns it off). Edits are
// kept as a draft in this browser only; "Export stands.json" downloads the file
// you then upload to public/data/stands.json in the repo to publish.
// ============================================================================

const DRAFT_KEY = 'bb-stands-draft-v1';
const EDIT_FLAG_KEY = 'bb-edit-mode';

// CHANGE THIS before you push. It keeps casual visitors out of edit mode, but it
// sits in the page code, so it is a lock on the door, not real security.
const EDIT_PASSWORD = '#Light@09*';

function readEditFlag(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get('edit');
    if (q === '0') localStorage.removeItem(EDIT_FLAG_KEY);
    if (q === '1' && localStorage.getItem(EDIT_FLAG_KEY) !== '1') {
      const attempt = window.prompt('Edit mode password:');
      if (attempt !== null && attempt === EDIT_PASSWORD) localStorage.setItem(EDIT_FLAG_KEY, '1');
    }
    return localStorage.getItem(EDIT_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

function useStandsData() {
  const [stands, setStandsState] = useState<Stand[]>(STANDS);
  const [editMode, setEditMode] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const edit = readEditFlag();
    setEditMode(edit);
    (async () => {
      let base: Stand[] = STANDS;
      try {
        const res = await fetch('/data/stands.json', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length) base = json as Stand[];
        }
      } catch {
        /* no published file yet, use built-in data */
      }
      if (edit) {
        try {
          const raw = localStorage.getItem(DRAFT_KEY);
          if (raw) {
            const draft = JSON.parse(raw);
            if (Array.isArray(draft) && draft.length) {
              base = draft as Stand[];
              if (!cancelled) setHasDraft(true);
            }
          }
        } catch {
          /* ignore corrupt draft */
        }
      }
      if (!cancelled) setStandsState(groupStandsVariants(base));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setStands = (next: Stand[]) => {
    setStandsState(next);
    if (editMode) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
        setHasDraft(true);
      } catch {
        /* storage full or blocked */
      }
    }
  };

  const resetDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    window.location.reload();
  };

  return { stands, editMode, hasDraft, setStands, resetDraft };
}

const inputCls =
  "w-full bg-[#14121a] border border-dashed border-[#3d3423] text-[#e6c278] text-sm px-2 py-1.5 font-mono focus:outline-none focus:border-[#c3a35e]";
const smallBtnCls =
  "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-[#3d3423] text-[#e6c278] bg-[#14121a] hover:border-[#c3a35e] transition-colors";

const EditField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = "",
}) => (
  <label className={`block ${className}`}>
    <span className="block text-[10px] font-mono uppercase tracking-widest text-[#8a857a] mb-1">{label}</span>
    {children}
  </label>
);

const EditBar: React.FC<{
  stands: Stand[];
  hasDraft: boolean;
  onImport: (s: Stand[]) => void;
  onReset: () => void;
  onAdd: () => void;
}> = ({ stands, hasDraft, onImport, onReset, onAdd }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    const blob = new Blob([JSON.stringify(stands, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stands.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file?: File) => {
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      if (Array.isArray(json)) onImport(json as Stand[]);
      else alert('That file is not a stands.json (expected a list of stands).');
    } catch {
      alert('Could not read that file as JSON.');
    }
  };

  const exitEdit = () => {
    try {
      localStorage.removeItem(EDIT_FLAG_KEY);
    } catch {}
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-wrap items-center gap-2 bg-[#0a0a0d] border border-[#c3a35e] p-2 shadow-[0_0_25px_rgba(195,163,94,0.25)] max-w-[calc(100vw-2rem)]">
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#34d399] px-1">
        Edit mode{hasDraft ? ' · draft saved' : ''}
      </span>
      <button type="button" className={smallBtnCls} onClick={onAdd}>+ Stand</button>
      <button type="button" className={smallBtnCls} onClick={() => fileRef.current?.click()}>Import</button>
      <button type="button" className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider bg-[#c3a35e] text-black font-bold" onClick={doExport}>
        Export stands.json
      </button>
      <button
        type="button"
        className={smallBtnCls}
        onClick={() => confirm('Discard your local draft and reload the published version?') && onReset()}
      >
        Reset
      </button>
      <button type="button" className={smallBtnCls} onClick={exitEdit}>Exit</button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          doImport(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
};

// ============================================================================
// SHARED CODEX BOX
// ============================================================================

const CodexBox: React.FC<CodexBoxProps> = ({
  title,
  subtitle,
  badge,
  children,
  accentColor = "border-[#2a2418] hover:border-[#c3a35e]",
  className = "",
}) => {
  return (
    <FadeScaleIn className={className}>
      <div
        className={`group relative bg-[#0a0a0d] border ${accentColor} transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(195,163,94,0.18)] p-6 rounded-sm overflow-hidden h-full`}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c3a35e]/40 to-transparent group-hover:via-[#c3a35e] transition-all duration-500" />

        {(title || badge) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#2a2418] group-hover:border-[#3d3423] transition-colors">
            <div>
              <h4 className="text-xl md:text-2xl font-['Gilda_Display',serif] text-[#e6c278] group-hover:text-white transition-colors tracking-wide">
                {title}
              </h4>
              {subtitle && <span className="text-xs font-mono text-[#8a857a] block mt-0.5">{subtitle}</span>}
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
// HEXAGON HONEYCOMB GRID
// ============================================================================

const HEX_GRID_STYLES = `
.hexcomb { --hex-w: 168px; --hex-h: calc(var(--hex-w) * 1.1547); }
@media (max-width: 1024px) { .hexcomb { --hex-w: 132px; } }
@media (max-width: 640px)  { .hexcomb { --hex-w: 100px; } }
@media (max-width: 420px)  { .hexcomb { --hex-w: 78px; } }

.hexcomb .hex-row { display: flex; }
.hexcomb .hex-row + .hex-row { margin-top: calc(var(--hex-h) * -0.25); }
.hexcomb .hex-row-offset { margin-left: calc(var(--hex-w) / 2); }

.hexcomb .hex-tile {
  width: var(--hex-w);
  height: var(--hex-h);
  flex-shrink: 0;
  position: relative;
}

.hexcomb .hex-clip {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.typewriter-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  transition: width 0.5s steps(20, end);
}

.hex-tile:hover .typewriter-text,
.hex-tile:focus-visible .typewriter-text {
  width: 100%;
}
`;

const StandHex: React.FC<{ stand: Stand; onSelect: (s: Stand) => void }> = ({ stand, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(stand)}
      aria-label={`Open ${stand.name} — ${stand.confirmed ? 'confirmed' : 'unconfirmed'}`}
      className={`hex-tile group outline-none transition-[filter] duration-300 hover:z-20 focus-visible:z-20 hover:drop-shadow-[0_0_18px_var(--stand-glow)] focus-visible:drop-shadow-[0_0_18px_var(--stand-glow)] ${
        stand.confirmed ? '' : 'opacity-[0.72]'
      }`}
      style={{ ['--stand-glow' as any]: stand.color }}
    >
      <span
        className="hex-clip absolute inset-0 bg-[#242019] transition-colors duration-300 group-hover:bg-[var(--stand-glow)] group-focus-visible:bg-[var(--stand-glow)]"
      />
      <span className="hex-clip absolute inset-[2.5px] bg-[#0d0c10] flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-[1.04]">
        
        {/* NEW FULL HEXAGON PFP - Updates conditionally if individual src is given */}
        <img 
          src={stand.pfpSrc || `INSERT STAND PFP HERE/${stand.id}.png`} 
          alt={`${stand.name} Profile`}
          className="absolute inset-0 w-full h-full object-cover opacity-[0.85] group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* INVISIBLE TEXT CONTAINER WITH BACKGROUND BOX AND TYPEWRITER REVEAL */}
        <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0a0a0d]/90 border border-[var(--stand-glow)] px-3 py-1 flex items-center justify-center shadow-lg">
          <span className="font-['Cormorant_Upright',serif] text-[10px] sm:text-xs font-bold text-center leading-tight text-white typewriter-text">
            {stand.name}
          </span>
        </div>
        
        {!stand.confirmed && <HelpCircle className="absolute bottom-2 w-4 h-4 text-[#8a857a] z-10 drop-shadow-md" />}
      </span>
    </button>
  );
};

const PartHexSection: React.FC<{ part: StandPart; stands: Stand[]; onSelect: (s: Stand) => void }> = ({
  part,
  stands,
  onSelect,
}) => {
  const PER_ROW = 6;
  const rows: Stand[][] = [];
  for (let i = 0; i < stands.length; i += PER_ROW) rows.push(stands.slice(i, i + PER_ROW));

  return (
    <FadeScaleIn className="mb-20">
      <div className="flex items-center gap-4 mb-10">
        <span className="h-px flex-1 bg-[#2a2418]" />
        <h3 className="text-xl md:text-2xl font-['Cormorant_Upright',serif] font-bold uppercase tracking-[0.3em] text-[#e6c278] whitespace-nowrap text-center">
          {part}
          <span className="block sm:inline text-[#8a857a] text-[11px] sm:text-sm tracking-widest font-mono normal-case sm:ml-3">
            {PART_TITLES[part]}
          </span>
        </h3>
        <span className="h-px flex-1 bg-[#2a2418]" />
      </div>

      {stands.length === 0 ? (
        <div className="border border-dashed border-[#2a2418] bg-[#0a0a0d]/60 py-14 text-center">
          <Lock className="w-5 h-5 text-[#3d3728] mx-auto mb-3" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#5c584f]">
            Archive Pending — No Stands Logged For This Part Yet
          </p>
        </div>
      ) : (
        <div className="hexcomb flex flex-col items-center overflow-x-auto pb-4">
          <style>{HEX_GRID_STYLES}</style>
          <div className="pt-2">
            {rows.map((row, rIdx) => (
              <div key={rIdx} className={`hex-row ${rIdx % 2 === 1 ? 'hex-row-offset' : ''}`}>
                {row.map((stand) => (
                  <StandHex key={stand.id} stand={stand} onSelect={onSelect} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </FadeScaleIn>
  );
};

// ============================================================================
// MOVE CARD COMPONENT
// Wide codex-style card: key badge + name header, "What it does" on the left,
// video on the right. Parses the existing move strings (name + description with
// Damage / CD / Tags / Heat lines) so no data changes are required.
// Optional per-move overrides on Move: blockable, parryable, armor.
// ============================================================================

interface MoveEditHandlers {
  onChange: (m: Move) => void;
  onDelete: () => void;
  onShift: (dir: -1 | 1) => void;
}

const stripCites = (s: string) => (s || '').replace(/\[cite:[^\]]*\]/g, '').trim();

const MOVE_ICON = '[\\u{1F534}\\u{1F535}\\u{1F7E0}-\\u{1F7EB}]';
const MOVE_ICON_TAIL = new RegExp(`(?:\\s*(?:${MOVE_ICON}|\\+))+\\s*$`, 'u');
const STAT_LINE = /^(Damage|CD|Cost|Heat Cost|Heat Gain|Heat Requirement|Heat Gain Reduction|Endlag|Tags)\s*:/i;

interface ParsedHead {
  key: string;
  mods: string[];
  stance?: string;
  title: string;
  icons: string;
}

function parseMoveName(raw: string): ParsedHead {
  let s = stripCites(raw);
  let stance: string | undefined;
  const st = s.match(/^\[([^\]]+)\]\s+(?=\S.* - )/);
  if (st) {
    stance = st[1];
    s = s.slice(st[0].length);
  }
  let icons = '';
  const tail = s.match(MOVE_ICON_TAIL);
  if (tail && tail[0].trim()) {
    icons = tail[0].replace(/\s+/g, '');
    s = s.slice(0, tail.index).trim();
  }
  const idx = s.indexOf(' - ');
  let left = idx >= 0 ? s.slice(0, idx) : '';
  let right = idx >= 0 ? s.slice(idx + 3) : s;
  const mods: string[] = [];
  left = left
    .replace(/\[([^\]]*)\]/g, (m, inner) => {
      if (/^[A-Za-z\-\s]{2,}$/.test(inner)) return m; // word brackets like [SPACE] stay in the key
      mods.push(inner.trim());
      return '';
    })
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s+/g, ' ')
    .trim();
  right = right.trim();
  const wrapped = right.match(/^\[(.*)\]$/);
  if (wrapped) right = wrapped[1];
  return { key: left, mods, stance, title: right, icons };
}

interface ParsedBody {
  prose: string;
  stats: [string, string][];
  tags: string[];
}

function parseMoveBody(raw: string): ParsedBody {
  const prose: string[] = [];
  const stats: [string, string][] = [];
  let tags: string[] = [];
  for (const line of stripCites(raw).split('\n')) {
    const t = line.trim();
    if (!t) {
      prose.push('');
      continue;
    }
    if (STAT_LINE.test(t)) {
      if (/^Tags\s*:/i.test(t)) {
        tags = t.replace(/^Tags\s*:\s*/i, '').split(/\s*\|\s*/).filter(Boolean);
      } else {
        t.split(/\s*\|\s*/).forEach((part) => {
          const i = part.indexOf(':');
          if (i > 0) stats.push([part.slice(0, i).trim(), part.slice(i + 1).trim()]);
        });
      }
    } else {
      prose.push(line);
    }
  }
  return { prose: prose.join('\n').replace(/\n{3,}/g, '\n\n').trim(), stats, tags };
}

const EXTRA_BLOCK_PROPS = [
  'Block Break',
  'Block Bypass (Passive)',
  'Block Bypass (Semi Active)',
  'Block Bypass (Active)',
  'True Block Break',
  'True Block Bypass',
] as const;

function deriveProps(tags: string[], move: Move, useOverrides: boolean) {
  const clean = tags.map((t) => t.replace(/\[[^\]]*\]/g, '').trim());
  const has = (re: RegExp) => clean.some((t) => re.test(t));
  const autoBlock = has(/guardable|guard break/i) && !has(/guard[-\s]?bypass/i);
  const autoParry = has(/parri(able|yable)/i) && !has(/un-?parri/i);
  let autoArmor = 'None';
  for (const t of clean) {
    const m = t.match(/(hyper|super|regular)\s+armou?r(?!\s*(?:bypass|crash|break))/i);
    if (m) {
      autoArmor = m[0].replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    }
  }
  // Extra block properties. Only the ones that map cleanly from tags are auto-detected;
  // the Passive / Semi Active / Active bypass tiers need to be set per move in edit mode.
  const autoExtras: string[] = [];
  if (clean.some((t) => /true guard break/i.test(t))) autoExtras.push('True Block Break');
  else if (clean.some((t) => /guard break/i.test(t))) autoExtras.push('Block Break');
  if (clean.some((t) => /true guard[-\s]?bypass|true guard\/.*bypass/i.test(t))) autoExtras.push('True Block Bypass');
  return {
    extras: useOverrides && move.blockExtras ? move.blockExtras : autoExtras,
    blockable: useOverrides && move.blockable !== undefined ? move.blockable : autoBlock,
    parryable: useOverrides && move.parryable !== undefined ? move.parryable : autoParry,
    armor: useOverrides && move.armor ? move.armor : autoArmor,
  };
}

// ----------------------------------------------------------------------------
// Variant grouping
// A "variant" is a move whose input has the same key as a plain move plus a
// modifier, e.g. "M2/LMB [🧱] - [You Bastard!]" under "M2/LMB - [Brute Force]".
// Different key combos (E+Y, X+T, ...) are never merged. Idempotent: moves that
// are already nested are left alone.
// ----------------------------------------------------------------------------
function groupMoveVariants(moves?: Move[]): Move[] | undefined {
  if (!moves) return moves;
  const idOf = (m: Move) => {
    const h = parseMoveName(m.name);
    return { gid: h.key ? `${h.stance || ''}|${h.key}` : '', mods: h.mods.length };
  };
  const bases = new Map<string, Move>();
  const out: Move[] = [];
  for (const m of moves) {
    const { gid, mods } = idOf(m);
    if (gid && mods === 0 && !bases.has(gid)) {
      const copy: Move = { ...m };
      bases.set(gid, copy);
      out.push(copy);
    } else {
      out.push(m);
    }
  }
  const result: Move[] = [];
  for (const m of out) {
    const { gid, mods } = idOf(m);
    const base = bases.get(gid);
    if (gid && mods > 0 && base && base !== m) {
      base.variants = [...(base.variants || []), { ...m }];
      base.hasVariant = true;
    } else {
      result.push(m);
    }
  }
  return result;
}

function groupStandsVariants(stands: Stand[]): Stand[] {
  return stands.map((s) => ({
    ...s,
    moves: groupMoveVariants(s.moves),
    awakeningMoves: groupMoveVariants(s.awakeningMoves),
  }));
}

const CardLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-[#7d8794] mb-1.5">{children}</span>
);

const PropPill: React.FC<{ label: string; on: boolean }> = ({ label, on }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-1 border font-mono text-[11px] ${
      on ? 'border-[#c3a35e] bg-[#14121a] text-[#e6e2d4]' : 'border-[#2a2418] bg-[#0d0c10] text-[#5c584f]'
    }`}
  >
    {on ? <Check className="w-3 h-3 text-[#34d399]" /> : <X className="w-3 h-3 text-[#ef4444]" />}
    <span className={on ? '' : 'line-through'}>{label}</span>
  </span>
);

const triSelectVal = (v?: boolean) => (v === undefined ? 'auto' : v ? 'yes' : 'no');
const triSelectParse = (v: string) => (v === 'auto' ? undefined : v === 'yes');

const SegRow: React.FC<{
  options: { id: string; label: string; title?: string }[];
  value: string;
  onChange: (id: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="flex divide-x divide-[#2a2418]">
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        title={o.title}
        onClick={() => onChange(o.id)}
        className={`flex-1 px-4 py-1.5 text-sm font-['Zen_Old_Mincho',serif] whitespace-nowrap transition-colors ${
          value === o.id ? 'bg-[#2a2418] text-[#e6c278]' : 'text-[#8a857a] hover:text-[#c7c2b5]'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// Editor for one move's own fields (used for the base move and for each variant).
const MoveFieldsEditor: React.FC<{ move: Move; onChange: (m: Move) => void }> = ({ move, onChange }) => {
  const currentExtras = deriveProps(parseMoveBody(move.description).tags, move, true).extras;
  const toggleExtra = (n: string) =>
    onChange({
      ...move,
      blockExtras: currentExtras.includes(n) ? currentExtras.filter((x) => x !== n) : [...currentExtras, n],
    });
  return (
    <div className="space-y-3">
      <EditField label="Move name (format: KEY [mods] - [Title] 🔴)">
        <input className={inputCls} value={move.name} onChange={(e) => onChange({ ...move, name: e.target.value })} />
      </EditField>
      <EditField label="Description (prose, then Damage/CD/Tags/Heat lines)">
        <textarea rows={7} className={inputCls} value={move.description} onChange={(e) => onChange({ ...move, description: e.target.value })} />
      </EditField>
      <EditField label="Video path (e.g. /videos/star-platinum/barrage.mp4)">
        <input className={inputCls} value={move.videoSrc} onChange={(e) => onChange({ ...move, videoSrc: e.target.value })} />
      </EditField>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <EditField label="Blockable">
          <select className={inputCls} value={triSelectVal(move.blockable)} onChange={(e) => onChange({ ...move, blockable: triSelectParse(e.target.value) })}>
            <option value="auto">Auto (from tags)</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </EditField>
        <EditField label="Parryable">
          <select className={inputCls} value={triSelectVal(move.parryable)} onChange={(e) => onChange({ ...move, parryable: triSelectParse(e.target.value) })}>
            <option value="auto">Auto (from tags)</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </EditField>
        <EditField label="Armor (blank = auto)">
          <input className={inputCls} value={move.armor || ''} onChange={(e) => onChange({ ...move, armor: e.target.value || undefined })} />
        </EditField>
      </div>
      <EditField label="Extra block properties">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {EXTRA_BLOCK_PROPS.map((n) => (
            <label key={n} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8a857a]">
              <input type="checkbox" checked={currentExtras.includes(n)} onChange={() => toggleExtra(n)} />
              {n}
            </label>
          ))}
          {move.blockExtras && (
            <button type="button" className={smallBtnCls} onClick={() => onChange({ ...move, blockExtras: undefined })}>
              Reset to auto
            </button>
          )}
        </div>
      </EditField>
      <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8a857a]">
        <input type="checkbox" checked={!!move.hasFinisher} onChange={(e) => onChange({ ...move, hasFinisher: e.target.checked })} />
        Has finisher
      </label>
      {move.hasFinisher && (
        <>
          <EditField label="Finisher description (format: KEY - [Title] 🔴: text, then stat lines)">
            <textarea rows={5} className={inputCls} value={move.finisherDescription || ''} onChange={(e) => onChange({ ...move, finisherDescription: e.target.value })} />
          </EditField>
          <EditField label="Finisher video path">
            <input className={inputCls} value={move.finisherVideoSrc || ''} onChange={(e) => onChange({ ...move, finisherVideoSrc: e.target.value })} />
          </EditField>
        </>
      )}
    </div>
  );
};

const MoveCard: React.FC<{ move: Move; standColor: string; edit?: MoveEditHandlers }> = ({ move, standColor, edit }) => {
  const [variantIdx, setVariantIdx] = useState(0); // 0 = base move, 1.. = variants
  const [activeTab, setActiveTab] = useState<'base' | 'finisher'>('base');

  const variants = move.hasVariant ? move.variants || [] : [];
  const safeIdx = variantIdx <= variants.length ? variantIdx : 0;
  const cur: Move = safeIdx === 0 ? move : variants[safeIdx - 1];
  const shownTab = cur.hasFinisher ? activeTab : 'base';

  const view = useMemo(() => {
    if (shownTab === 'finisher' && cur.finisherDescription) {
      const fd = stripCites(cur.finisherDescription);
      // Finisher text looks like: "E+M2 - [Barrage Finisher] 🔴: description..."
      const m = fd.match(/^(.{1,120}? - .{1,100}?):\s+([\s\S]*)$/);
      if (m) return { head: parseMoveName(m[1]), body: parseMoveBody(m[2]) };
      return { head: parseMoveName(cur.name), body: parseMoveBody(fd) };
    }
    return { head: parseMoveName(cur.name), body: parseMoveBody(cur.description) };
  }, [shownTab, cur.name, cur.description, cur.finisherDescription]);

  const { head, body } = view;
  const props = deriveProps(body.tags, cur, shownTab === 'base');

  const costEntry =
    body.stats.find(([k]) => /^heat cost$/i.test(k)) || body.stats.find(([k]) => /^heat requirement$/i.test(k));
  const costLabel = costEntry && /requirement/i.test(costEntry[0]) ? 'Heat Requirement' : 'Heat Cost';
  const otherStats = body.stats
    .filter((s) => s !== costEntry)
    .map(([k, v]) => [/^cd$/i.test(k) ? 'Cooldown' : k, v] as [string, string]);

  const videoSrc = shownTab === 'base' ? cur.videoSrc : cur.finisherVideoSrc;

  const variantOptions = variants.map((v, i) => {
    const h = parseMoveName(v.name);
    return {
      id: String(i + 1),
      label: variants.length === 1 ? 'Variant' : h.mods.join(' ') || h.title || `Variant ${i + 1}`,
      title: h.title,
    };
  });

  const addVariant = () => {
    const h = parseMoveName(move.name);
    const nv: Move = {
      id: `variant-${Date.now()}`,
      name: `${h.stance ? `[${h.stance}] ` : ''}${h.key} [🔼] - [New Variant] 🔴`,
      description: 'Description here',
      videoSrc: '',
    };
    edit?.onChange({ ...move, hasVariant: true, variants: [...(move.variants || []), nv] });
  };
  const setVariant = (i: number, nv: Move) =>
    edit?.onChange({ ...move, variants: (move.variants || []).map((x, j) => (j === i ? nv : x)) });

  return (
    <div className="bg-[#0a0a0d] border border-[#2a2418] hover:border-[#3d3423] transition-colors">
      {/* Header: key badge + name */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#2a2418] bg-[#0c0c10]">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {head.key && (
            <span className="inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 border border-[#3d3423] bg-[#14121a] font-mono text-xs text-[#e6c278] whitespace-nowrap">
              {head.key}
            </span>
          )}
          <h5 className="font-['Cormorant_Upright',serif] text-xl sm:text-2xl text-[#f0dfb2] tracking-wide leading-tight">
            {head.title}
          </h5>
          {head.stance && (
            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-[#3d3423] text-[#8a857a]">
              {head.stance}
            </span>
          )}
          {head.mods.map((m, i) => (
            <span key={i} className="font-mono text-[10px] px-1.5 py-0.5 border border-[#2a2418] bg-[#101014] text-[#c7c2b5]">
              {m}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {head.icons && <span className="text-sm leading-none">{head.icons}</span>}
          {(variants.length > 0 || cur.hasFinisher) && (
            <div className="border border-[#3d3423] divide-y divide-[#2a2418] bg-[#0d0c10]">
              {variants.length > 0 && (
                <SegRow
                  options={[{ id: '0', label: 'Base' }, ...variantOptions]}
                  value={String(safeIdx)}
                  onChange={(id) => setVariantIdx(Number(id))}
                />
              )}
              {cur.hasFinisher && (
                <SegRow
                  options={[
                    { id: 'base', label: 'Normal' },
                    { id: 'finisher', label: 'Finisher' },
                  ]}
                  value={shownTab}
                  onChange={(id) => setActiveTab(id as 'base' | 'finisher')}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body: details left, media right */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="p-5 min-w-0 md:border-r border-[#2a2418]">
          <CardLabel>What it does</CardLabel>
          <p className="text-sm sm:text-base text-[#d8c9a3] leading-relaxed font-['Zen_Old_Mincho',serif] whitespace-pre-wrap">
            {body.prose || '—'}
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <CardLabel>{costLabel}</CardLabel>
              <span className="font-mono text-sm text-[#e6e2d4]">{costEntry ? costEntry[1] : '0'}</span>
            </div>
            <div>
              <CardLabel>Block Properties</CardLabel>
              <div className="flex flex-col items-start gap-1.5">
                <PropPill label="Blockable" on={props.blockable} />
                <PropPill label="Parryable" on={props.parryable} />
                {EXTRA_BLOCK_PROPS.filter((n) => props.extras.includes(n)).map((n) => (
                  <PropPill key={n} label={n} on />
                ))}
              </div>
            </div>
            <div>
              <CardLabel>Armor Properties</CardLabel>
              <span className="font-['Zen_Old_Mincho',serif] text-sm text-[#e6c278]">{props.armor}</span>
            </div>
          </div>

          {otherStats.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#1c1912] flex flex-wrap items-baseline gap-x-6 gap-y-2">
              {otherStats.map(([k, v], i) => (
                <div key={i} className="flex items-baseline gap-2 min-w-0">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#7d8794] whitespace-nowrap">{k}</span>
                  <span className="font-mono text-xs text-[#e6e2d4]">{v}</span>
                </div>
              ))}
            </div>
          )}

          {body.tags.length > 0 && (
            <div className="mt-4">
              <CardLabel>Tags</CardLabel>
              <div className="flex flex-wrap gap-1.5">
                {body.tags.map((t, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-[#2a2418] bg-[#101014] text-[#9a9486]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#08080b] border-t md:border-t-0 border-[#2a2418]">
          <div className="relative aspect-video bg-[#121116] border border-[#2a2418] group overflow-hidden flex items-center justify-center">
            {videoSrc ? (
              <video
                key={videoSrc}
                src={videoSrc}
                controls
                className="absolute inset-0 w-full h-full object-cover z-10"
                poster={`INSERT STAND ART HERE/video-poster-placeholder.png`}
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
            <PlayCircle
              className="w-8 h-8 text-[#3d3423] group-hover:text-[var(--stand-glow)] transition-colors absolute z-0"
              style={{ ['--stand-glow' as any]: standColor }}
            />
          </div>
        </div>
      </div>

      {edit && (
        <div className="border-t border-dashed border-[#3d3423] bg-[#0d0c10] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#34d399]">Editing move</span>
            <div className="flex gap-1">
              <button type="button" className={smallBtnCls} onClick={() => edit.onShift(-1)}>↑</button>
              <button type="button" className={smallBtnCls} onClick={() => edit.onShift(1)}>↓</button>
              <button
                type="button"
                className={smallBtnCls}
                onClick={() => confirm(`Delete "${move.name}"${move.variants?.length ? ' and its variants' : ''}?`) && edit.onDelete()}
              >
                Delete
              </button>
            </div>
          </div>

          <MoveFieldsEditor move={move} onChange={edit.onChange} />

          <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8a857a]">
            <input
              type="checkbox"
              checked={!!move.hasVariant}
              onChange={(e) => {
                if (e.target.checked && !(move.variants && move.variants.length)) addVariant();
                else edit.onChange({ ...move, hasVariant: e.target.checked });
              }}
            />
            Has variant
          </label>

          {move.hasVariant && (
            <div className="space-y-3 pl-3 border-l border-[#3d3423]">
              {(move.variants || []).map((v, i) => (
                <div key={v.id} className="border border-dashed border-[#3d3423] p-3 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#34d399]">
                      Variant editor — {parseMoveName(v.name).title || `Variant ${i + 1}`}
                    </span>
                    <button
                      type="button"
                      className={smallBtnCls}
                      onClick={() =>
                        confirm(`Delete variant "${v.name}"?`) &&
                        edit.onChange({ ...move, variants: (move.variants || []).filter((_, j) => j !== i) })
                      }
                    >
                      Delete variant
                    </button>
                  </div>
                  <MoveFieldsEditor move={v} onChange={(nv) => setVariant(i, nv)} />
                </div>
              ))}
              <button type="button" className={smallBtnCls} onClick={addVariant}>
                + Add variant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// STAND DETAIL SCREEN
// ============================================================================

const InfoField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="p-4">
    <div className="text-[10px] font-mono uppercase tracking-widest text-[#8a857a] mb-1.5">{label}</div>
    <div className="text-sm font-bold text-[#e6c278]">{children}</div>
  </div>
);

const StandEditor: React.FC<{ stand: Stand; onChange: (s: Stand) => void; onDelete: () => void }> = ({
  stand,
  onChange,
  onDelete,
}) => (
  <div className="mb-8 border border-dashed border-[#c3a35e]/60 bg-[#0d0c10] p-5 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#34d399]">Editing {stand.name || 'stand'}</span>
      <button
        type="button"
        className={smallBtnCls}
        onClick={() => confirm(`Delete ${stand.name}? This removes it from your draft.`) && onDelete()}
      >
        Delete stand
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <EditField label="Name">
        <input className={inputCls} value={stand.name} onChange={(e) => onChange({ ...stand, name: e.target.value })} />
      </EditField>
      <EditField label="Part">
        <select className={inputCls} value={stand.part} onChange={(e) => onChange({ ...stand, part: e.target.value as StandPart })}>
          {PART_ORDER.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </EditField>
      <EditField label="Aura colour">
        <div className="flex gap-2">
          <input type="color" className="h-9 w-12 bg-transparent border border-[#3d3423]" value={/^#[0-9a-f]{6}$/i.test(stand.color) ? stand.color : '#c3a35e'} onChange={(e) => onChange({ ...stand, color: e.target.value })} />
          <input className={inputCls} value={stand.color} onChange={(e) => onChange({ ...stand, color: e.target.value })} />
        </div>
      </EditField>
      <EditField label="Rarity">
        <input className={inputCls} value={stand.rarity || ''} onChange={(e) => onChange({ ...stand, rarity: e.target.value })} />
      </EditField>
      <EditField label="Stand type" className="md:col-span-2">
        <input className={inputCls} value={stand.standType || ''} onChange={(e) => onChange({ ...stand, standType: e.target.value })} />
      </EditField>
      <EditField label="Profile image path (hexagon)">
        <input className={inputCls} placeholder="/stands/pfp/star-platinum.png" value={stand.pfpSrc || ''} onChange={(e) => onChange({ ...stand, pfpSrc: e.target.value })} />
      </EditField>
      <EditField label="Full art path">
        <input className={inputCls} placeholder="/stands/art/star-platinum.png" value={stand.fullArtSrc || ''} onChange={(e) => onChange({ ...stand, fullArtSrc: e.target.value })} />
      </EditField>
      <label className="flex items-end gap-2 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#8a857a]">
        <input type="checkbox" checked={stand.confirmed} onChange={(e) => onChange({ ...stand, confirmed: e.target.checked })} />
        Confirmed
      </label>
    </div>
    <EditField label="Quote">
      <input className={inputCls} value={stand.quote} onChange={(e) => onChange({ ...stand, quote: e.target.value })} />
    </EditField>
    <EditField label="Overview / description">
      <textarea rows={10} className={inputCls} value={stand.description || ''} onChange={(e) => onChange({ ...stand, description: e.target.value })} />
    </EditField>
  </div>
);

const StandDetailScreen: React.FC<{
  stand: Stand;
  onBack: () => void;
  editMode?: boolean;
  onChange?: (s: Stand) => void;
  onDelete?: () => void;
}> = ({ stand, onBack, editMode = false, onChange, onDelete }) => {
  // State for toggling between standard and awakening movesets
  const [moveCategory, setMoveCategory] = useState<'standard' | 'awakening'>('standard');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stand.id]);

  const displayedMoves = moveCategory === 'standard' ? stand.moves : stand.awakeningMoves;

  const setMoves = (list: Move[]) => {
    if (!onChange) return;
    onChange(moveCategory === 'standard' ? { ...stand, moves: list } : { ...stand, awakeningMoves: list });
  };
  const addMove = () =>
    setMoves([
      ...(displayedMoves || []),
      { id: `move-${Date.now()}`, name: 'New Move', description: 'Description here', videoSrc: '' },
    ]);

  return (
    <div className="animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#8a8578] bg-[#09090c] border border-[#1e1b24] hover:text-[#e6c278] hover:border-[#c3a35e] transition-all mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Stand Registry
      </button>

      {editMode && onChange && onDelete && <StandEditor stand={stand} onChange={onChange} onDelete={onDelete} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Individual Status Header Replacing "Pending Reveal" */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#2a2418] bg-[#0a0a0d] divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-[#2a2418]">
            <InfoField label="Rarity">
              {stand.rarity ? (
                stand.rarity
              ) : (
                <span className="flex items-center gap-1.5 text-[#8a857a] font-mono text-xs normal-case">
                  <Lock className="w-3 h-3" /> Pending Reveal
                </span>
              )}
            </InfoField>
            
            <InfoField label="Part">{stand.part} — {PART_TITLES[stand.part]}</InfoField>
            
            <InfoField label="Stand Type">
              {stand.standType ? (
                stand.standType
              ) : (
                <span className="flex items-center gap-1.5 text-[#8a857a] font-mono text-xs normal-case">
                  <Lock className="w-3 h-3" /> Pending Reveal
                </span>
              )}
            </InfoField>
            
            <InfoField label="Status">
              <span className={stand.confirmed ? 'text-[#34d399]' : 'text-[#e6c278]'}>
                {stand.confirmed ? 'Confirmed' : 'Unconfirmed'}
              </span>
            </InfoField>
          </div>

          <div
            className="relative bg-[#0a0a0d] border border-[#2a2418] p-6"
            style={{ borderLeftWidth: 4, borderLeftColor: stand.color }}
          >
            <p className="text-xl md:text-2xl font-['Gilda_Display',serif] text-white italic leading-snug mb-3">
              &ldquo;{stand.quote}&rdquo;
            </p>
            <span className="text-xs font-mono text-[#8a857a] uppercase tracking-widest">
              Signature line — {PART_TITLES[stand.part]} Stand Data
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-[#14121a] border border-[#2a2418] px-3 py-1.5 text-xs font-mono">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ background: stand.color }}
              />
              <span className="text-[#8a857a] uppercase tracking-wider">Aura Colour</span>
              <span className="text-[#e6c278]">{stand.color}</span>
            </span>
            <span className="bg-[#1c1a24] text-[#e6c278] border border-[#3d3423] text-xs font-mono px-2.5 py-1.5 uppercase tracking-wider">
              Featured Arc: {PART_TITLES[stand.part]}
            </span>
            <span className="bg-[#1c1a24] text-[#e6c278] border border-[#3d3423] text-xs font-mono px-2.5 py-1.5 uppercase tracking-wider">
              {stand.confirmed ? 'Confirmed Playable' : 'Expected — Not Yet Confirmed'}
            </span>
          </div>

          {/* Unique Description Replacing Generalized Note */}
          <CodexBox title="Stand Overview" badge="CODEX ENTRY">
            <p className="text-[#c7c2b5] leading-relaxed whitespace-pre-wrap">
              {stand.description || "Desc Here"}
            </p>
          </CodexBox>

          <div className="flex items-start gap-3 bg-[#1c1810] border border-[#3d3423] p-4">
            <Info className="w-5 h-5 text-[#e6c278] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#c7c2b5] leading-relaxed">
              <strong className="text-[#e6c278]">{stand.confirmed ? 'Pre-launch note' : 'Unconfirmed note'}:</strong>{' '}
              {stand.confirmed
                ? `${stand.name} is confirmed for ${stand.part}, and its official kit data is currently being built into the codex.`
                : `${stand.name} hasn't been officially confirmed yet — it's expected based on current plans, but details may change before reveal.`}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN — portrait plate */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6 border border-[#2a2418] bg-[#0a0a0d] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2418] bg-[#121116]">
              <span
                className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 font-bold ${
                  stand.confirmed ? 'bg-[#c3a35e] text-black' : 'bg-[#2a2418] text-[#e6c278] border border-[#3d3423]'
                }`}
              >
                {stand.confirmed ? 'Confirmed' : 'Unconfirmed'}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-[#3d3423] text-[#e6c278]">
                {stand.part}
              </span>
            </div>

            <div className="relative aspect-[3/4] flex items-center justify-center bg-[#0d0c10] overflow-hidden">
              <ScrollBackground
                className="inset-0 bg-[radial-gradient(#c3a35e_1px,transparent_1px)] [background-size:14px_14px]"
                activeOpacity="opacity-15"
              />
              
              {/* UNIQUE ART PLACEHOLDER - Updates conditionally if individual src is given */}
              <img 
                src={stand.fullArtSrc || `INSERT STAND ART HERE/${stand.id}.png`}
                alt={`${stand.name} Full Art`}
                className="relative z-10 w-full h-full object-cover"
              />
              
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5 z-20"
                style={{ background: stand.color }}
              />
            </div>

            <div className="p-4 border-t border-[#2a2418]">
              <h3 className="text-xl font-['Gilda_Display',serif] text-[#e6c278]">{stand.name}</h3>
              <span className="text-xs font-mono text-[#8a857a]">{PART_TITLES[stand.part]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOVESET & ABILITIES SECTION — full width, below the two-column header area */}
      {(editMode || (stand.moves && stand.moves.length > 0) || (stand.awakeningMoves && stand.awakeningMoves.length > 0)) && (
        <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-10">
        <div className="mt-10 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2418] pb-4 mb-6">
            <h3 className="text-2xl font-['Gilda_Display',serif] text-[#e6c278] flex items-center gap-3">
              <Swords className="w-5 h-5" />
              Combat Abilities
            </h3>

            {/* Awakening Tab Navigation (Visible if Awakening Moves exist) */}
            {(editMode || (stand.awakeningMoves && stand.awakeningMoves.length > 0)) && (
              <div className="flex border border-[#2a2418] bg-[#0a0a0d] p-1">
                <button
                  onClick={() => setMoveCategory('standard')}
                  className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
                    moveCategory === 'standard' 
                      ? 'bg-[#1c1810] text-[#e6c278] border border-[#c3a35e]/30' 
                      : 'text-[#8a857a] hover:text-[#c7c2b5] border border-transparent'
                  }`}
                >
                  Standard Kit
                </button>
                <button
                  onClick={() => setMoveCategory('awakening')}
                  className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                    moveCategory === 'awakening' 
                      ? 'bg-[#1c1810] text-[#e6c278] border border-[#c3a35e]/30' 
                      : 'text-[#8a857a] hover:text-[#c7c2b5] border border-transparent'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Awakening
                </button>
              </div>
            )}
          </div>

          {/* Moves Grid */}
          <div className="flex flex-col gap-5">
            {displayedMoves && displayedMoves.length > 0 ? (
              displayedMoves.map((move, i) => (
                <MoveCard
                  key={move.id}
                  move={move}
                  standColor={stand.color}
                  edit={
                    editMode
                      ? {
                          onChange: (m) => setMoves(displayedMoves.map((x, j) => (j === i ? m : x))),
                          onDelete: () => setMoves(displayedMoves.filter((_, j) => j !== i)),
                          onShift: (dir) => {
                            const k = i + dir;
                            if (k < 0 || k >= displayedMoves.length) return;
                            const next = [...displayedMoves];
                            [next[i], next[k]] = [next[k], next[i]];
                            setMoves(next);
                          },
                        }
                      : undefined
                  }
                />
              ))
            ) : (
              <div className="col-span-full border border-dashed border-[#2a2418] bg-[#0a0a0d]/60 py-10 text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-[#5c584f]">
                  Moveset currently being documented
                </p>
              </div>
            )}
          </div>

          {editMode && (
            <button type="button" className={`${smallBtnCls} mt-4`} onClick={addMove}>
              + Add move to {moveCategory === 'standard' ? 'Standard Kit' : 'Awakening'}
            </button>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// STANDS SECTION (grid <-> detail screen)
// ============================================================================

const StandsSection: React.FC<{ initialStandId?: string | null }> = ({ initialStandId }) => {
  const { stands, editMode, hasDraft, setStands, resetDraft } = useStandsData();
  const standsByPart = useStandsByPart(stands);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const appliedNav = useRef<string | null>(null);

  // Opens straight to a specific Stand's detail screen when search
  // navigation hands us a standId (AbilitiesPage forwards it here after
  // picking up the 'navigate-tab' event / pending payload).
  useEffect(() => {
    if (!initialStandId || appliedNav.current === initialStandId) return;
    if (stands.some((s) => s.id === initialStandId)) {
      appliedNav.current = initialStandId;
      setSelectedId(initialStandId);
    }
  }, [initialStandId, stands]);

  const selectedStand = selectedId ? stands.find((s) => s.id === selectedId) || null : null;

  const updateStand = (next: Stand) => setStands(stands.map((s) => (s.id === next.id ? next : s)));
  const deleteStand = (id: string) => {
    setStands(stands.filter((s) => s.id !== id));
    setSelectedId(null);
  };
  const addStand = () => {
    const name = window.prompt('New stand name?');
    if (!name) return;
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'stand';
    let id = base;
    let n = 2;
    while (stands.some((s) => s.id === id)) id = `${base}-${n++}`;
    setStands([...stands, { id, name, part: 'Part 3', quote: '', color: '#c3a35e', confirmed: false, moves: [] }]);
    setSelectedId(id);
  };

  return (
    <>
      {selectedStand ? (
        <StandDetailScreen
          stand={selectedStand}
          onBack={() => setSelectedId(null)}
          editMode={editMode}
          onChange={updateStand}
          onDelete={() => deleteStand(selectedStand.id)}
        />
      ) : (
        <div className="animate-fadeIn">
          <CodexBox
            title="Stand Registry"
            badge="STAND DATA"
            accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]"
            className="mb-14"
          >
            <p className="text-sm sm:text-base text-[#c7c2b5] leading-relaxed">
              Every Stand featured in Beyond Bizarre, organized by the part it debuts in. Hover a cell to see its
              Stand aura colour, then click through to its full codex entry. Art is being logged in per-Stand as it's
              finalized — until then, each slot holds its place in the registry.
            </p>
          </CodexBox>

          {PART_ORDER.map((part) => (
            <PartHexSection key={part} part={part} stands={standsByPart[part]} onSelect={(s) => setSelectedId(s.id)} />
          ))}
        </div>
      )}

      {editMode && (
        <EditBar stands={stands} hasDraft={hasDraft} onImport={setStands} onReset={resetDraft} onAdd={addStand} />
      )}
    </>
  );
};

// ============================================================================
// SPECS & WEAPONS SECTIONS
// ============================================================================

const PlaceholderSection: React.FC<{ title: string; badge: string; icon: React.ReactNode; blurb: string }> = ({
  title,
  badge,
  icon,
  blurb,
}) => (
  <div className="animate-fadeIn">
    <CodexBox title={title} badge={badge} accentColor="border-l-4 border-l-[#c3a35e] border-[#2a2418]" className="mb-8">
      <p className="text-sm sm:text-base text-[#c7c2b5] leading-relaxed">{blurb}</p>
    </CodexBox>
    <div className="border border-dashed border-[#2a2418] bg-[#0a0a0d]/60 py-20 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-[#14121a] border border-[#3d3322] flex items-center justify-center">
        {icon}
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-[#5c584f]">
        Archive Pending — No {title} Logged Yet
      </p>
    </div>
  </div>
);

// ============================================================================
// ABILITIES PAGE (default export)
// ============================================================================

export default function AbilitiesPage() {
  const [activeTab, setActiveTab] = useState<AbilityTab>('stands');
  // Set by search navigation when the target result carries a standId
  // (Abilities > Stands entries). Forwarded to StandsSection so it opens
  // straight to that Stand's detail screen instead of the registry grid.
  const [navStandId, setNavStandId] = useState<string | null>(null);

  // Respond to search-driven navigation: SearchModal fires a 'navigate-tab'
  // window event (and stashes the same payload on window.__pendingSearchNav
  // in case this component mounts *after* the event fires, e.g. coming from
  // the Homepage tab). Mirrors the same pattern Combat.tsx uses.
  useEffect(() => {
    const applyNav = (detail: any) => {
      if (!detail || detail.tab !== 'abilities') return;
      if (detail.subTab) {
        setActiveTab(detail.subTab as AbilityTab);
      }
      setNavStandId(detail.standId || null);
    };

    const pending = (window as any).__pendingSearchNav;
    if (pending) {
      (window as any).__pendingSearchNav = null;
      applyNav(pending);
    }

    const handleNavigate = (e: Event) => applyNav((e as CustomEvent).detail);
    window.addEventListener('navigate-tab', handleNavigate);
    return () => window.removeEventListener('navigate-tab', handleNavigate);
  }, []);

  const TAB_CONFIG: { id: AbilityTab; label: string; icon: React.ReactNode }[] = [
    { id: 'stands', label: 'Stands', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'specs', label: 'Specs', icon: <Swords className="w-4 h-4" /> },
    { id: 'weapons', label: 'Weapons', icon: <Wrench className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0ded8] font-['Zen_Old_Mincho',serif] selection:bg-[#c3a35e] selection:text-black p-4 md:p-10 relative overflow-hidden">
      <ScrollBackground
        className="top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#322714]/30 via-[#050505]/95 to-transparent pointer-events-none -z-10"
        activeOpacity="opacity-100"
      />

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
                  Special{" "}
                  <span className="text-[#c3a35e]">
                    Abilites
                  </span>
                </h1>
              </FadeScaleIn>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8a857a] md:text-base">
                <FadeScaleIn delay={200}>
                  <span>
                    Master the intricacies of Combat, Movement, Stand Combat, Progression Paths, and advanced mechanics in this complete tactical manual.
                  </span>
                </FadeScaleIn>
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

      <nav className="flex flex-wrap gap-2 sm:gap-4 mb-14 pb-2 border-b border-[#2a2418] pt-2 justify-center max-w-7xl mx-auto z-20 relative">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
              activeTab === tab.id
                ? 'bg-[#1c1810] text-[#e6c278] border-[#c3a35e] shadow-[0_0_15px_rgba(195,163,94,0.15)]'
                : 'bg-[#09090c] text-[#8a8578] border-[#1e1b24] hover:text-[#c7c2b5] hover:border-[#3d3322]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto">
        {activeTab === 'stands' && <StandsSection initialStandId={navStandId} />}
        {activeTab === 'specs' && (
          <PlaceholderSection
            title="Specs"
            badge="CHARACTER SPECS"
            icon={<Swords className="w-5 h-5 text-[#e6c278]" />}
            blurb="Character specs — base stats, scaling, and per-archetype breakdowns — will live here once that data is ready to log."
          />
        )}
        {activeTab === 'weapons' && (
          <PlaceholderSection
            title="Weapons"
            badge="WEAPON REGISTRY"
            icon={<Wrench className="w-5 h-5 text-[#e6c278]" />}
            blurb="The weapon registry — melee, ranged, and Stand-augmented gear — will live here once that data is ready to log."
          />
        )}
      </main>
    </div>
  );
}