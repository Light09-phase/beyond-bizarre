// app/components/MusicPlayer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface MusicPlayerProps {
  play: boolean;
}

export default function MusicPlayer({ play }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Corrected path pointing directly to public/audio/theme.mp3
    audioRef.current = new Audio('/audio/theme.mp3');
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Auto-play when the user clicks "Enter Game"
  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Autoplay blocked by browser:", err);
      });
    }
  }, [play]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Play failed:", err);
      });
    }
  };

  return (
    <button 
      onClick={toggleMusic}
      className="relative flex items-center justify-center p-1.5 transition-transform hover:scale-110 focus:outline-none group"
      title={isPlaying ? "Audio: On" : "Audio: Off"}
    >
      {/* Container with Green Pulsating Glow when Active */}
      <div className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
        isPlaying ? 'shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse' : ''
      }`}>
        {isPlaying ? (
          // Active state: Clear music note coin that turns green and beats
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 flex items-center justify-center border-2 border-green-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]">
            <span className="text-xl">🎵</span>
          </div>
        ) : (
          // Off state: Silver coin with red ban symbol
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 flex items-center justify-center border-2 border-zinc-500 shadow-inner relative overflow-hidden">
            <span className="text-xl opacity-70">🎵</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-red-600 rotate-45 absolute rounded-full shadow-sm" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}