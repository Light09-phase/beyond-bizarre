'use client';

import { useState, useEffect } from 'react';
import MusicPlayer from '@/app/components/MusicPlayer';
import SearchModal from './SearchModal'; // Adjust path if necessary

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
  playMusic: boolean;
}

export default function Header({ setActiveTab, activeTab, playMusic }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  // State for the Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // State to track if the user is logged in (Defaults to false/logged out)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage on mount to see if they previously logged in
  useEffect(() => {
    const storedStatus = localStorage.getItem('isLoggedIn');
    if (storedStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Global keyboard shortcut to open the search modal (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Temporary function to toggle login state for testing
  const toggleLogin = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    localStorage.setItem('isLoggedIn', String(newState));
  };

  const navItems = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'combat', label: 'Mechanics' },
    { id: 'abilities', label: 'Abilities' },
    { id: 'news', label: 'News & Updates' },
    { id: 'background', label: 'Background' },
    { id: 'developers', label: 'Developers' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        
        <div className="flex items-center justify-between px-6 py-1.5 bg-black/90 backdrop-blur-md text-white border-b border-white/10 shadow-lg relative">
          
          {/* Logo Area */}
          <a 
            href="https://www.roblox.com/communities/35035550/PHASE-ZER0-Interactive"
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center h-full relative"
          >
            <img 
              src="/logo.png" 
              alt="Beyond Bizarre Logo" 
              className="h-12 w-auto object-contain hover:opacity-80 transition-opacity drop-shadow-md"
            />
          </a>
          
          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-serif italic text-sm transition-colors duration-300 relative ${
                  activeTab === item.id ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Side Action Controls */}
          <div className="flex items-center gap-3 lg:gap-5">
            
            {/* Search Bar Feature */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Search</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] ml-2 group-hover:bg-white/20 transition-colors">⌘ / CTRL + K</span>
            </button>

            <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block"></div>

            {/* MUSIC TOGGLE */}
            <MusicPlayer play={playMusic} />

            {/* DYNAMIC AUTHENTICATION SECTION */}
            {isLoggedIn ? (
              // LOGGED IN VIEW
              <div className="flex items-center gap-4 ml-1">
                {/* Messages */}
                <button className="text-zinc-400 hover:text-[#c5a059] transition-colors relative" aria-label="Messages">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                {/* Friends */}
                <button className="text-zinc-400 hover:text-[#c5a059] transition-colors relative" aria-label="Friends">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </button>
                {/* Notifications */}
                <button className="text-zinc-400 hover:text-[#c5a059] transition-colors relative" aria-label="Notifications">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#c5a059] rounded-full border border-black"></span>
                </button>
                
                {/* User Profile Avatar (Clicking logs you out for testing) */}
                <button 
                  onClick={toggleLogin}
                  className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 hover:border-[#c5a059] transition-colors overflow-hidden ml-1 flex-shrink-0"
                  title="Click to sign out"
                >
                  <img 
                    src="/api/placeholder/32/32" 
                    alt="User Avatar" 
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            ) : (
              // LOGGED OUT VIEW
              <button 
                onClick={toggleLogin}
                className="text-sm font-serif italic text-zinc-400 hover:text-white transition-colors ml-2 mr-1"
              >
                Sign In
              </button>
            )}

            {/* PLAY NOW BUTTON */}
            <a 
              href="https://www.roblox.com/communities/252652943/Beyond-Bizarre-Official#!/about"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#c5a059] text-black px-4 py-1 text-sm skew-x-[-15deg] hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.5)] hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] scale-105 cursor-pointer text-center ml-2 hidden sm:block"
            >
              <span className="block skew-x-[15deg] font-serif italic font-extrabold tracking-wider">PLAY NOW</span>
            </a>
          </div>
        </div>

        {/* The Pull Tab Button */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border-b border-x border-white/10 px-6 py-1 rounded-b-lg text-[10px] font-mono tracking-[0.2em] text-zinc-400 hover:text-white transition-colors flex items-center justify-center shadow-lg"
        >
          {isVisible ? '▲ HIDE' : '▼ MENU'}
        </button>
        
      </header>

      {/* Inject the Search Modal here */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}