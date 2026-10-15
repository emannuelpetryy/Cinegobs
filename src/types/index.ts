export type StreamingPlatformId = 
  | 'netflix'
  | 'prime'
  | 'max'
  | 'disney'
  | 'appletv'
  | 'paramount'
  | 'mubi'
  | 'globoplay';

export const STREAMING_PLATFORMS: StreamingPlatform[] = [
  { id: 'netflix', name: 'Netflix', badgeColor: '#E50914', badgeTextColor: '#FFFFFF' },
  { id: 'prime', name: 'Prime Video', badgeColor: '#00A8E1', badgeTextColor: '#FFFFFF' },
  { id: 'max', name: 'Max', badgeColor: '#002BE7', badgeTextColor: '#FFFFFF' },
  { id: 'disney', name: 'Disney+', badgeColor: '#113CCF', badgeTextColor: '#FFFFFF' },
  { id: 'appletv', name: 'Apple TV+', badgeColor: '#262626', badgeTextColor: '#FFFFFF' },
  { id: 'paramount', name: 'Paramount+', badgeColor: '#0064FF', badgeTextColor: '#FFFFFF' },
  { id: 'mubi', name: 'MUBI', badgeColor: '#053225', badgeTextColor: '#37E885' },
  { id: 'globoplay', name: 'Globoplay', badgeColor: '#FB0A25', badgeTextColor: '#FFFFFF' },
];

export interface StreamingPlatform {
  id: StreamingPlatformId;
  name: string;
  badgeColor: string;
  badgeTextColor: string;
}

export type MediaType = 'movie' | 'series';

export interface CastMember {
  name: string;
  character: string;
  avatarUrl: string;
}

export interface FriendReview {
  profileId: string;
  profileName: string;
  avatarUrl: string;
  accentColor: string;
  status: WatchStatus;
  userRating?: number;
  review?: string;
  updatedAt: string;
}

export type MovieCategory = 'trending' | 'movie' | 'series' | 'kids';

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  runtimeMinutes: number; // formatted as "2h 15m" or "1h 48m"
  director: string;
  cast: string[];
  castDetails?: CastMember[];
  genres: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number; // e.g. 8.6
  letterboxdRating: number; // e.g. 4.4
  streamingPlatforms: StreamingPlatformId[];
  mediaType: MediaType;
  category?: MovieCategory;
  seasons?: number;
  moodTags: string[]; // e.g. ['epico', 'pensativo', 'adrenalina', 'sombrio', 'emocionante', 'descontraido']
  durationCategory: 'quick' | 'standard' | 'epic'; // <90, 90-135, >135
  featured?: boolean;
  trailerYoutubeId?: string;
  similarMovieIds?: string[];
}

export type WatchStatus = 'none' | 'watchlist' | 'watching' | 'completed' | 'favorite';

export interface UserMovieData {
  movieId: string;
  status: WatchStatus;
  userRating?: number; // 0.5 - 5.0 (steps of 0.5)
  review?: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  accentColor: string; // hex
  createdAt: string;
  isPinProtected: boolean;
  pin?: string;
  list: Record<string, UserMovieData>; // movieId -> UserMovieData
}

export interface FilterState {
  query: string;
  streamings: StreamingPlatformId[];
  genres: string[];
  mediaType: 'all' | 'movie' | 'series';
  sortBy: 'rating' | 'letterboxd' | 'year' | 'title' | 'runtime';
}

export type ActiveTab = 'explore' | 'mylist' | 'discover' | 'filters';

export interface DiscoverSurvey {
  mood: string;
  timeLimit: string;
  platform: string;
}
