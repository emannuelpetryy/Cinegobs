import React from 'react';
import {
  X,
  Check,
  RotateCcw,
  Sparkles,
  Star,
  Film,
  Calendar,
  ArrowDownAZ,
  Clock,
} from 'lucide-react';
import { FilterState, STREAMING_PLATFORMS, StreamingPlatformId } from '../types/index.ts';
import { GENRE_LIST } from '../data/movies.ts';
import { getActiveFilterCount } from '../utils/movieLogic.ts';
import { StreamingIcon } from './StreamingIcons.tsx';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (filters: FilterState) => void;
  totalResultsCount: number;
}

const SORT_OPTIONS = [
  { id: 'rating', label: 'Melhor Avaliados', icon: Star },
  { id: 'letterboxd', label: 'Favoritos Letterboxd', icon: Film },
  { id: 'year', label: 'Ano de Lançamento', icon: Calendar },
  { id: 'title', label: 'Título (A-Z)', icon: ArrowDownAZ },
  { id: 'runtime', label: 'Duração Mais Longa', icon: Clock },
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  totalResultsCount,
}) => {
  if (!isOpen) return null;

  const activeCount = getActiveFilterCount(filters);

  const toggleStreaming = (id: StreamingPlatformId) => {
    const isSelected = filters.streamings.includes(id);
    const updated = isSelected
      ? filters.streamings.filter((s) => s !== id)
      : [...filters.streamings, id];

    onUpdateFilters({
      ...filters,
      streamings: updated,
    });
  };

  const toggleGenre = (genre: string) => {
    const isSelected = filters.genres.includes(genre);
    const updated = isSelected
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];

    onUpdateFilters({
      ...filters,
      genres: updated,
    });
  };

  const handleReset = () => {
    onUpdateFilters({
      query: '',
      genres: [],
      streamings: [],
      mediaType: 'all',
      sortBy: 'rating',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0E1017] border-t border-white/10 rounded-t-[32px] p-6 shadow-2xl max-h-[85vh] overflow-y-auto transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 id="filter-drawer-title" className="text-lg font-bold text-white">
              Filtros Cinematográficos
            </h2>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold tabular-nums">
                {activeCount} ativos
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-white/50 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Limpar todos os filtros"
              >
                <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
                <span>Limpar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fechar gaveta de filtros"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Section: Media Type */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5">
            Formato
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'movie', label: 'Filmes' },
              { id: 'series', label: 'Séries' },
            ].map((type) => {
              const isSelected = filters.mediaType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() =>
                    onUpdateFilters({
                      ...filters,
                      mediaType: type.id as FilterState['mediaType'],
                    })
                  }
                  className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30'
                      : 'bg-white/5 text-white/70 hover:text-white border-white/5 hover:bg-white/10'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Streaming Platforms with official SVG icons */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5">
            Onde Assistir (Streaming no Brasil)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {STREAMING_PLATFORMS.map((platform) => {
              const isSelected = filters.streamings.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => toggleStreaming(platform.id)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all border ${
                    isSelected
                      ? 'bg-violet-600/30 text-white border-violet-500/80 shadow-sm'
                      : 'bg-white/5 text-white/70 hover:text-white border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                      <StreamingIcon platform={platform.id} size={15} />
                    </div>
                    <span className="truncate">{platform.name}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-violet-600 border-violet-400 text-white'
                        : 'border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" strokeWidth={1.75} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Genres */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5">
            Gêneros
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRE_LIST.map((genre) => {
              const isSelected = filters.genres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/5 hover:bg-white/10'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Sort By (Pure Lucide Icons with strokeWidth 1.75, zero emojis) */}
        <div className="mb-6 pb-4">
          <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5">
            Ordenar Por
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SORT_OPTIONS.map((sort) => {
              const isSelected = filters.sortBy === sort.id;
              const SortIcon = sort.icon;
              return (
                <button
                  key={sort.id}
                  onClick={() =>
                    onUpdateFilters({
                      ...filters,
                      sortBy: sort.id as FilterState['sortBy'],
                    })
                  }
                  className={`py-2 px-3 rounded-2xl text-xs font-medium text-left flex items-center justify-between transition-all border ${
                    isSelected
                      ? 'bg-violet-600/30 text-violet-200 border-violet-500/60 shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <SortIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-violet-300' : 'text-white/40'}`} strokeWidth={1.75} />
                    <span className="truncate">{sort.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0 ml-1.5" strokeWidth={1.75} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-[#0E1017]/95 backdrop-blur-md pt-3 pb-2 -mx-6 px-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
            <span>Ver {totalResultsCount} {totalResultsCount === 1 ? 'Título' : 'Títulos'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
