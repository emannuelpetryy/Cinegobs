import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Film, Users } from 'lucide-react';
import { Profile } from '../types/index.ts';

interface TopBarProps {
  activeProfile: Profile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSwitchProfile: () => void;
  onLogoClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeProfile,
  searchQuery,
  onSearchChange,
  onSwitchProfile,
  onLogoClick,
}) => {
  const [isSearchExpandedMobile, setIsSearchExpandedMobile] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleOpenMobileSearch = () => {
    setIsSearchExpandedMobile(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 80);
  };

  const handleCloseMobileSearch = () => {
    onSearchChange('');
    setIsSearchExpandedMobile(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full px-3.5 sm:px-6 bg-[#090A0F]/90 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between transition-all">
      <AnimatePresence mode="wait">
        {isSearchExpandedMobile ? (
          /* Mobile Full-Width Search Input Bar */
          <motion.div
            key="mobile-search-bar"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="w-full flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-violet-400 absolute left-3.5 pointer-events-none" strokeWidth={1.75} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar filmes, séries, atores..."
                className="w-full bg-white/10 text-white placeholder-white/40 text-xs font-medium rounded-full py-2.5 pl-9 pr-9 border border-violet-500/50 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 p-1 rounded-full text-white/50 hover:text-white"
                  aria-label="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCloseMobileSearch}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 px-2 py-2 shrink-0 active:scale-95 transition-transform"
            >
              Cancelar
            </button>
          </motion.div>
        ) : (
          /* Standard Header: Uncrowded on mobile, expansive on desktop */
          <div key="standard-header" className="w-full flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Logo & Title (Apple calibrated) */}
            <button
              onClick={onLogoClick}
              className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group active:scale-95 transition-transform shrink-0"
              aria-label="Cinegobetti Início"
            >
              <div className="h-10 sm:h-[46px] md:h-[50px] aspect-square rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-amber-500 p-[1.5px] shadow-lg shadow-violet-600/20">
                <div className="w-full h-full bg-[#0D0F17] rounded-[14px] flex items-center justify-center text-amber-400">
                  <Film className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-lg font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    Cinegobetti
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-white/40 font-medium tracking-tight -mt-0.5 hidden xs:inline">
                  Cinema Particular
                </span>
              </div>
            </button>

            {/* Middle: Desktop Search Bar (Hidden on Mobile) */}
            <div className="hidden sm:flex items-center max-w-xs md:max-w-sm flex-1 mx-2">
              <div className="relative w-full flex items-center">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 pointer-events-none" strokeWidth={1.75} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar títulos, diretores, elenco..."
                  className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-white/35 text-xs font-medium rounded-full py-2 pl-9 pr-8 border border-white/10 focus:border-violet-500/60 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 p-0.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    aria-label="Limpar busca"
                  >
                    <X className="w-3 h-3" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Actions (Search button on mobile + Profile Chip) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile Search Trigger Button */}
              <button
                type="button"
                onClick={handleOpenMobileSearch}
                className="sm:hidden w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition-all"
                aria-label="Abrir busca rápida"
              >
                <Search className="w-4 h-4" strokeWidth={1.75} />
              </button>

              {/* Profile Avatar & Switcher with Hero Flight motion layoutId */}
              <button
                onClick={onSwitchProfile}
                className="flex items-center gap-2 pl-2 sm:pl-2.5 pr-1.5 sm:pr-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all text-xs font-semibold text-white/90 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                title="Trocar perfil"
                aria-label={`Perfil atual: ${activeProfile.name}. Toque para trocar`}
              >
                <span className="hidden sm:inline-block max-w-[85px] truncate text-xs text-white/80 font-medium">
                  {activeProfile.name}
                </span>
                <motion.div
                  layoutId={`avatar-${activeProfile.id}`}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full p-[1px] overflow-hidden shadow-md shrink-0 border border-white/20"
                  style={{ backgroundColor: activeProfile.accentColor }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                >
                  <img
                    src={activeProfile.avatarUrl}
                    alt={activeProfile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </motion.div>
                <Users className="w-3.5 h-3.5 text-white/40 sm:hidden" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
