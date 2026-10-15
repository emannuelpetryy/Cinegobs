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
  Trophy,
  Rocket,
  Compass,
  ShieldAlert,
  HeartHandshake,
  Clapperboard,
  Laugh,
  Ghost,
  RotateCcw,
} from 'lucide-react';
import { Movie, FilterState, UserMovieData } from '../types/index.ts';
import { MovieCard } from './MovieCard.tsx';
import { formatRuntime, getActiveFilterCount } from '../utils/movieLogic.ts';

interface ExploreViewProps {
  movies: Movie[];
  filters: FilterState;
  onOpenMovie: (movie: Movie) => void;
  onOpenFilterDrawer: () => void;
  onQuickGenreSelect: (genre: string) => void;
  userList: Record<string, UserMovieData>;
  onToggleWatchlist: (movieId: string) => void;
  onOpenAddMovie?: () => void;
  onResetFilters?: () => void;
}

const QUICK_CATEGORIES = [
  'Todos',
  'Em Alta',
  'Filmes',
  'Séries',
  'Ficção Científica',
  'Suspense',
  'Crime',
  'Drama',
  'Ação',
  'Comédia',
  'Terror',
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
  onResetFilters,
}) => {
  const [layoutMode, setLayoutMode] = useState<'carousels' | 'grid'>('carousels');

  // Find a featured movie for the hero banner
  const featuredMovie = movies.find((m) => m.featured) || movies[0];
  const isFeaturedInList = featuredMovie
    ? userList[featuredMovie.id]?.status === 'watchlist'
    : false;

  const isSearching = !!filters.query?.trim();
  const activeCount = getActiveFilterCount(filters) + (isSearching ? 1 : 0);
  const hasActiveFilters =
    isSearching ||
    filters.streamings.length > 0 ||
    filters.genres.length > 0 ||
    filters.mediaType !== 'all';

  // If search or specific filter criteria is active, show grid for direct browsing
  const effectiveLayout = hasActiveFilters ? 'grid' : layoutMode;

  // Helper for genre detection strictly on genres array
  const hasGenre = (m: Movie, ...terms: string[]) => {
    const gStr = (m.genres || []).join(' ').toLowerCase();
    return terms.some((t) => gStr.includes(t.toLowerCase()));
  };

  // 11 Rich Thematic Rails covering the entire 217-title curated catalog
  const thematicRails = [
    {
      id: 'trending',
      title: 'Em Alta & Tendências',
      subtitle: 'Os títulos mais aclamados e comentados do catálogo',
      icon: Flame,
      iconStyle: 'text-amber-400 bg-amber-500/20',
      categoryKey: 'Em Alta',
      movies: movies.filter(
        (m) => m.category === 'trending' || m.featured || (m.letterboxdRating || 0) >= 4.3
      ),
    },
    {
      id: 'masterpieces',
      title: 'Obras-Primas do Cinema',
      subtitle: 'Avaliações máximas no Letterboxd & IMDb',
      icon: Trophy,
      iconStyle: 'text-yellow-400 bg-yellow-500/20',
      categoryKey: 'Todos',
      movies: movies.filter(
        (m) => (m.letterboxdRating || 0) >= 4.2 || (m.rating || 0) >= 8.5
      ),
    },
    {
      id: 'scifi',
      title: 'Ficção Científica & Multiverso',
      subtitle: 'Futuros distópicos, exploração espacial e viagens no tempo',
      icon: Rocket,
      iconStyle: 'text-cyan-400 bg-cyan-500/20',
      categoryKey: 'Ficção Científica',
      movies: movies.filter((m) => hasGenre(m, 'ficção', 'tempo', 'distopia')),
    },
    {
      id: 'thrillers',
      title: 'Suspense & Thrillers Psicológicos',
      subtitle: 'Reviravoltas chocantes, jogos mentais e tensão máxima',
      icon: Compass,
      iconStyle: 'text-purple-400 bg-purple-500/20',
      categoryKey: 'Suspense',
      movies: movies.filter((m) =>
        hasGenre(m, 'suspense', 'mistério', 'thriller', 'psicológico')
      ),
    },
    {
      id: 'crime',
      title: 'Crime, Máfia & Investigação',
      subtitle: 'Policial clássico, tribunais e o submundo do crime',
      icon: ShieldAlert,
      iconStyle: 'text-rose-400 bg-rose-500/20',
      categoryKey: 'Crime',
      movies: movies.filter((m) =>
        hasGenre(m, 'crime', 'policial', 'máfia', 'investigação')
      ),
    },
    {
      id: 'drama',
      title: 'Dramas Emocionantes & Oscar',
      subtitle: 'Histórias profundas, biografias reais e atuações históricas',
      icon: HeartHandshake,
      iconStyle: 'text-violet-400 bg-violet-500/20',
      categoryKey: 'Drama',
      movies: movies.filter((m) =>
        hasGenre(m, 'drama', 'biografia', 'história real', 'oscar')
      ),
    },
    {
      id: 'action',
      title: 'Ação & Pura Adrenalina',
      subtitle: 'Grandes confrontos, vingança e sobrevivência épica',
      icon: Clapperboard,
      iconStyle: 'text-red-400 bg-red-500/20',
      categoryKey: 'Ação',
      movies: movies.filter((m) =>
        hasGenre(m, 'ação', 'aventura', 'vingança', 'sobrevivência', 'guerra')
      ),
    },
    {
      id: 'comedy',
      title: 'Comédias & Sessão Leve',
      subtitle: 'Histórias descontraídas, bom humor e sátiras brilhantes',
      icon: Laugh,
      iconStyle: 'text-emerald-400 bg-emerald-500/20',
      categoryKey: 'Comédia',
      movies: movies.filter((m) => hasGenre(m, 'comédia', 'humor', 'sátira')),
    },
    {
      id: 'horror',
      title: 'Terror & Sobrenatural',
      subtitle: 'Cinema de horror sombrio, perturbador e Stephen King',
      icon: Ghost,
      iconStyle: 'text-orange-400 bg-orange-500/20',
      categoryKey: 'Terror',
      movies: movies.filter((m) => hasGenre(m, 'terror', 'sobrenatural', 'king')),
    },
    {
      id: 'series',
      title: 'Séries Imperdíveis para Maratonar',
      subtitle: 'Grandes produções seriadas e narrativas viciantes',
      icon: Tv,
      iconStyle: 'text-blue-400 bg-blue-500/20',
      categoryKey: 'Séries',
      movies: movies.filter((m) => m.mediaType === 'series'),
    },
    {
      id: 'family',
      title: 'Kids & Animação em Família',
      subtitle: 'Aventuras mágicas e divertidas para todas as idades',
      icon: Baby,
      iconStyle: 'text-teal-400 bg-teal-500/20',
      categoryKey: 'Animação',
      movies: movies.filter((m) => m.category === 'kids' || hasGenre(m, 'animação', 'família')),
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-3 sm:py-6" data-testid="explore-view">
      {/* Hero Featured Backdrop Card (Only shown when not actively searching or filtering) */}
      {!hasActiveFilters && featuredMovie && (
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
                Destaque da Curadoria
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

            {/* Hero Actions */}
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
          {!hasActiveFilters && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center">
              <button
                type="button"
                onClick={() => setLayoutMode('carousels')}
                className={`p-1.5 rounded-xl transition-all ${
                  layoutMode === 'carousels'
                    ? 'bg-white/15 text-white'
                    : 'text-white/40 hover:text-white'
                }`}
                title="Modo Carrosséis Temáticos"
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
            className="relative p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white active:scale-95 transition-all"
            title="Abrir todos os filtros"
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-extrabold flex items-center justify-center shadow-md">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Rendering: Thematic Carousels or Full Grid */}
      {effectiveLayout === 'carousels' ? (
        <div className="space-y-8 sm:space-y-10">
          {thematicRails.map((rail) => {
            if (rail.movies.length === 0) return null;
            const RailIcon = rail.icon;

            return (
              <div key={rail.id} className="space-y-3">
                {/* Rail Header with Title, Editorial Subtitle and View All */}
                <div className="flex items-center justify-between px-1 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${rail.iconStyle}`}>
                      <RailIcon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight truncate">
                        {rail.title}
                      </h3>
                      <p className="text-[11px] text-white/40 font-medium hidden sm:block truncate">
                        {rail.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (rail.categoryKey === 'Todos') {
                        setLayoutMode('grid');
                      } else {
                        onQuickGenreSelect(rail.categoryKey);
                      }
                    }}
                    className="text-xs text-violet-400 hover:text-violet-300 font-semibold whitespace-nowrap shrink-0 hover:underline px-1 py-0.5"
                  >
                    Ver Todos ({rail.movies.length})
                  </button>
                </div>

                {/* Horizontal Carousel */}
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
                  {rail.movies.map((movie) => (
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
            );
          })}
        </div>
      ) : (
        /* Full Grid Layout */
        <div>
          {/* Header Bar for Grid Mode */}
          <div className="flex items-center justify-between mb-4 px-1 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{hasActiveFilters ? 'Resultado Filtrado' : 'Catálogo Completo'}</span>
                <span className="text-xs text-white/40 font-normal tabular-nums">
                  ({movies.length} {movies.length === 1 ? 'título' : 'títulos'})
                </span>
              </h3>
            </div>

            {hasActiveFilters && onResetFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>

          {/* Active Filter Pills Indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-3">
              {filters.query && (
                <span className="whitespace-nowrap px-2.5 py-1 rounded-full bg-violet-600/30 border border-violet-500/50 text-violet-200 text-xs font-semibold">
                  Busca: &ldquo;{filters.query}&rdquo;
                </span>
              )}
              {filters.mediaType !== 'all' && (
                <span className="whitespace-nowrap px-2.5 py-1 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-200 text-xs font-semibold">
                  {filters.mediaType === 'movie' ? 'Apenas Filmes' : 'Apenas Séries'}
                </span>
              )}
              {filters.streamings.map((st) => (
                <span
                  key={st}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold uppercase tracking-wider"
                >
                  {st}
                </span>
              ))}
              {filters.genres.map((g) => (
                <span
                  key={g}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-semibold"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

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
                Experimente limpar os filtros ou adicionar uma nova obra pelo TMDB.
              </p>
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                {onResetFilters && (
                  <button
                    onClick={onResetFilters}
                    className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10"
                  >
                    Limpar Todos os Filtros
                  </button>
                )}
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
