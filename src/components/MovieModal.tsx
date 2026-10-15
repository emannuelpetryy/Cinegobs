import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Star,
  Bookmark,
  CheckCircle2,
  PlayCircle,
  Heart,
  Calendar,
  Clock,
  Tv,
  Share2,
  Film,
  Check,
  Play,
  Users,
  Sparkles,
} from 'lucide-react';
import { Movie, UserMovieData, WatchStatus, STREAMING_PLATFORMS, Profile } from '../types/index.ts';
import { formatRuntime, getFriendReviewsForMovie, getSimilarMovies } from '../utils/movieLogic.ts';
import { TrailerModal } from './TrailerModal.tsx';
import { StreamingIcon } from './StreamingIcons.tsx';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  userData?: UserMovieData;
  onUpdateUserData: (movieId: string, data: Partial<UserMovieData>) => void;
  profiles: Profile[];
  activeProfileId: string;
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  onClose,
  userData,
  onUpdateUserData,
  profiles,
  activeProfileId,
  allMovies,
  onSelectMovie,
}) => {
  if (!movie) return null;

  const [reviewText, setReviewText] = useState<string>(userData?.review || '');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState<boolean>(false);

  const currentStatus: WatchStatus = userData?.status || 'none';
  const currentRating = userData?.userRating || 0;
  const isFavorite = userData?.isFavorite || false;

  const friendReviews = getFriendReviewsForMovie(profiles, movie.id, activeProfileId);
  const similarMovies = getSimilarMovies(allMovies, movie);

  const handleStatusChange = (status: WatchStatus) => {
    const nextStatus = currentStatus === status ? 'none' : status;
    onUpdateUserData(movie.id, {
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleFavorite = () => {
    onUpdateUserData(movie.id, {
      isFavorite: !isFavorite,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRating = (score: number) => {
    const nextRating = currentRating === score ? undefined : score;
    onUpdateUserData(movie.id, {
      userRating: nextRating,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleReviewBlur = () => {
    if (reviewText !== (userData?.review || '')) {
      onUpdateUserData(movie.id, {
        review: reviewText,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Recomendo assistir "${movie.title}" (${movie.year}) no Cinegobetti!`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="relative w-full max-w-2xl bg-[#0E1017] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button Floating */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
            aria-label="Fechar detalhes"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto flex-1 pb-6">
            {/* Hero Backdrop Banner */}
            <div className="relative w-full h-48 sm:h-60 overflow-hidden bg-[#151821]">
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-[#0E1017]/40 to-transparent" />
            </div>

            {/* Main Info Section */}
            <div className="px-5 sm:px-7 -mt-16 sm:-mt-20 relative z-10">
              <div className="flex gap-4 sm:gap-6 items-start">
                {/* 2:3 Floating Poster */}
                <div className="w-24 sm:w-32 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-[#151821]">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Core Meta */}
                <div className="flex-1 pt-6 sm:pt-8 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                      {movie.mediaType === 'series' ? 'Série' : 'Filme'}
                    </span>
                    {movie.category === 'kids' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                        Kids & Família
                      </span>
                    )}
                    {movie.seasons && (
                      <span className="text-[11px] font-medium text-white/50">
                        {movie.seasons} {movie.seasons > 1 ? 'Temporadas' : 'Temporada'}
                      </span>
                    )}
                  </div>

                  <h2
                    id="movie-modal-title"
                    className="text-lg sm:text-2xl font-extrabold text-white leading-tight"
                  >
                    {movie.title}
                  </h2>
                  {movie.originalTitle !== movie.title && (
                    <p className="text-[11px] text-white/50 italic mt-0.5 truncate">
                      {movie.originalTitle}
                    </p>
                  )}

                  <div className="flex items-center gap-2.5 text-[11px] text-white/60 font-medium mt-1.5 flex-wrap tabular-nums">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-white/40" strokeWidth={1.75} />
                      {movie.year}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/40" strokeWidth={1.75} />
                      {formatRuntime(movie.runtimeMinutes)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3 h-3 fill-amber-300" strokeWidth={1.75} />
                      {movie.letterboxdRating.toFixed(1)}
                    </span>
                  </div>

                  {/* Trailer button */}
                  {movie.trailerYoutubeId && (
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => setIsTrailerOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shadow-md transition-all active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current" strokeWidth={1.75} />
                        <span>Ver Trailer Oficial</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Watch Status Bar */}
              <div className="mt-6 p-2 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleStatusChange('watchlist')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    currentStatus === 'watchlist'
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Quero Ver"
                >
                  <Bookmark className="w-4 h-4 mb-1" strokeWidth={1.75} />
                  <span>Quero Ver</span>
                </button>

                <button
                  onClick={() => handleStatusChange('watching')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    currentStatus === 'watching'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Em Andamento"
                >
                  <PlayCircle className="w-4 h-4 mb-1" strokeWidth={1.75} />
                  <span>Assistindo</span>
                </button>

                <button
                  onClick={() => handleStatusChange('completed')}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    currentStatus === 'completed'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Concluído"
                >
                  <CheckCircle2 className="w-4 h-4 mb-1" strokeWidth={1.75} />
                  <span>Assistido</span>
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label="Favorito"
                >
                  <Heart className={`w-4 h-4 mb-1 ${isFavorite ? 'fill-current' : ''}`} strokeWidth={1.75} />
                  <span>Favorito</span>
                </button>
              </div>

              {/* Personal Rating Bar (Letterboxd 5-star style) */}
              <div className="mt-5 p-4 rounded-2xl bg-[#131622] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">Sua Avaliação</span>
                  <span className="text-[11px] text-white/50">
                    {currentRating > 0
                      ? `Nota pessoal: ${currentRating.toFixed(1)} / 5.0 estrelas`
                      : 'Toque para avaliar este título'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5" data-testid="star-rating-selector">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = currentRating >= starValue;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => handleRating(starValue)}
                        className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform focus:outline-none"
                        aria-label={`Avaliar ${starValue} estrelas`}
                      >
                        <Star
                          strokeWidth={1.75}
                          className={`w-6 h-6 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 shadow-sm'
                              : 'text-white/20 hover:text-white/40'
                          }`}
                        />
                      </button>
                    );
                  })}
                  {currentRating > 0 && (
                    <button
                      onClick={() => handleRating(0)}
                      className="ml-2 text-[10px] text-white/40 hover:text-white/80 underline"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Review Note */}
              <div className="mt-4">
                <label htmlFor="review-textarea" className="block text-xs font-bold text-white/80 mb-1.5">
                  Suas Anotações & Resenha Pessoal
                </label>
                <textarea
                  id="review-textarea"
                  rows={2}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  onBlur={handleReviewBlur}
                  placeholder="Escreva sua opinião, frases marcantes ou observações sobre o filme..."
                  className="w-full bg-[#131622] border border-white/10 rounded-2xl p-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 leading-relaxed transition-all"
                />
              </div>

              {/* Social Activity: Amigos que já assistiram & notas */}
              <div className="mt-6 p-4 rounded-2xl bg-[#12151F] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" strokeWidth={1.75} />
                    <span>Amigos & Perfis que Assistiram</span>
                  </h3>
                  <span className="text-[11px] text-white/40 tabular-nums">
                    {friendReviews.length} {friendReviews.length === 1 ? 'amigo' : 'amigos'}
                  </span>
                </div>

                {friendReviews.length > 0 ? (
                  <div className="space-y-3">
                    {friendReviews.map((rev) => (
                      <div
                        key={rev.profileId}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3"
                      >
                        <div
                          className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border p-[1px]"
                          style={{ borderColor: rev.accentColor }}
                        >
                          <img
                            src={rev.avatarUrl}
                            alt={rev.profileName}
                            className="w-full h-full object-cover rounded-[10px]"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white truncate">
                              {rev.profileName}
                            </span>
                            {rev.userRating && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-300 tabular-nums bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                <Star className="w-3 h-3 fill-amber-300" strokeWidth={1.75} />
                                <span>{rev.userRating.toFixed(1)}</span>
                              </span>
                            )}
                          </div>

                          {rev.review ? (
                            <p className="text-xs text-white/70 italic mt-1 leading-relaxed">
                              &ldquo;{rev.review}&rdquo;
                            </p>
                          ) : (
                            <p className="text-[11px] text-white/40 mt-0.5">
                              Marcou como assistido
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 italic py-1">
                    Nenhum outro amigo ou perfil cadastrado assistiu a este título ainda.
                  </p>
                )}
              </div>

              {/* Where to Watch (Streaming badges with official SVG icons) */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-violet-400" strokeWidth={1.75} />
                  <span>Onde Assistir no Brasil</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.streamingPlatforms.map((id) => {
                    const platform = STREAMING_PLATFORMS.find((p) => p.id === id);
                    if (!platform) return null;
                    return (
                      <div
                        key={platform.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold shadow-sm"
                        style={{
                          backgroundColor: `${platform.badgeColor}25`,
                          borderColor: `${platform.badgeColor}40`,
                          color: '#FFFFFF',
                        }}
                      >
                        <StreamingIcon platform={platform.id} size={15} />
                        <span>{platform.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Cast with Photos & Character Roles */}
              {movie.castDetails && movie.castDetails.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">
                    Elenco Principal & Personagens
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {movie.castDetails.map((actor, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center w-20 shrink-0"
                      >
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 bg-white/5 mb-1.5 shadow-md">
                          <img
                            src={actor.avatarUrl}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-white line-clamp-1">
                          {actor.name}
                        </span>
                        <span className="text-[10px] text-white/50 line-clamp-1">
                          {actor.character}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                  Sinopse
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                  {movie.synopsis}
                </p>
              </div>

              {/* Similar Movies Carousel */}
              {similarMovies.length > 0 && (
                <div className="mt-8 pt-5 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Quem Assistiu Este Também Gostou
                    </h3>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {similarMovies.map((simMovie) => (
                      <button
                        key={simMovie.id}
                        type="button"
                        onClick={() => onSelectMovie(simMovie)}
                        className="w-24 sm:w-28 shrink-0 text-left group focus:outline-none"
                      >
                        <div className="aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/10 group-hover:border-violet-500/80 transition-all shadow-md bg-[#151821]">
                          <img
                            src={simMovie.posterUrl}
                            alt={simMovie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-white block truncate mt-1 group-hover:text-violet-300">
                          {simMovie.title}
                        </span>
                        <span className="text-[10px] text-white/50 flex items-center gap-1 tabular-nums mt-0.5">
                          <span>{simMovie.year}</span>
                          <span>·</span>
                          <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" strokeWidth={1.75} />
                          <span>{simMovie.letterboxdRating.toFixed(1)}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Share / Recommendations Action */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/10"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
                      <span>Copiado para compartilhar!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Compartilhar Título</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-600/30"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Trailer Lightbox Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        youtubeId={movie.trailerYoutubeId}
        movieTitle={movie.title}
      />
    </>
  );
};
