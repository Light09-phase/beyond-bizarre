"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, ArrowRight } from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  tab: "combat" | "abilities";
  subTab:
    | "overview"
    | "combat"
    | "mobility"
    | "stand-combat"
    | "progression"
    | "stands"
    | "specs"
    | "weapons";
  // Optional: Combat sections have a real DOM id to scroll to. Abilities
  // currently doesn't expose per-section ids, so this is omitted there.
  anchorId?: string;
  // Optional: for entries that live inside one of Combat.tsx's
  // DynamicVideoPlate switchers (Heavy Strike, Critical Arts, Mobility,
  // Stand Combat), this is the matching VideoOption.id in that switcher's
  // options array (e.g. heavyStrikeOptions). Combat.tsx uses it to flip
  // the switcher to the exact variant the user searched for, instead of
  // just scrolling to the section and leaving whatever variant was
  // already selected.
  variantId?: string;
  // Only used for tab: "abilities", subTab: "stands" — tells Abilities.tsx
  // which Stand's detail screen to open directly.
  standId?: string;
  keywords?: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab?: (tab: string) => void;
}

/*
 * Search catalog mirrors the actual option data in combat.tsx.
 *
 * Combat:
 *   heavyStrikeOptions
 *   criticalArtOptions
 *
 * Mobility:
 *   mobilityOptions
 *
 * Stand Combat:
 *   standCombatOptions
 *
 * Navigation is event-based instead of URL-based so the modal can
 * navigate to Combat even when Combat is not currently mounted.
 */
const searchData: SearchItem[] = [
  // ---------------------------------------------------------------------------
  // OVERVIEW
  // ---------------------------------------------------------------------------
  {
    id: "overview-welcome",
    title: "Revolutionizing Combat: Welcome",
    category: "Overview",
    tab: "combat",
    subTab: "overview",
    anchorId: "overview-welcome",
    keywords: [
      "welcome",
      "system manual",
      "intro",
      "introduction",
      "combat genre",
      "controls",
      "combat style",
    ],
  },
  {
    id: "overview-pillar-combat",
    title: "Prioritized Offense (Overview)",
    category: "Overview · Core Pillars",
    tab: "combat",
    subTab: "overview",
    anchorId: "overview-pillar-combat",
    keywords: [
      "prioritized offense",
      "combat pillar",
      "light strikes",
      "heavy attacks",
      "cancel tech",
    ],
  },
  {
    id: "overview-pillar-mobility",
    title: "Dynamic Movement (Overview)",
    category: "Overview · Core Pillars",
    tab: "combat",
    subTab: "overview",
    anchorId: "overview-pillar-mobility",
    keywords: [
      "dynamic movement",
      "mobility pillar",
      "directional dashes",
      "parkour",
      "agility",
    ],
  },
  {
    id: "overview-pillar-stands",
    title: "Stand Abilities (Overview)",
    category: "Overview · Core Pillars",
    tab: "combat",
    subTab: "overview",
    anchorId: "overview-pillar-stands",
    keywords: [
      "stand abilities",
      "stands pillar",
      "manifest",
      "supernatural",
    ],
  },

  // ---------------------------------------------------------------------------
  // COMBAT — HEAVY STRIKE OPTIONS
  // ---------------------------------------------------------------------------
  {
    id: "heavy-strike-basic",
    title: "Heavy Strike",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "basic",
    keywords: [
      "heavy",
      "strike",
      "m2",
      "rmb",
      "heavy combo ender",
      "guard break",
      "parry",
      "knockback",
      "ragdoll",
    ],
  },
  {
    id: "heavy-strike-down",
    title: "Down Strike",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "down",
    keywords: [
      "down",
      "strike",
      "air combat",
      "airborne",
      "m2",
      "down spike",
      "guard bypass",
      "rebound",
    ],
  },
  {
    id: "heavy-strike-sky",
    title: "Sky Strike",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "sky",
    keywords: [
      "sky",
      "strike",
      "launcher",
      "uppercut",
      "upper kick",
      "space",
      "m2",
      "up spike",
    ],
  },
  {
    id: "heavy-strike-ground",
    title: "Ground Strike",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "ground",
    keywords: [
      "ground",
      "strike",
      "ground pin",
      "airborne",
      "m2",
      "guard break",
      "ragdoll bypass",
    ],
  },
  {
    id: "heavy-strike-step",
    title: "Step Strike",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "step",
    keywords: [
      "step",
      "strike",
      "forward dash",
      "mobility",
      "m2",
      "grand upper",
    ],
  },
  {
    id: "heavy-strike-low",
    title: "Low Strike",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "low",
    keywords: [
      "low",
      "strike",
      "trip",
      "tripping",
      "side step",
      "flash rush",
      "down strike",
      "stun",
    ],
  },
  {
    id: "heavy-strike-flash",
    title: "Flash Strike & Flash Rush",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "flash",
    keywords: [
      "flash",
      "strike",
      "flash rush",
      "flash step",
      "teleport",
      "m2",
      "stun",
      "down spike",
    ],
  },
  {
    id: "heavy-strike-clash",
    title: "M2 Clashing",
    category: "Combat · Heavy Strike",
    tab: "combat",
    subTab: "combat",
    anchorId: "heavy-strike",
    variantId: "clash",
    keywords: [
      "m2",
      "clash",
      "clashing",
      "simultaneous",
      "mutual pushback",
      "no victor",
      "stun neutralization",
    ],
  },

  // ---------------------------------------------------------------------------
  // COMBAT — GUARD SYSTEM (Guard Endurance, Perfect/Evasive/Reflective Guard)
  // ---------------------------------------------------------------------------
  {
    id: "guard-endurance",
    title: "Guard Endurance",
    category: "Combat · Guard",
    tab: "combat",
    subTab: "combat",
    anchorId: "guard-endurance",
    keywords: [
      "guard",
      "endurance",
      "block",
      "guard bar",
      "guard break",
      "guard decay",
      "block points",
    ],
  },
  {
    id: "perfect-guard",
    title: "Perfect Guard / Parry",
    category: "Combat · Guard",
    tab: "combat",
    subTab: "combat",
    anchorId: "perfect-guard",
    keywords: [
      "perfect guard",
      "parry",
      "parrying",
      "perception zone",
      "light parry",
      "heavy parry",
      "f key",
      "timed",
    ],
  },
  {
    id: "evasive-guard",
    title: "Evasive Guard / Dodge",
    category: "Combat · Guard",
    tab: "combat",
    subTab: "combat",
    anchorId: "evasive-guard",
    keywords: [
      "evasive guard",
      "dodge",
      "side dash",
      "guard dash",
      "evade",
      "guard points",
    ],
  },
  {
    id: "reflective-guard",
    title: "Reflective Guard / Reflect",
    category: "Combat · Guard",
    tab: "combat",
    subTab: "combat",
    anchorId: "reflective-guard",
    keywords: [
      "reflective guard",
      "reflect",
      "reflecting",
      "projectile",
      "timed f",
      "sonic sway",
    ],
  },

  // ---------------------------------------------------------------------------
  // COMBAT — CRITICAL ART OPTIONS
  // ---------------------------------------------------------------------------
  {
    id: "critical-m1-amp",
    title: "Amplified Strike (M1)",
    category: "Combat · Critical Arts",
    tab: "combat",
    subTab: "combat",
    anchorId: "critical-arts",
    variantId: "m1-amp",
    keywords: [
      "amplified",
      "strike",
      "m1",
      "critical",
      "critical art",
      "perception zone",
      "guard depletion",
      "overdrive",
      "stun",
    ],
  },
  {
    id: "critical-m1-crit",
    title: "Critical Strike (M1)",
    category: "Combat · Critical Arts",
    tab: "combat",
    subTab: "combat",
    anchorId: "critical-arts",
    variantId: "m1-crit",
    keywords: [
      "critical",
      "strike",
      "m1",
      "green zone",
      "qte",
      "overdrive",
      "will",
    ],
  },
  {
    id: "critical-m1-max",
    title: "Maximum Critical Strike (M1)",
    category: "Combat · Critical Arts",
    tab: "combat",
    subTab: "combat",
    anchorId: "critical-arts",
    variantId: "m1-max",
    keywords: [
      "maximum",
      "critical",
      "strike",
      "m1",
      "blue zone",
      "qte",
      "max critical",
      "will",
      "debuff",
    ],
  },
  {
    id: "critical-m2-amp",
    title: "Amplified Strike (M2)",
    category: "Combat · Critical Arts",
    tab: "combat",
    subTab: "combat",
    anchorId: "critical-arts",
    variantId: "m2-amp",
    keywords: [
      "amplified",
      "strike",
      "m2",
      "critical",
      "critical art",
      "perception zone",
      "grand knockback",
      "overdrive",
    ],
  },
  {
    id: "critical-m2-crit",
    title: "Critical Strike (M2)",
    category: "Combat · Critical Arts",
    tab: "combat",
    subTab: "combat",
    anchorId: "critical-arts",
    variantId: "m2-crit",
    keywords: [
      "critical",
      "strike",
      "m2",
      "green zone",
      "qte",
      "grand knockback",
      "will",
      "overdrive",
    ],
  },
  {
    id: "critical-m2-max",
    title: "Maximum Critical Strike (M2)",
    category: "Combat · Critical Arts",
    tab: "combat",
    subTab: "combat",
    anchorId: "critical-arts",
    variantId: "m2-max",
    keywords: [
      "maximum",
      "critical",
      "strike",
      "m2",
      "blue zone",
      "qte",
      "max critical",
      "knockback",
      "will",
      "debuff",
    ],
  },

  // ---------------------------------------------------------------------------
  // COMBAT — ADD-ONS (Combat Tag, Burst, Targeting, Joestar's Will)
  // ---------------------------------------------------------------------------
  {
    id: "combat-tag-system",
    title: "Combat Tag System",
    category: "Combat · Add-Ons",
    tab: "combat",
    subTab: "combat",
    anchorId: "combat-tag-system",
    keywords: [
      "combat tag",
      "tag system",
      "combat lock",
      "combat apology",
      "wall running lock",
      "fast travel lock",
    ],
  },
  {
    id: "combat-burst",
    title: "Burst (Combo Breaker / Anti Team)",
    category: "Combat · Add-Ons",
    tab: "combat",
    subTab: "combat",
    anchorId: "combat-burst",
    keywords: [
      "burst",
      "combo breaker",
      "anti team",
      "true block bypass",
      "true stun",
      "hyper armor",
      "counter bypass",
    ],
  },
  {
    id: "targeting-sense",
    title: "Targeting & Sense Mechanics",
    category: "Combat · Add-Ons",
    tab: "combat",
    subTab: "combat",
    anchorId: "targeting-sense",
    keywords: [
      "targeting",
      "target mark",
      "spiritual sight",
      "target re-lock",
      "auto aim",
      "l key",
      "sense",
    ],
  },
  {
    id: "joestars-will",
    title: "Joestar's Will",
    category: "Combat · Add-Ons",
    tab: "combat",
    subTab: "combat",
    anchorId: "joestars-will",
    keywords: [
      "joestars will",
      "will power",
      "joestars mark",
      "dark determination",
      "burning passion",
      "overdrive",
    ],
  },

  // ---------------------------------------------------------------------------
  // COMBAT — GAUGE & STYLE SYSTEMS
  // ---------------------------------------------------------------------------
  {
    id: "style-ranks",
    title: "Combo Style Ranks",
    category: "Combat · Gauge & Style",
    tab: "combat",
    subTab: "combat",
    anchorId: "style-ranks",
    keywords: [
      "style rank",
      "combo style",
      "di molto",
      "crazy",
      "bizarre",
      "all star",
      "stardust",
      "overdrive rank",
      "dmc",
    ],
  },

  // ---------------------------------------------------------------------------
  // COMBAT — STATUS EFFECTS (Overwhelmed/Overdrive, DOTs, Body Part Damage)
  // ---------------------------------------------------------------------------
  {
    id: "status-overwhelmed",
    title: "Overwhelmed (Status)",
    category: "Combat · Status Effects",
    tab: "combat",
    subTab: "combat",
    anchorId: "status-overwhelmed",
    keywords: [
      "overwhelmed",
      "debuff",
      "vision blur",
      "vignette",
      "a rank combo",
    ],
  },
  {
    id: "status-overdrive",
    title: "Overdrive (Status)",
    category: "Combat · Status Effects",
    tab: "combat",
    subTab: "combat",
    anchorId: "status-overdrive",
    keywords: [
      "overdrive",
      "buff",
      "damage buff",
      "cleanse status",
      "parry window",
      "heat restore",
    ],
  },
  {
    id: "status-bleed",
    title: "Bleed",
    category: "Combat · Status Effects · DOT",
    tab: "combat",
    subTab: "combat",
    anchorId: "status-bleed",
    keywords: [
      "bleed",
      "dot",
      "damage over time",
      "injured",
      "movement speed",
      "regen speed",
    ],
  },
  {
    id: "status-burn",
    title: "Burn",
    category: "Combat · Status Effects · DOT",
    tab: "combat",
    subTab: "combat",
    anchorId: "status-burn",
    keywords: [
      "burn",
      "dot",
      "damage over time",
      "scorch",
      "endurance",
      "defence",
      "defense",
    ],
  },
  {
    id: "status-poison",
    title: "Poison",
    category: "Combat · Status Effects · DOT",
    tab: "combat",
    subTab: "combat",
    anchorId: "status-poison",
    keywords: [
      "poison",
      "toxic",
      "dot",
      "damage over time",
      "endurance",
      "defense",
    ],
  },
  {
    id: "status-wither",
    title: "Wither",
    category: "Combat · Status Effects · DOT",
    tab: "combat",
    subTab: "combat",
    anchorId: "status-wither",
    keywords: [
      "wither",
      "curse",
      "dot",
      "damage over time",
      "regeneration",
      "health regen",
      "endurance recovery",
    ],
  },
  {
    id: "body-part-damage",
    title: "Body Part Damage Breakdown",
    category: "Combat · Status Effects",
    tab: "combat",
    subTab: "combat",
    anchorId: "body-part-damage",
    keywords: [
      "body part damage",
      "locational damage",
      "skull",
      "torso",
      "legs",
      "arms",
      "stun",
      "slowness",
    ],
  },

  // ---------------------------------------------------------------------------
  // COMBAT — ADVANCED MECHANICS
  // ---------------------------------------------------------------------------
  {
    id: "dynamic-destruction",
    title: "Dynamic Destruction & Stage Pinning",
    category: "Combat · Advanced Mechanics",
    tab: "combat",
    subTab: "combat",
    anchorId: "dynamic-destruction",
    keywords: [
      "dynamic destruction",
      "stage pinning",
      "wall pin",
      "wall destruction",
      "map destruction",
      "bonus damage",
    ],
  },
  {
    id: "long-range-mixing",
    title: "Long Range & Mixing",
    category: "Combat · Advanced Mechanics",
    tab: "combat",
    subTab: "combat",
    anchorId: "long-range-mixing",
    keywords: [
      "long range",
      "mixing",
      "neutral",
      "flash step approach",
      "ranged projectiles",
      "guns",
      "style rank",
    ],
  },
  {
    id: "move-shift-mechanic",
    title: "Move Shift Mechanic",
    category: "Combat · Advanced Mechanics",
    tab: "combat",
    subTab: "combat",
    anchorId: "move-shift",
    keywords: [
      "move shift",
      "variant tech",
      "move variants",
      "windup",
      "mid animation",
      "cancel",
    ],
  },

  // ---------------------------------------------------------------------------
  // MOBILITY
  // ---------------------------------------------------------------------------
  {
    id: "mobility-walk-sprint",
    title: "3-Stage Walk / Run / Sprint",
    category: "Mobility",
    tab: "combat",
    subTab: "mobility",
    anchorId: "mobility-switcher",
    variantId: "walk-sprint",
    keywords: [
      "walk",
      "run",
      "sprint",
      "movement",
      "speed",
      "wasd",
      "shift",
      "ctrl",
      "momentum",
    ],
  },
  {
    id: "mobility-flash-step",
    title: "Flash Step & Directional Evade",
    category: "Mobility",
    tab: "combat",
    subTab: "mobility",
    anchorId: "mobility-switcher",
    variantId: "flash-step",
    keywords: [
      "flash step",
      "directional evade",
      "evade",
      "blink",
      "dodge",
      "q",
      "i-frames",
      "invincibility",
      "recovery cancel",
    ],
  },
  {
    id: "mobility-wall-run",
    title: "Wall Run & Ledge Vaulting",
    category: "Mobility",
    tab: "combat",
    subTab: "mobility",
    anchorId: "mobility-switcher",
    variantId: "wall-run",
    keywords: [
      "wall run",
      "ledge",
      "vault",
      "wall kick",
      "verticality",
      "wall",
      "space",
      "ledge grab",
    ],
  },
  {
    id: "mobility-tech-recovery",
    title: "Tech Recovery & Air Teching",
    category: "Mobility",
    tab: "combat",
    subTab: "mobility",
    anchorId: "mobility-switcher",
    variantId: "tech-recovery",
    keywords: [
      "tech",
      "recovery",
      "air tech",
      "tech roll",
      "ragdoll",
      "wake up",
      "i-frames",
      "knockback",
    ],
  },
  {
    id: "mobility-momentum-slide",
    title: "Momentum Preservation & Slide Cancel",
    category: "Mobility",
    tab: "combat",
    subTab: "mobility",
    anchorId: "mobility-switcher",
    variantId: "momentum-slide",
    keywords: [
      "momentum",
      "preservation",
      "slide",
      "slide cancel",
      "crouch",
      "sprint",
      "jump cancel",
      "speed",
    ],
  },
  {
    id: "mobility-stand-assisted",
    title: "Stand-Assisted Traversal & Gliding",
    category: "Mobility",
    tab: "combat",
    subTab: "mobility",
    anchorId: "mobility-switcher",
    variantId: "stand-assisted",
    keywords: [
      "stand assisted",
      "traversal",
      "gliding",
      "glide",
      "hover",
      "jump",
      "stand",
      "air",
    ],
  },
  {
    id: "mobility-ground-movement-breakdown",
    title: "Ground Movement & Velocity Tiers",
    category: "Mobility · Advanced Traversal",
    tab: "combat",
    subTab: "mobility",
    anchorId: "ground-movement",
    keywords: [
      "ground movement",
      "velocity tiers",
      "walk",
      "combat run",
      "sprint",
      "wasd",
      "shift",
      "ctrl",
      "stamina decay",
    ],
  },
  {
    id: "mobility-flash-step-breakdown",
    title: "Flash Step & Directional Dashes",
    category: "Mobility · Advanced Traversal",
    tab: "combat",
    subTab: "mobility",
    anchorId: "flash-step",
    keywords: [
      "flash step",
      "directional dashes",
      "burst dash",
      "q",
      "invincibility frames",
      "cancel tech",
      "flash rush",
    ],
  },
  {
    id: "mobility-wall-running-breakdown",
    title: "Verticality & Wall Running",
    category: "Mobility · Advanced Traversal",
    tab: "combat",
    subTab: "mobility",
    anchorId: "wall-running",
    keywords: [
      "verticality",
      "wall running",
      "wall run",
      "ledge snap",
      "wall kick",
      "aerial reset",
      "environment tech",
    ],
  },
  {
    id: "mobility-tech-recovery-breakdown",
    title: "Tech Recovery & Air Teching",
    category: "Mobility · Advanced Traversal",
    tab: "combat",
    subTab: "mobility",
    anchorId: "tech-recovery",
    keywords: [
      "tech recovery",
      "air teching",
      "anti pressure",
      "hard knockdown",
      "wakeup",
      "ragdoll",
      "heat cost",
    ],
  },

  // ---------------------------------------------------------------------------
  // STAND COMBAT
  // ---------------------------------------------------------------------------
  {
    id: "stand-summon",
    title: "Stand Summoning & Stance Switching",
    category: "Stand Combat",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-combat-switcher",
    variantId: "stand-summon",
    keywords: [
      "stand",
      "summon",
      "summoning",
      "stance",
      "stance switching",
      "e",
      "toggle",
      "reach",
    ],
  },
  {
    id: "stand-barrage",
    title: "Stand Barrage & Barrage Clashing",
    category: "Stand Combat",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-combat-switcher",
    variantId: "barrage-clash",
    keywords: [
      "stand",
      "barrage",
      "clash",
      "barrage clash",
      "e",
      "r",
      "multi hit",
      "stun",
    ],
  },
  {
    id: "stand-pilot",
    title: "Remote Pilot Mode & Projection",
    category: "Stand Combat",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-combat-switcher",
    variantId: "pilot-mode",
    keywords: [
      "stand",
      "remote",
      "pilot",
      "projection",
      "remote pilot",
      "long distance",
      "tether",
      "shift",
      "e",
    ],
  },
  {
    id: "stand-leap",
    title: "Stand Traversal & High Leaps",
    category: "Stand Combat",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-combat-switcher",
    variantId: "stand-leap",
    keywords: [
      "stand",
      "traversal",
      "high leap",
      "leap",
      "launch",
      "jump",
      "space",
      "shockwave",
    ],
  },
  {
    id: "stand-guard",
    title: "Sub-Stand Auto-Guard & Defenses",
    category: "Stand Combat",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-combat-switcher",
    variantId: "stand-guard",
    keywords: [
      "stand",
      "auto guard",
      "guard",
      "defense",
      "defenses",
      "f",
      "block",
      "armor",
    ],
  },
  {
    id: "stand-awakening",
    title: "Stand Awakening & Requiem Overdrive",
    category: "Stand Combat",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-combat-switcher",
    variantId: "awakening-state",
    keywords: [
      "stand",
      "awakening",
      "requiem",
      "overdrive",
      "g",
      "heat",
      "ultimate",
      "transcendence",
    ],
  },
  {
    id: "stand-on-off-breakdown",
    title: "Stand-On vs Stand-Off Modes",
    category: "Stand Combat · Deep Mechanics",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-on-off",
    keywords: [
      "stand on",
      "stand off",
      "stance system",
      "toggle stand",
      "e",
      "reach multiplier",
      "guard cap",
    ],
  },
  {
    id: "barrage-clash-breakdown",
    title: "Barrages & Clash Dynamics",
    category: "Stand Combat · Deep Mechanics",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "barrage-clash",
    keywords: [
      "barrage",
      "clash dynamics",
      "barrage system",
      "multi punch",
      "qte",
      "hit rate",
      "heat generation",
    ],
  },
  {
    id: "remote-pilot-breakdown",
    title: "Remote Pilot Mode",
    category: "Stand Combat · Deep Mechanics",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "remote-pilot",
    keywords: [
      "remote pilot",
      "long range projection",
      "detach stand",
      "scouting",
      "ambush",
      "pilot speed",
    ],
  },
  {
    id: "stand-awakening-breakdown",
    title: "Stand Awakenings & Requiem",
    category: "Stand Combat · Deep Mechanics",
    tab: "combat",
    subTab: "stand-combat",
    anchorId: "stand-awakening",
    keywords: [
      "stand awakening",
      "requiem",
      "ultimate form",
      "spectral aura",
      "barrage cooldowns",
      "global damage",
    ],
  },

  // ---------------------------------------------------------------------------
  // PROGRESSION
  // ---------------------------------------------------------------------------
  {
    id: "progression-overview",
    title: "Ascension & Growth",
    category: "Progression",
    tab: "combat",
    subTab: "progression",
    anchorId: "progression-overview",
    keywords: [
      "ascension",
      "growth",
      "progression overview",
      "build",
      "survivability",
      "damage output",
    ],
  },
  {
    id: "progression-attributes",
    title: "Core Attributes",
    category: "Progression",
    tab: "combat",
    subTab: "progression",
    anchorId: "progression-attributes",
    keywords: [
      "core attributes",
      "stats",
      "stat allocation",
      "strength",
      "scaling bonus",
    ],
  },
  {
    id: "progression-skill-tree",
    title: "Skill Tree & Node Mastery",
    category: "Progression",
    tab: "combat",
    subTab: "progression",
    anchorId: "progression-skill-tree",
    keywords: [
      "skill tree",
      "node mastery",
      "skill points",
      "unlock",
      "combat node",
      "stand node",
      "survival node",
    ],
  },
  {
    id: "progression-prestige",
    title: "Prestige Breakthrough Tiers",
    category: "Progression",
    tab: "combat",
    subTab: "progression",
    anchorId: "progression-prestige",
    keywords: [
      "prestige",
      "breakthrough tiers",
      "awakened spirit",
      "requiem bond",
      "overdrive zenith",
      "stat cap",
    ],
  },

  // ---------------------------------------------------------------------------
  // ABILITIES — STANDS (Part 3, mirrors the STANDS array in Abilities.tsx)
  // ---------------------------------------------------------------------------
  {
    id: "stand-star-platinum",
    title: "Star Platinum",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "star-platinum",
    keywords: ["star platinum", "jotaro", "part 3", "stardust crusaders", "strength", "power"],
  },
  {
    id: "stand-the-world",
    title: "The World",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "the-world",
    keywords: ["the world", "dio", "part 3", "stardust crusaders", "time stop"],
  },
  {
    id: "stand-silver-chariot",
    title: "Silver Chariot",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "silver-chariot",
    keywords: ["silver chariot", "polnareff", "part 3", "stardust crusaders", "rapier"],
  },
  {
    id: "stand-hierophant-green",
    title: "Hierophant Green",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "hierophant-green",
    keywords: ["hierophant green", "kakyoin", "part 3", "stardust crusaders", "emerald splash"],
  },
  {
    id: "stand-anubis",
    title: "Anubis",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "anubis",
    keywords: ["anubis", "polnareff", "part 3", "stardust crusaders", "sword"],
  },
  {
    id: "stand-magicians-red",
    title: "Magician's Red",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "magicians-red",
    keywords: ["magicians red", "magician's red", "avdol", "part 3", "stardust crusaders", "fire"],
  },
  {
    id: "stand-cursed-chariot",
    title: "Cursed Chariot",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "cursed-chariot",
    keywords: ["cursed chariot", "polnareff", "part 3", "stardust crusaders"],
  },
  {
    id: "stand-horus",
    title: "Horus",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "horus",
    keywords: ["horus", "part 3", "stardust crusaders"],
  },
  {
    id: "stand-hermit-purple",
    title: "Hermit Purple",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "hermit-purple",
    keywords: ["hermit purple", "joseph", "part 3", "stardust crusaders", "vines"],
  },
  {
    id: "stand-cream",
    title: "Cream",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "cream",
    keywords: ["cream", "vanilla ice", "part 3", "stardust crusaders", "void"],
  },
  {
    id: "stand-emperor-hanged-man",
    title: "Emperor + Hanged Man",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "emperor-hanged-man",
    keywords: ["emperor", "hanged man", "hol horse", "boingo", "part 3", "stardust crusaders"],
  },
  {
    id: "stand-shadow-the-world",
    title: "Shadow The World",
    category: "Abilities · Stands · Part 3",
    tab: "abilities",
    subTab: "stands",
    standId: "shadow-the-world",
    keywords: ["shadow the world", "dio", "part 3", "stardust crusaders", "time stop"],
  },
  {
    id: "stand-the-fool",
    title: "The Fool",
    category: "Abilities · Stands · Part 3 (Unconfirmed)",
    tab: "abilities",
    subTab: "stands",
    standId: "the-fool",
    keywords: ["the fool", "iggy", "part 3", "stardust crusaders", "unconfirmed"],
  },
  {
    id: "stand-justice",
    title: "Justice",
    category: "Abilities · Stands · Part 3 (Unconfirmed)",
    tab: "abilities",
    subTab: "stands",
    standId: "justice",
    keywords: ["justice", "enya", "part 3", "stardust crusaders", "unconfirmed"],
  },
  {
    id: "stand-death-13",
    title: "Death 13",
    category: "Abilities · Stands · Part 3 (Unconfirmed)",
    tab: "abilities",
    subTab: "stands",
    standId: "death-13",
    keywords: ["death 13", "death thirteen", "part 3", "stardust crusaders", "unconfirmed", "dreams"],
  },
  {
    id: "stand-tower-of-grey",
    title: "Tower of Grey",
    category: "Abilities · Stands · Part 3 (Unconfirmed)",
    tab: "abilities",
    subTab: "stands",
    standId: "tower-of-grey",
    keywords: ["tower of grey", "midler", "part 3", "stardust crusaders", "unconfirmed"],
  },
  {
    id: "stand-sun",
    title: "Sun",
    category: "Abilities · Stands · Part 3 (Unconfirmed)",
    tab: "abilities",
    subTab: "stands",
    standId: "sun",
    keywords: ["sun", "part 3", "stardust crusaders", "unconfirmed"],
  },
  {
    id: "stand-geb",
    title: "Geb",
    category: "Abilities · Stands · Part 3 (Unconfirmed)",
    tab: "abilities",
    subTab: "stands",
    standId: "geb",
    keywords: ["geb", "n'doul", "ndoul", "part 3", "stardust crusaders", "unconfirmed"],
  },

  // ---------------------------------------------------------------------------
  // ABILITIES — SPECS & WEAPONS (placeholder sections, not yet populated)
  // ---------------------------------------------------------------------------
  {
    id: "abilities-specs",
    title: "Specs",
    category: "Abilities · Specs",
    tab: "abilities",
    subTab: "specs",
    keywords: ["specs", "character specs", "base stats", "scaling", "archetype"],
  },
  {
    id: "abilities-weapons",
    title: "Weapons",
    category: "Abilities · Weapons",
    tab: "abilities",
    subTab: "weapons",
    keywords: ["weapons", "weapon registry", "melee", "ranged", "stand-augmented gear", "gear"],
  },
];

export default function SearchModal({
  isOpen,
  onClose,
  setActiveTab,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * Search across all useful information attached to each entry.
   * This makes searches such as "flash", "m2", "overdrive", "guard",
   * "mobility", etc. work even if they don't exactly match the title.
   */
  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return searchData;
    }

    return searchData.filter((item) => {
      const searchableText = [
        item.title,
        item.category,
        item.subTab,
        ...(item.keywords || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query]);

  /*
   * Search-driven navigation.
   *
   * We intentionally do not use URLs directly here. Instead we dispatch a
   * single 'navigate-tab' window event carrying { tab, subTab, anchorId }.
   *
   * page.tsx owns the top-level tab (`'homepage' | 'combat' | 'abilities' |
   * 'background'`) and already listens for this same event to move the
   * user to the right top-level page. Combat.tsx (and any other tab that
   * supports deep-linking) listens for the same event to pick the right
   * internal sub-tab/section once it mounts.
   *
   * IMPORTANT: we do NOT also call `setActiveTab` directly here. Combat's
   * internal section names (e.g. "core-mechanics") are NOT valid values
   * for page.tsx's top-level tab state (which only knows "combat"). Calling
   * setActiveTab("core-mechanics") directly — as this used to do — pushed
   * an invalid `?tab=core-mechanics` URL into browser history via
   * page.tsx's setActiveTab wrapper. It got silently overwritten by the
   * event-driven update in the same tick, so the bug was invisible until
   * the user pressed Back, which landed them on a URL matching none of
   * page.tsx's tab conditions (a blank page). Firing the event only avoids
   * that duplicate/incorrect history entry entirely.
   *
   * If the user is on Home or another tab, Combat is not mounted yet when
   * this event fires, so we also stash the payload on
   * window.__pendingSearchNav as a fallback. Combat consumes (and clears)
   * that pending payload as soon as it mounts.
   */
  const executeNavigation = (item: SearchItem) => {
    const navigationDetail = {
      tab: item.tab,
      subTab: item.subTab,
      anchorId: item.anchorId,
      variantId: item.variantId,
      standId: item.standId,
      searchId: item.id,
      searchTitle: item.title,
    };

    // Store before dispatching so the payload cannot be lost while the
    // target tab is being mounted.
    (window as any).__pendingSearchNav = navigationDetail;

    // Single source of truth for navigation: page.tsx listens for this and
    // sets the top-level tab; the target tab component (e.g. Combat)
    // listens for the same event to pick its internal section.
    window.dispatchEvent(
      new CustomEvent("navigate-tab", {
        detail: navigationDetail,
      })
    );

    onClose();

    /*
     * Give the target page a moment to render, then scroll to the section.
     * This is intentionally defensive because React state updates and
     * conditional tab/subtab rendering are asynchronous — a tab switch
     * plus a subtab switch can take more than one render pass, so a
     * single fixed-delay attempt can miss the element. Retry a few times
     * instead of trusting one timeout.
     */
    if (item.anchorId) {
      const anchorId = item.anchorId;
      let attempts = 0;
      const tryScroll = () => {
        attempts += 1;
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts < 6) {
          setTimeout(tryScroll, 150);
        }
      };
      setTimeout(tryScroll, 250);
    }
  };

  // ---------------------------------------------------------------------------
  // KEYBOARD NAVIGATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();

        if (filteredResults.length === 0) return;

        setSelectedIndex(
          (prev) => (prev + 1) % filteredResults.length
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();

        if (filteredResults.length === 0) return;

        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredResults.length) %
            filteredResults.length
        );
      } else if (
        e.key === "Enter" &&
        filteredResults.length > 0
      ) {
        e.preventDefault();
        executeNavigation(filteredResults[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    filteredResults,
    selectedIndex,
    onClose,
  ]);

  // ---------------------------------------------------------------------------
  // FOCUS INPUT WHEN OPENED
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    setQuery("");
    setSelectedIndex(0);

    return () => clearTimeout(focusTimer);
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // RESET SELECTION WHEN QUERY CHANGES
  // ---------------------------------------------------------------------------
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className="fixed top-[15%] left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] shadow-2xl"
          >
            {/* SEARCH INPUT */}
            <div className="flex items-center border-b border-white/10 px-4 py-4">
              <Search className="mr-3 h-5 w-5 text-zinc-400" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mechanics, abilities, guides..."
                className="flex-1 bg-transparent text-lg text-white placeholder-zinc-500 outline-none"
              />

              <button
                onClick={onClose}
                className="ml-3 rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/10"
              >
                esc
              </button>
            </div>

            {/* RESULTS */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredResults.length > 0 ? (
                <>
                  <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {query === ""
                      ? "Combat Mechanics"
                      : `${filteredResults.length} ${
                          filteredResults.length === 1
                            ? "Result"
                            : "Results"
                        }`}
                  </div>

                  {filteredResults.map((item, index) => (
                    <div
                      key={item.id}
                      onMouseEnter={() =>
                        setSelectedIndex(index)
                      }
                      onMouseDown={(e) => {
                        e.preventDefault();
                        executeNavigation(item);
                      }}
                      className={`group flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                        index === selectedIndex
                          ? "bg-white/10 text-white"
                          : "text-zinc-400 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText
                          className={`h-5 w-5 ${
                            index === selectedIndex
                              ? "text-white"
                              : "text-zinc-500"
                          }`}
                        />

                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>

                          <span className="text-xs text-zinc-500">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {index === selectedIndex && (
                        <ArrowRight className="h-4 w-4 text-zinc-400" />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-zinc-500">
                  No results found for "{query}"
                </div>
              )}
            </div>

            {/* KEYBOARD HELP */}
            <div className="flex items-center border-t border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/20 bg-black/20 px-1">
                  ↑
                </kbd>
                <kbd className="rounded border border-white/20 bg-black/20 px-1">
                  ↓
                </kbd>
                to navigate
              </span>

              <span className="mx-3 h-3 w-px bg-white/20" />

              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/20 bg-black/20 px-1">
                  ↵
                </kbd>
                to open
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}