import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Plus, Users } from 'lucide-react';
import { Profile } from '../types/index.ts';
import { AvatarDisplay } from './AvatarDisplay.tsx';

interface TopBarProps {
  activeProfile?: Profile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSwitchProfile: () => void;
  onLogoClick?: () => void;
  onOpenAddMovie?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeProfile,
  searchQuery,
  onSearchChange,
  onSwitchProfile,
  onLogoClick,
  onOpenAddMovie,
}) => {
  const [isSearchExpandedMobile, setIsSearchExpandedMobile] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const profile: Profile = activeProfile || {
    id: 'default',
    name: 'Perfil',
    avatarUrl: '/imgs/icon.png',
    accentColor: '#8B5CF6',
    createdAt: '',
    isPinProtected: false,
    list: {},
  };

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
          /* Standard Header */
          <div key="standard-header" className="w-full flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Logo (Prominent with PRO badge) */}
            <button
              onClick={onLogoClick}
              className="flex items-center gap-1.5 sm:gap-2 text-left focus:outline-none group active:scale-95 transition-transform shrink-0"
              aria-label="Cinegobetti Início"
            >
              <img
                src="/imgs/logo.png"
                alt="Cinegobetti"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(139,92,246,0.3)] group-hover:scale-102 transition-transform duration-300"
              />
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                PRO
              </span>
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

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Add New Movie Button */}
              {onOpenAddMovie && (
                <button
                  type="button"
                  onClick={onOpenAddMovie}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-600/25 active:scale-95 transition-all"
                  title="Adicionar novo filme ou série via TMDB"
                  aria-label="Adicionar filme ou série"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden xs:inline">Novo</span>
                </button>
              )}

              {/* Mobile Search Trigger Button */}
              <button
                type="button"
                onClick={handleOpenMobileSearch}
                className="sm:hidden w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition-all"
                aria-label="Abrir busca rápida"
              >
                <Search className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>

              {/* Profile Avatar & Switcher */}
              <button
                onClick={onSwitchProfile}
                className="flex items-center gap-2 pl-2 sm:pl-2.5 pr-1.5 sm:pr-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all text-xs font-semibold text-white/90 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                title="Trocar perfil"
                aria-label={`Perfil atual: ${profile.name}. Toque para trocar`}
              >
                <span className="hidden sm:inline-block max-w-[85px] truncate text-xs text-white/80 font-medium">
                  {profile.name}
                </span>
                <motion.div
                  layoutId={`avatar-${profile.id}`}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full p-[1px] overflow-hidden shadow-md shrink-0 border border-white/20"
                  style={{ backgroundColor: profile.accentColor }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <AvatarDisplay
                      avatar={profile.avatarUrl}
                      name={profile.name}
                      className="w-full h-full rounded-full"
                    />
                  </div>
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
