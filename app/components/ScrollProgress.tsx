"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let ticking = false;
    let frameId: number;

    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const currentProgress =
        scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, currentProgress)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        frameId = requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isVisible = progress > 0;

  return (
    <div
      className={`fixed right-7 top-1/2 z-[100] -translate-y-1/2 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* PERCENTAGE PILL (Above the bar) */}
      <div
        className={`
          absolute -top-14 left-1/2 -translate-x-1/2
          transition-all duration-300
          ${
            hovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }
        `}
      >
        <div
          className={`
            flex h-8 w-[52px] items-center justify-center
            rounded-md border bg-[#050505]/90 backdrop-blur-sm
            font-mono text-[11px] font-bold tracking-[0.1em] text-[#d5b76a]
            transition-all duration-300
            ${
              progress >= 99
                ? "animate-bounce border-[#b89450] shadow-[0_0_15px_rgba(184,148,80,0.8)]"
                : "border-[#b89450]/40 shadow-none"
            }
          `}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* MAIN HEXAGON BAR */}
      <div
        className={`
          relative flex h-[260px] items-center justify-center
          transition-[width,filter] duration-300 ease-out
          ${
            hovered
              ? "w-[46px] drop-shadow-[0_0_15px_rgba(184,148,80,0.2)]"
              : "w-[24px] drop-shadow-none"
          }
        `}
      >
        {/* Hexagon Border Layer */}
        <div
          className={`
            absolute inset-0 w-full h-full
            [clip-path:polygon(50%_0%,100%_15px,100%_calc(100%-15px),50%_100%,0%_calc(100%-15px),0%_15px)]
            transition-[background-color,padding] duration-300
            ${hovered ? "bg-[#b89450]/40 p-[1px]" : "bg-transparent p-0"}
          `}
        >
          {/* Hexagon Inner Background */}
          <div
            className={`
              h-full w-full
              [clip-path:polygon(50%_0%,100%_15px,100%_calc(100%-15px),50%_100%,0%_calc(100%-15px),0%_15px)]
              transition-colors duration-300
              ${hovered ? "bg-[#050505]/90 backdrop-blur-sm" : "bg-transparent"}
            `}
          />
        </div>

        {/* BACKGROUND TRACK */}
        <div
          className={`
            absolute bottom-[35px] top-[25px]
            transition-[width] duration-300
            ${hovered ? "w-[2px]" : "w-px"}
          `}
          style={{
            background:
              "linear-gradient(to bottom, rgba(184,148,80,0.08), rgba(184,148,80,0.35), rgba(184,148,80,0.08))",
          }}
        />

        {/* TRACK NOTCHES */}
        {[20, 40, 60, 80].map((percent) => (
          <div
            key={percent}
            className={`
              absolute h-[1px] bg-[#b89450]/40
              transition-[width] duration-300
              ${hovered ? "w-[10px]" : "w-[4px]"}
            `}
            style={{
              top: `${25 + (percent / 100) * 200}px`,
            }}
          />
        ))}

        {/* GOLD PROGRESS FILL */}
        <div
          className={`
            absolute top-[25px]
            transition-[width,box-shadow] duration-300
            ${hovered ? "w-[3px]" : "w-[2px]"}
          `}
          style={{
            height: `${(progress / 100) * 200}px`,
            background: "#b89450",
            boxShadow: hovered
              ? "0 0 7px rgba(184,148,80,0.95), 0 0 18px rgba(184,148,80,0.4)"
              : "0 0 5px rgba(184,148,80,0.5)",
          }}
        />

        {/* PROGRESS DOT */}
        <div
          className={`
            absolute -translate-y-1/2
            transition-[filter] duration-300
            ${
              hovered
                ? "drop-shadow-[0_0_6px_rgba(184,148,80,0.8)]"
                : "drop-shadow-[0_0_3px_rgba(184,148,80,0.5)]"
            }
          `}
          style={{ top: `${25 + (progress / 100) * 200}px` }}
        >
          {/* Inner Hexagon for hollow dot */}
          <div
            className={`
              flex items-center justify-center
              bg-[#d5b76a] p-[1px]
              transition-[height,width] duration-300
              [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]
              ${hovered ? "h-[12px] w-[12px]" : "h-[8px] w-[8px]"}
            `}
          >
            <div className="h-full w-full bg-[#050505] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
          </div>
        </div>

        {/* TOP DECORATION */}
        <div
          className={`
            absolute top-[10px]
            h-[2px] w-[2px]
            rounded-full
            bg-[#b89450]
            transition-shadow duration-300
            ${hovered ? "shadow-[0_0_8px_#b89450]" : ""}
          `}
        />

        {/* BOTTOM ARROW / CHECKMARK */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`
            absolute bottom-[8px]
            flex h-[24px] w-[24px]
            items-center justify-center
            transition-all duration-300
          `}
        >
          <span
            className={`
              block text-[#b89450]
              transition-all duration-300 ease-out
              ${
                hovered
                  ? "translate-y-[-4px] scale-[1.35] text-[#d5b76a] drop-shadow-[0_0_7px_rgba(184,148,80,0.8)]"
                  : "translate-y-0 scale-100"
              }
              ${progress >= 99 ? "text-[16px] font-bold" : "text-[14px]"}
            `}
          >
            {progress >= 99 ? "✓" : "↓"}
          </span>
        </button>
      </div>
    </div>
  );
}