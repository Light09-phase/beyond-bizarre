// app/components/MusicPlayer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface MusicPlayerProps {
  play: boolean;
}

export default function MusicPlayer({ play }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio & Web Audio API Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const requestRef = useRef<number>(null);
  const discContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the audio element
  useEffect(() => {
    const audio = new Audio('/audio/theme.mp3');
    audio.loop = true;
    audio.crossOrigin = "anonymous"; // Required for Web Audio API to process the track
    audioRef.current = audio;

    return () => {
      audio.pause();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Set up the Web Audio API to analyze the beat
  const initWebAudio = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Good resolution for beat detection

      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
    
    // Resume context if browser suspended it
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // The animation loop that runs every frame to read the music's frequencies
  const animatePulse = () => {
    if (!analyserRef.current || !discContainerRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate the average of the lower frequencies (Bass/Beat)
    let sum = 0;
    const bassRange = 10; // Focus on the first 10 frequency bins
    for (let i = 0; i < bassRange; i++) {
      sum += dataArray[i];
    }
    const average = sum / bassRange;

    // Map the frequency volume (0-255) to a scale size and glow intensity
    const scale = 1 + (average / 255) * 0.15; // Scales up to 1.15x on beat hits
    const glowOpacity = 0.4 + (average / 255) * 0.6;
    const glowSize = 10 + (average / 255) * 20;

    // Apply directly to DOM for high-performance 60fps rendering
    discContainerRef.current.style.transform = `scale(${scale})`;
    discContainerRef.current.style.boxShadow = `0 0 ${glowSize}px rgba(197,160,89, ${glowOpacity})`;

    requestRef.current = requestAnimationFrame(animatePulse);
  };

  // Start or stop the animation loop based on play state
  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animatePulse);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      // Reset visuals when stopped
      if (discContainerRef.current) {
        discContainerRef.current.style.transform = 'scale(1)';
        discContainerRef.current.style.boxShadow = 'none';
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  // Auto-play when the user clicks "Enter Game"
  useEffect(() => {
    if (play && audioRef.current) {
      initWebAudio();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Autoplay blocked by browser:", err);
      });
    }
  }, [play]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    initWebAudio();

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
      className="relative flex items-center justify-center p-1.5 focus:outline-none group"
      title={isPlaying ? "Audio: On" : "Audio: Off"}
    >
      {/* Dynamic Beat Container */}
      {/* We use duration-75 to smoothly tween between the rapidly changing frequency data */}
      <div 
        ref={discContainerRef}
        className="relative flex items-center justify-center rounded-full transition-all duration-75 ease-out"
      >
        {isPlaying ? (
          // Active state: Spinning Vinyl
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border-2 border-[#c5a059] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] animate-[spin_6s_linear_infinite]">
            {/* Vinyl Grooves */}
            <div className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800">
              {/* Record Label */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#c5a059] flex items-center justify-center border border-black/30">
                {/* Spindle hole */}
                <div className="w-1 h-1 rounded-full bg-black" />
              </div>
            </div>
          </div>
        ) : (
          // Off state: Stopped Vinyl Disc with red line
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-500 shadow-inner relative overflow-hidden">
            {/* Vinyl Grooves */}
            <div className="w-7 h-7 rounded-full border border-zinc-600 flex items-center justify-center opacity-70 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800">
              {/* Record Label */}
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-600 flex items-center justify-center border border-zinc-700">
                {/* Spindle hole */}
                <div className="w-1 h-1 rounded-full bg-black" />
              </div>
            </div>
            {/* Red slash */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-red-600 rotate-45 absolute rounded-full shadow-sm" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}