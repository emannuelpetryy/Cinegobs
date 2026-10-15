import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Check,
  Star,
  Film,
  Tv,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Movie, StreamingPlatformId, STREAMING_PLATFORMS, WatchStatus } from '../types/index.ts';
import { StreamingIcon } from './StreamingIcons.tsx';

interface TmdbResult {
  id: string;
  title: string;
  type: 'movie' | 'series';
  year: number | null;
  overview: string;
  poster: string;
  backdrop: string;
  voteAverage: number | null;
  voteCount: number;
}

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (movie: Movie, initialStatus: WatchStatus) => void;
  initialQuery?: string;
}

export const AddMovieModal: React.FC<AddMovieModalProps> = ({
  isOpen,
  onClose,
  onAddMovie,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<TmdbResult | null>(null);

  // Customization fields
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatformId>('netflix');
  const [initialStatus, setInitialStatus] = useState<WatchStatus>('watchlist');
  const [selectedGenre, setSelectedGenre] = useState<string>('Drama');

  useEffect(() => {
    if (initialQuery && initialQuery.trim().length >= 2) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setSelectedResult(null);

    try {
      const res = await fetch(`/api/tmdb?q=${encodeURIComponent(searchQuery.trim())}`);
      if (!res.ok) throw new Error('Falha ao buscar no TMDB');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.warn('TMDB search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleConfirmAdd = () => {
    if (!selectedResult) return;

    const newMovie: Movie = {
      id: `custom_${Date.now()}`,
      title: selectedResult.title,
      originalTitle: selectedResult.title,
      year: selectedResult.year || new Date().getFullYear(),
      runtimeMinutes: selectedResult.type === 'series' ? 45 : 120,
      director: 'Direção Curadoria',
      cast: ['Elenco TMDB'],
      genres: [selectedGenre],
      synopsis: selectedResult.overview || 'Sinopse adicionada via TMDB.',
      posterUrl: selectedResult.poster,
      backdropUrl: selectedResult.backdrop,
      rating: selectedResult.voteAverage || 7.5,
      letterboxdRating: selectedResult.voteAverage ? parseFloat((selectedResult.voteAverage * 0.5 + 0.3).toFixed(1)) : 3.8,
      streamingPlatforms: [selectedPlatform],
      mediaType: selectedResult.type,
      category: selectedResult.type === 'series' ? 'series' : 'movie',
      moodTags: ['emocionante'],
      durationCategory: selectedResult.type === 'series' ? 'epic' : 'standard',
      featured: false,
    };

    onAddMovie(newMovie, initialStatus);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-movie-title"
    >
      <div className="relative w-full max-w-xl bg-[#0F1118] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="add-movie-title" className="text-base sm:text-lg font-bold text-white">
                Adicionar Filme ou Série
              </h2>
              <p className="text-[11px] text-white/50">
                Busca ao vivo no catálogo mundial do The Movie Database (TMDB)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-2 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="mb-4 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-violet-400 absolute left-3.5 pointer-events-none" strokeWidth={1.75} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o título (ex: Interestelar, Breaking Bad...)"
              className="w-full bg-white/5 text-white placeholder-white/40 text-xs sm:text-sm font-medium rounded-2xl py-3 pl-10 pr-24 border border-white/10 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Buscar</span>}
            </button>
          </div>
        </form>

        {/* Results Container / Configuration */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {!selectedResult ? (
            /* Search Results List */
            <>
              {isLoading && (
                <div className="py-12 flex flex-col items-center justify-center text-white/40">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-400 mb-2" />
                  <span className="text-xs">Buscando no acervo do TMDB...</span>
                </div>
              )}

              {!isLoading && hasSearched && results.length === 0 && (
                <div className="py-12 text-center text-white/40">
                  <p className="text-xs">Nenhum resultado encontrado para &ldquo;{query}&rdquo;.</p>
                  <p className="text-[11px] text-white/30 mt-1">Verifique a ortografia ou tente pelo nome original.</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-1">
                    Selecione para configurar ({results.length} encontrados)
                  </span>
                  {results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedResult(item)}
                      className="group p-2.5 rounded-2xl bg-white/5 hover:bg-violet-600/10 border border-white/5 hover:border-violet-500/40 cursor-pointer transition-all flex items-center gap-3 active:scale-[0.99]"
                    >
                      <div className="w-11 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                        <img src={item.poster} alt="" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-white group-hover:text-violet-300 truncate">
                            {item.title}
                          </h4>
                          {item.year && (
                            <span className="text-[10px] text-white/40 tabular-nums">
                              ({item.year})
                            </span>
                          )}
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                            {item.type === 'movie' ? 'Filme' : 'Série'}
                          </span>
                        </div>

                        <p className="text-[11px] text-white/50 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.overview}
                        </p>

                        {item.voteAverage && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-300">
                            <Star className="w-3 h-3 fill-amber-300" strokeWidth={1.75} />
                            <span>{item.voteAverage.toFixed(1)} TMDB</span>
                          </div>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-violet-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Selected Movie Configuration Step */
            <div className="space-y-4 animate-fade-in">
              {/* Summary Card */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-14 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20 shadow-md">
                  <img src={selectedResult.poster} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate">
                      {selectedResult.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedResult(null)}
                      className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold underline"
                    >
                      Trocar
                    </button>
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    {selectedResult.year} • {selectedResult.type === 'movie' ? 'Filme' : 'Série'}
                  </p>
                  <p className="text-[11px] text-white/70 line-clamp-2 mt-1">
                    {selectedResult.overview}
                  </p>
                </div>
              </div>

              {/* Streaming Platform Selector */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Onde você assiste / plataforma disponível:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STREAMING_PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatform === platform.id;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-violet-600/20 border-violet-500 shadow-sm'
                            : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <StreamingIcon platform={platform.id} size={14} />
                        <span className="text-xs font-semibold text-white truncate">
                          {platform.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Initial Watch Status */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Status inicial no seu perfil:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'watchlist', label: 'Quero Ver' },
                    { id: 'completed', label: 'Já Assistido' },
                    { id: 'none', label: 'Só Adicionar' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setInitialStatus(st.id as WatchStatus)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                        initialStatus === st.id
                          ? 'bg-violet-600 text-white border-violet-500'
                          : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {selectedResult && (
          <div className="pt-4 border-t border-white/10 shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedResult(null)}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all border border-white/10"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleConfirmAdd}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              <span>Confirmar e Adicionar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
