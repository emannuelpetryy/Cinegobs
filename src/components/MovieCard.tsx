import React from 'react';
import { Star, CheckCircle2, PlayCircle, Heart } from 'lucide-react';
import { Movie, UserMovieData, STREAMING_PLATFORMS } from '../types/index.ts';
import { StreamingIcon } from './StreamingIcons.tsx';

interface MovieCardProps {
  movie: Movie;
  userData?: UserMovieData;
  onClick: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  userData,
  onClick,
}) => {
  // Find streaming labels for top badges safely
  const primaryPlatformId = (movie.streamingPlatforms || [])[0];
  const primaryStreaming = STREAMING_PLATFORMS.find(
    (p) => p.id === primaryPlatformId
  );

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex flex-col cursor-pointer focus:outline-none transition-transform duration-200 active:scale-95"
      aria-label={`Ver detalhes de ${movie.title}`}
    >
      {/* 2:3 Poster Frame with continuous rounded corners */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#151821] border border-white/5 shadow-md group-hover:shadow-2xl group-hover:border-white/20 transition-all duration-300">
        <img
          src={movie.posterUrl}
          alt={`Pôster de ${movie.title}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient poster gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges: Streaming and User Favorite */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
          {primaryStreaming && (
            <span
              className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg backdrop-blur-xl uppercase tracking-wide whitespace-nowrap shrink-0 max-w-[95px] sm:max-w-none bg-[#090A0F]/85 border border-white/20 text-white"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <StreamingIcon platform={primaryStreaming.id} size={12} />
              </span>
              <span className="whitespace-nowrap truncate inline-block">
                {primaryStreaming.id === 'prime' ? 'Prime' : primaryStreaming.name}
              </span>
            </span>
          )}

          {userData?.isFavorite && (
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-lg ml-auto shrink-0">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" strokeWidth={1.75} />
            </span>
          )}
        </div>

        {/* Bottom Poster Info Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between pointer-events-none">
          {/* User Watch Status or General Rating */}
          <div className="flex items-center gap-1">
            {userData?.userRating ? (
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-400 text-black text-[10px] sm:text-[11px] font-extrabold tabular-nums shadow-md whitespace-nowrap">
                <Star className="w-3 h-3 fill-black text-black" strokeWidth={1.75} />
                <span>{Number(userData.userRating).toFixed(1)}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 text-[10px] sm:text-[11px] font-bold tabular-nums whitespace-nowrap">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" strokeWidth={1.75} />
                <span>{(movie.letterboxdRating ?? movie.rating ?? 8.0).toFixed(1)}</span>
              </span>
            )}

            {/* Watch status icon */}
            {userData?.status === 'completed' && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-sm shrink-0" title="Assistido">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={1.75} />
              </span>
            )}
            {userData?.status === 'watching' && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/90 text-white flex items-center justify-center shadow-sm shrink-0" title="Assistindo">
                <PlayCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={1.75} />
              </span>
            )}
          </div>

          {/* Release Year */}
          <span className="text-[10px] sm:text-[11px] font-medium text-white/50 tabular-nums">
            {movie.year}
          </span>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="mt-2 flex flex-col px-0.5">
        <h3 className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-white transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-[10px] sm:text-[11px] text-white/40 line-clamp-1 mt-0.5">
          {(movie.genres || []).slice(0, 2).join(' • ')}
        </p>
      </div>
    </div>
  );
};
