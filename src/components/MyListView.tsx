import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  Heart,
  Bookmark,
  Clock,
  Star,
  Film,
  PlusCircle,
  Search
} from 'lucide-react';
import { Movie, Profile, WatchStatus } from '../types/index.ts';
import { MovieCard } from './MovieCard.tsx';
import { AvatarDisplay } from './AvatarDisplay.tsx';
import { calculateProfileStats } from '../utils/movieLogic.ts';

interface MyListViewProps {
  profile: Profile;
  movies: Movie[];
  onOpenMovie: (movie: Movie) => void;
  onExploreClick: () => void;
}

type ListSubTab = 'watching' | 'completed' | 'favorites' | 'watchlist';

export const MyListView: React.FC<MyListViewProps> = ({
  profile,
  movies,
  onOpenMovie,
  onExploreClick,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ListSubTab>('watching');
  const [localQuery, setLocalQuery] = useState<string>('');

  const stats = calculateProfileStats(movies, profile.list || {});
  const userList = profile.list || {};

  // Filter movies belonging to current sub-tab
  const listMovies = movies.filter((movie) => {
    const entry = userList[movie.id];
    if (!entry) return false;

    if (activeSubTab === 'favorites') {
      return entry.isFavorite || entry.status === 'favorite';
    }
    return entry.status === activeSubTab;
  });

  // Filter by local search query if typed
  const filteredList = listMovies.filter((movie) => {
    if (!localQuery.trim()) return true;
    const q = localQuery.toLowerCase();
    return (
      movie.title.toLowerCase().includes(q) ||
      movie.director.toLowerCase().includes(q) ||
      movie.genres.some((g) => g.toLowerCase().includes(q))
    );
  });

  const subTabs = [
    {
      id: 'watching' as ListSubTab,
      label: 'Em Andamento',
      count: stats.watchingCount,
      icon: PlayCircle,
    },
    {
      id: 'completed' as ListSubTab,
      label: 'Concluídos',
      count: stats.completedCount,
      icon: CheckCircle2,
    },
    {
      id: 'favorites' as ListSubTab,
      label: 'Favoritos',
      count: stats.favoriteCount,
      icon: Heart,
    },
    {
      id: 'watchlist' as ListSubTab,
      label: 'Quero Ver',
      count: stats.watchlistCount,
      icon: Bookmark,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6" data-testid="my-list-view">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#11141E] via-[#141724] to-[#121420] border border-white/10 p-4 sm:p-7 mb-6 shadow-xl">
        <div
          className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: profile.accentColor }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left relative z-10">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 shrink-0 shadow-lg"
            style={{ backgroundColor: `${profile.accentColor}30` }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden border border-white/20">
              <AvatarDisplay
                avatar={profile.avatarUrl}
                name={profile.name}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Lista de {profile.name}
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Acervo pessoal de cinema • Avaliações sincronizadas
            </p>

            {/* Profile Metrics Grid (Tabular Numbers) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-4">
              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="text-[10px] font-semibold text-white/50 block uppercase tracking-wider">
                  Assistidos
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white tabular-nums">
                  {stats.completedCount} filmes
                </span>
              </div>

              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="text-[10px] font-semibold text-white/50 block uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Clock className="w-3 h-3 text-amber-400" strokeWidth={1.75} />
                  <span>Tempo em Tela</span>
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white tabular-nums">
                  {stats.hoursWatched}h
                </span>
              </div>

              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="text-[10px] font-semibold text-white/50 block uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" strokeWidth={1.75} />
                  <span>Média Pessoal</span>
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white tabular-nums">
                  {stats.averageRating}
                </span>
              </div>

              <div className="bg-white/5 rounded-2xl p-2.5 sm:p-3 border border-white/5">
                <span className="text-[10px] font-semibold text-white/50 block uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Heart className="w-3 h-3 text-red-400 fill-red-400" strokeWidth={1.75} />
                  <span>Favoritos</span>
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white tabular-nums">
                  {stats.favoriteCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented SubTabs Controller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-2xl text-xs font-semibold shrink-0 transition-all active:scale-95 border ${
                isActive
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/25'
                  : 'bg-white/5 text-white/60 hover:text-white border-white/5 hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search within My List */}
      {listMovies.length > 3 && (
        <div className="relative mb-6">
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder={`Filtrar em ${subTabs.find((s) => s.id === activeSubTab)?.label}...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" strokeWidth={1.75} />
        </div>
      )}

      {/* Movies Grid or Empty State */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {filteredList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              userData={userList[movie.id]}
              onClick={() => onOpenMovie(movie)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-white/40">
            <Film className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Nenhum título em &quot;{subTabs.find((s) => s.id === activeSubTab)?.label}&quot;
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto mb-5">
            Adicione filmes e séries explorando o catálogo ou usando o recomendador inteligente.
          </p>
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" strokeWidth={1.75} />
            <span>Explorar Filmes & Séries</span>
          </button>
        </div>
      )}
    </div>
  );
};
