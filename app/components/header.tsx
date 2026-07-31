// app/components/header.tsx
'use client';

import MusicPlayer from '@/app/components/MusicPlayer';

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
  playMusic: boolean;
}

export default function Header({ setActiveTab, activeTab, playMusic }: HeaderProps) {
  const navItems = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'combat', label: 'Mechanics' },
    { id: 'videos', label: 'Videos' },
    { id: 'news', label: 'News & Info' },
    { id: 'background', label: 'Background' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-3 bg-black/90 backdrop-blur-md text-white border-b border-white/10">
      {/* Logo Area - h-18 applied with overflow management so it doesn't stretch the bar */}
      <div className="cursor-pointer flex items-center h-full relative" onClick={() => setActiveTab('homepage')}>
        <img 
          src="/logo.png" 
          alt="Beyond Bizarre Logo" 
          className="h-[4.5rem] w-auto object-contain hover:opacity-80 transition-opacity drop-shadow-md"
        />
      </div>
      
      {/* Center Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`font-serif italic text-lg transition-colors duration-300 relative ${
              activeTab === item.id ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {item.label}
            {activeTab === item.id && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
            )}
          </button>
        ))}
        
        <button className="font-serif italic text-lg text-zinc-400 hover:text-white transition-colors">
          More +
        </button>
      </nav>

      {/* Right Side Action Controls */}
      <div className="flex items-center gap-6">
        
        {/* MUSIC TOGGLE */}
        <MusicPlayer play={playMusic} />

        {/* PLAY NOW BUTTON */}
        <button className="bg-[#c5a059] text-black px-10 py-3 text-lg skew-x-[-15deg] hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(197,160,89,0.6)] hover:shadow-[0_0_35px_rgba(255,255,255,0.8)] scale-105">
          <span className="block skew-x-[15deg] font-serif italic font-extrabold tracking-wider">PLAY NOW</span>
        </button>

        {/* Icons */}
        <div className="flex gap-4 text-xl">
          <button className="text-[#00a2ff] hover:text-[#c5a059] transition-colors">🌐</button>
          <button className="text-[#6a4c9c] hover:text-[#c5a059] transition-colors">👤</button>
        </div>
      </div>
    </header>
  );
}