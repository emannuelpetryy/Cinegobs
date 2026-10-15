import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Star,
  Play,
  Bookmark,
  CheckCircle2,
  Flame,
  Film,
  Tv,
  Baby,
  LayoutGrid,
  Rows3,
  Plus,
} from 'lucide-react';
import { Movie, FilterState, UserMovieData } from '../types/index.ts';
import { MovieCard } from './MovieCard.tsx';
import { formatRuntime } from '../utils/movieLogic.ts';

interface ExploreViewProps {
  movies: Movie[];
  filters: FilterState;
  onOpenMovie: (movie: Movie) => void;
  onOpenFilterDrawer: () => void;
  onQuickGenreSelect: (genre: string) => void;
  userList: Record<string, UserMovieData>;
  onToggleWatchlist: (movieId: string) => void;
  onOpenAddMovie?: () => void;
}

const QUICK_CATEGORIES = [
  'Todos',
  'Em Alta',
  'Filmes',
  'Séries',
  'Kids',
  'Ficção Científica',
  'Drama',
  'Ação',
  'Animação',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  movies,
  filters,
  onOpenMovie,
  onOpenFilterDrawer,
  onQuickGenreSelect,
  userList,
  onToggleWatchlist,
  onOpenAddMovie,
}) => {
  const [layoutMode, setLayoutMode] = useState<'carousels' | 'grid'>('carousels');

  // Find a featured movie
  const featuredMovie = movies.find((m) => m.featured) || movies[0];
  const isFeaturedInList = featuredMovie
    ? userList[featuredMovie.id]?.status === 'watchlist'
    : false;

  // Carousels segmentation
  const trendingMovies = movies.filter((m) => m.category === 'trending' || m.featured || m.rating >= 8.7);
  const featureFilms = movies.filter((m) => m.mediaType === 'movie' && m.category !== 'kids');
  const seriesList = movies.filter((m) => m.mediaType === 'series');
  const kidsList = movies.filter((m) => m.category === 'kids' || m.genres.includes('Animação') || m.genres.includes('Família'));

  // If search query is present, force grid layout for immediate visual clarity
  const isSearching = !!filters.query?.trim();
  const effectiveLayout = isSearching ? 'grid' : layoutMode;

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-3 sm:py-6" data-testid="explore-view">
      {/* Hero Featured Backdrop Card (Only shown when not actively searching) */}
      {!isSearching && featuredMovie && (
        <div className="relative w-full rounded-3xl overflow-hidden mb-5 sm:mb-8 border border-white/10 shadow-2xl bg-[#12151E]">
          {/* Backdrop Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-[#0E1017]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E1017]/80 via-transparent to-transparent hidden sm:block" />
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-7 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500 text-black tracking-wider shadow-sm">
                Destaque da Semana
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-300" strokeWidth={1.75} />
                {(featuredMovie.letterboxdRating ?? featuredMovie.rating ?? 8.5).toFixed(1)} Letterboxd
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/70 font-medium">
                {featuredMovie.year} · {formatRuntime(featuredMovie.runtimeMinutes)}
              </span>
            </div>

            <h2 className="text-lg sm:text-3xl font-extrabold text-white tracking-tight leading-tight max-w-xl">
              {featuredMovie.title}
            </h2>

            <p className="text-xs sm:text-sm text-white/75 mt-1 line-clamp-2 max-w-xl leading-relaxed hidden sm:block">
              {featuredMovie.synopsis}
            </p>

            {/* Hero Actions (Guaranteed single line on mobile with whitespace-nowrap) */}
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto scrollbar-none pb-0.5">
              <button
                type="button"
                onClick={() => onOpenMovie(featuredMovie)}
                className="whitespace-nowrap shrink-0 py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-2xl bg-white text-black font-extrabold text-xs flex items-center gap-1.5 sm:gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-black" strokeWidth={1.75} />
                <span>Ver Ficha Técnica</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWatchlist(featuredMovie.id)}
                className={`whitespace-nowrap shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 rounded-2xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 border transition-all active:scale-95 ${
                  isFeaturedInList
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-black/50 hover:bg-black/70 text-white border-white/20 backdrop-blur-md'
                }`}
              >
                {isFeaturedInList ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
                    <span>Na Lista</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Salvar na Lista</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Filter Horizontal Chips and Layout Mode Toggle */}
      <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
          {QUICK_CATEGORIES.map((cat) => {
            const isSelected =
              cat === 'Todos'
                ? filters.genres.length === 0 && filters.mediaType === 'all'
                : cat === 'Filmes'
                ? filters.mediaType === 'movie'
                : cat === 'Séries'
                ? filters.mediaType === 'series'
                : filters.genres.includes(cat);

            return (
              <button
                key={cat}
                onClick={() => onQuickGenreSelect(cat)}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                    : 'bg-white/5 text-white/60 hover:text-white border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Layout Toggle & Filter Sheet Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isSearching && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center">
              <button
                type="button"
                onClick={() => setLayoutMode('carousels')}
                className={`p-1.5 rounded-xl transition-all ${
                  layoutMode === 'carousels'
                    ? 'bg-white/15 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
                title="Modo Carrosséis Cinevault"
                aria-label="Carrosséis temáticos"
              >
                <Rows3 className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-xl transition-all ${
                  layoutMode === 'grid'
                    ? 'bg-white/15 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
                title="Modo Grade Completa"
                aria-label="Grade completa"
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          )}

          <button
            onClick={onOpenFilterDrawer}
            className="p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white active:scale-95 transition-all"
            title="Abrir todos os filtros"
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Content Rendering: Thematic Carousels (Cinevault Style) or Full Grid */}
      {effectiveLayout === 'carousels' ? (
        <div className="space-y-7 sm:space-y-8">
          {/* Section 1: Em Alta & Tendências */}
          {trendingMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    Em Alta & Tendências
                  </h3>
                </div>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Ver Todos
                </button>
              </div>

              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
                {trendingMovies.map((movie) => (
                  <div key={movie.id} className="w-32 sm:w-44 shrink-0 snap-start">
                    <MovieCard
                      movie={movie}
                      userData={userList[movie.id]}
                      onClick={() => onOpenMovie(movie)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Filmes Aclamados */}
          {featureFilms.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center">
                    <Film className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    Filmes Aclamados
                  </h3>
                </div>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Ver Todos
                </button>
              </div>

              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
                {featureFilms.map((movie) => (
                  <div key={movie.id} className="w-32 sm:w-44 shrink-0 snap-start">
                    <MovieCard
                      movie={movie}
                      userData={userList[movie.id]}
                      onClick={() => onOpenMovie(movie)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Séries Imperdíveis */}
          {seriesList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <Tv className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    Séries Imperdíveis
                  </h3>
                </div>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Ver Todos
                </button>
              </div>

              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
                {seriesList.map((movie) => (
                  <div key={movie.id} className="w-32 sm:w-44 shrink-0 snap-start">
                    <MovieCard
                      movie={movie}
                      userData={userList[movie.id]}
                      onClick={() => onOpenMovie(movie)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Kids & Animação em Família */}
          {kidsList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Baby className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    Kids & Animação em Família
                  </h3>
                </div>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Ver Todos
                </button>
              </div>

              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
                {kidsList.map((movie) => (
                  <div key={movie.id} className="w-32 sm:w-44 shrink-0 snap-start">
                    <MovieCard
                      movie={movie}
                      userData={userList[movie.id]}
                      onClick={() => onOpenMovie(movie)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Full Grid Layout */
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Catálogo Completo</span>
              <span className="text-xs text-white/40 font-normal tabular-nums">
                ({movies.length} {movies.length === 1 ? 'título' : 'títulos'})
              </span>
            </h3>
            {filters.query && (
              <span className="text-xs text-violet-400 font-medium truncate max-w-[200px]">
                Resultado para &quot;{filters.query}&quot;
              </span>
            )}
          </div>

          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
              {movies.map((movie) => (
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
              <p className="text-sm text-white/70 font-semibold mb-1">
                Nenhum filme ou série encontrado com esses filtros.
              </p>
              <p className="text-xs text-white/40 mb-4">
                Experimente limpar a busca ou adicione a obra diretamente pelo TMDB.
              </p>
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                <button
                  onClick={onOpenFilterDrawer}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
                >
                  Ajustar Filtros
                </button>
                {onOpenAddMovie && (
                  <button
                    onClick={onOpenAddMovie}
                    className="px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/30 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Buscar no TMDB</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
