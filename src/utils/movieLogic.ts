import type { Movie, FilterState, DiscoverSurvey, UserMovieData, Profile, FriendReview } from '../types/index.ts';

export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

export function validatePin(inputPin: string, correctPin: string = '123'): boolean {
  return inputPin.trim() === correctPin.trim();
}

export function getActiveFiltersCount(filters: FilterState): number {
  let count = 0;
  if (filters.streamings.length > 0) count += filters.streamings.length;
  if (filters.genres.length > 0) count += filters.genres.length;
  if (filters.mediaType !== 'all') count += 1;
  if (filters.sortBy !== 'rating') count += 1;
  return count;
}

export const getActiveFilterCount = getActiveFiltersCount;

export function filterMovies(movies: Movie[], filters: FilterState): Movie[] {
  return movies.filter((movie) => {
    // Search query check
    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      const matchTitle = (movie.title || '').toLowerCase().includes(q);
      const matchOriginal = (movie.originalTitle || '').toLowerCase().includes(q);
      const matchDirector = (movie.director || '').toLowerCase().includes(q);
      const matchGenre = (movie.genres || []).some((g) => g.toLowerCase().includes(q));
      const matchCast = (movie.cast || []).some((c) => c.toLowerCase().includes(q));
      if (!matchTitle && !matchOriginal && !matchDirector && !matchGenre && !matchCast) {
        return false;
      }
    }

    // Media type filter
    if (filters.mediaType !== 'all' && movie.mediaType !== filters.mediaType) {
      return false;
    }

    // Streaming platforms filter (OR within selected streamings)
    if (filters.streamings.length > 0) {
      const platforms = movie.streamingPlatforms || [];
      const hasStreaming = platforms.some((sp) =>
        filters.streamings.includes(sp)
      );
      if (!hasStreaming) return false;
    }

    // Genre filter (match selected genres flexibly)
    if (filters.genres.length > 0) {
      const genres = movie.genres || [];
      const hasAllGenres = filters.genres.every((fg) =>
        genres.some(
          (g) =>
            g.toLowerCase() === fg.toLowerCase() ||
            g.toLowerCase().includes(fg.toLowerCase()) ||
            fg.toLowerCase().includes(g.toLowerCase())
        )
      );
      if (!hasAllGenres) return false;
    }

    return true;
  });
}

export function sortMovies(movies: Movie[], sortBy: FilterState['sortBy']): Movie[] {
  const cloned = [...movies];
  switch (sortBy) {
    case 'letterboxd':
      return cloned.sort((a, b) => (b.letterboxdRating ?? b.rating ?? 0) - (a.letterboxdRating ?? a.rating ?? 0));
    case 'rating':
      return cloned.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'year':
      return cloned.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    case 'title':
      return cloned.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'pt-BR'));
    case 'runtime':
      return cloned.sort((a, b) => (b.runtimeMinutes ?? 0) - (a.runtimeMinutes ?? 0));
    default:
      return cloned;
  }
}

export function recommendMovie(movies: Movie[], survey: DiscoverSurvey): Movie | null {
  if (movies.length === 0) return null;

  // Score each movie based on relevance
  const scored = movies.map((movie) => {
    let score = 0;

    // Mood match (+3)
    if (survey.mood && survey.mood !== 'qualquer') {
      if (movie.moodTags.includes(survey.mood)) {
        score += 4;
      }
    } else {
      score += 1;
    }

    // Time limit match (+3)
    if (survey.timeLimit && survey.timeLimit !== 'qualquer') {
      if (survey.timeLimit === 'rapido' && movie.durationCategory === 'quick') score += 3;
      else if (survey.timeLimit === 'medio' && movie.durationCategory === 'standard') score += 3;
      else if (survey.timeLimit === 'epico' && movie.durationCategory === 'epic') score += 3;
      else if (survey.timeLimit === 'serie' && movie.mediaType === 'series') score += 4;
    } else {
      score += 1;
    }

    // Platform match (+3)
    if (survey.platform && survey.platform !== 'qualquer') {
      // Cast to any to check if platform string matches streaming ID
      if (movie.streamingPlatforms.includes(survey.platform as any)) {
        score += 3;
      }
    } else {
      score += 1;
    }

    // Baseline bonus for high quality
    score += movie.letterboxdRating;

    return { movie, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const bestScore = scored[0]?.score ?? 0;
  // Only consider candidates within 1.0 point of the top score
  const topCandidates = scored.filter((item) => item.score >= bestScore - 1.0).map((item) => item.movie);
  if (topCandidates.length <= 1) {
    return topCandidates[0] || scored[0].movie;
  }
  const randomIndex = Math.floor(Math.random() * topCandidates.length);
  return topCandidates[randomIndex];
}

export function calculateProfileStats(
  movies: Movie[],
  userList: Record<string, UserMovieData>
) {
  let completedCount = 0;
  let totalWatchedMinutes = 0;
  let ratingsSum = 0;
  let ratedCount = 0;
  let favoriteCount = 0;
  let watchlistCount = 0;
  let watchingCount = 0;

  const movieMap = new Map<string, Movie>(movies.map((m) => [m.id, m]));

  for (const [movieId, data] of Object.entries(userList)) {
    const movie = movieMap.get(movieId);
    if (data.status === 'completed') {
      completedCount++;
      if (movie) {
        totalWatchedMinutes += movie.runtimeMinutes;
      }
    } else if (data.status === 'watching') {
      watchingCount++;
    } else if (data.status === 'watchlist') {
      watchlistCount++;
    }

    if (data.isFavorite || data.status === 'favorite') {
      favoriteCount++;
    }

    if (data.userRating && data.userRating > 0) {
      ratingsSum += data.userRating;
      ratedCount++;
    }
  }

  const averageRating = ratedCount > 0 ? (ratingsSum / ratedCount).toFixed(1) : '—';
  const hoursWatched = (totalWatchedMinutes / 60).toFixed(1);

  return {
    completedCount,
    watchingCount,
    watchlistCount,
    favoriteCount,
    totalWatchedMinutes,
    hoursWatched,
    averageRating,
    ratedCount,
  };
}

export function getFriendReviewsForMovie(
  profiles: Profile[],
  movieId: string,
  currentProfileId?: string
): FriendReview[] {
  const reviews: FriendReview[] = [];

  for (const prof of profiles) {
    if (currentProfileId && prof.id === currentProfileId) continue;
    const entry = prof.list?.[movieId];
    if (entry && (entry.status === 'completed' || entry.userRating || entry.review || entry.isFavorite)) {
      reviews.push({
        profileId: prof.id,
        profileName: prof.name,
        avatarUrl: prof.avatarUrl,
        accentColor: prof.accentColor,
        status: entry.status,
        userRating: entry.userRating,
        review: entry.review,
        updatedAt: entry.updatedAt,
      });
    }
  }

  return reviews;
}

export function getSimilarMovies(movies: Movie[], currentMovie: Movie): Movie[] {
  // If explicitly declared similar IDs
  if (currentMovie.similarMovieIds && currentMovie.similarMovieIds.length > 0) {
    const directMatches = movies.filter((m) =>
      currentMovie.similarMovieIds?.includes(m.id)
    );
    if (directMatches.length > 0) return directMatches.slice(0, 5);
  }

  // Otherwise, match by genre overlap or director
  return movies
    .filter((m) => m.id !== currentMovie.id)
    .map((m) => {
      let score = 0;
      if (m.director === currentMovie.director) score += 4;
      const commonGenres = m.genres.filter((g) => currentMovie.genres.includes(g));
      score += commonGenres.length * 2;
      if (m.category === currentMovie.category) score += 1;
      return { movie: m, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.movie);
}

