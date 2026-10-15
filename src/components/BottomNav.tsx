import React from 'react';
import { motion } from 'motion/react';
import { Compass, Bookmark, Dices, SlidersHorizontal } from 'lucide-react';
import { ActiveTab } from '../types/index.ts';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeFiltersCount: number;
  myListCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeFiltersCount,
  myListCount,
}) => {
  const tabs = [
    {
      id: 'explore' as ActiveTab,
      label: 'Explorar',
      icon: Compass,
      badge: null,
    },
    {
      id: 'mylist' as ActiveTab,
      label: 'Minha Lista',
      icon: Bookmark,
      badge: myListCount > 0 ? myListCount : null,
    },
    {
      id: 'discover' as ActiveTab,
      label: 'Descobrir',
      icon: Dices,
      badge: null,
    },
    {
      id: 'filters' as ActiveTab,
      label: 'Filtros',
      icon: SlidersHorizontal,
      badge: activeFiltersCount > 0 ? activeFiltersCount : null,
    },
  ];

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md pointer-events-none"
      aria-label="Navegação principal"
    >
      <div className="pointer-events-auto bg-[#090A0F]/90 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)] rounded-3xl p-1.5 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 py-2 px-1 flex flex-col items-center justify-center rounded-2xl transition-colors duration-200 active:scale-95 focus:outline-none ${
                isActive ? 'text-white' : 'text-white/45 hover:text-white/80'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Fluid Active Highlight Pill */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-pill"
                  className="absolute inset-0 bg-white/10 rounded-2xl border border-white/10 shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  <Icon
                    strokeWidth={1.75}
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110 text-violet-400' : ''
                    }`}
                  />

                  {/* Badge indicator */}
                  {tab.badge !== null && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold tabular-nums flex items-center justify-center leading-none ${
                        tab.id === 'filters'
                          ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : 'bg-violet-600 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-semibold mt-1 tracking-tight transition-colors ${
                    isActive ? 'text-white font-bold' : 'text-white/45'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
