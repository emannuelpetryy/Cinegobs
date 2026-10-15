import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRuntime,
  validatePin,
  getActiveFiltersCount,
  filterMovies,
  sortMovies,
  recommendMovie,
  calculateProfileStats,
  getFriendReviewsForMovie,
  getSimilarMovies
} from './movieLogic.ts';
import type { Movie, FilterState, Profile } from '../types/index.ts';

const mockMovies: Movie[] = [
  {
    id: 'm1',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    year: 2023,
    runtimeMinutes: 180,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt'],
    genres: ['Drama', 'História'],
    synopsis: 'A história do cientista americano J. Robert Oppenheimer.',
    posterUrl: 'https://example.com/oppenheimer.jpg',
    backdropUrl: 'https://example.com/oppenheimer-bg.jpg',
    rating: 8.9,
    letterboxdRating: 4.5,
    streamingPlatforms: ['prime', 'appletv'],
    mediaType: 'movie',
    moodTags: ['pensativo', 'epico'],
    durationCategory: 'epic',
  },
  {
    id: 'm2',
    title: 'Duna: Parte 2',
    originalTitle: 'Dune: Part Two',
    year: 2024,
    runtimeMinutes: 166,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya'],
    genres: ['Ficção Científica', 'Aventura'],
    synopsis: 'Paul Atreides se une a Chani e aos Fremen.',
    posterUrl: 'https://example.com/dune2.jpg',
    backdropUrl: 'https://example.com/dune2-bg.jpg',
    rating: 8.8,
    letterboxdRating: 4.6,
    streamingPlatforms: ['max'],
    mediaType: 'movie',
    moodTags: ['epico', 'adrenalina'],
    durationCategory: 'epic',
  },
  {
    id: 'm3',
    title: 'Ruptura',
    originalTitle: 'Severance',
    year: 2022,
    runtimeMinutes: 50,
    director: 'Ben Stiller',
    cast: ['Adam Scott', 'Patricia Arquette'],
    genres: ['Ficção Científica', 'Suspense'],
    synopsis: 'Mark lidera uma equipe de funcionários de escritório cujas memórias foram divididas.',
    posterUrl: 'https://example.com/severance.jpg',
    backdropUrl: 'https://example.com/severance-bg.jpg',
    rating: 8.7,
    letterboxdRating: 4.4,
    streamingPlatforms: ['appletv'],
    mediaType: 'series',
    seasons: 2,
    moodTags: ['sombrio', 'pensativo'],
    durationCategory: 'quick',
  }
];

test('formatRuntime handles minutes properly', () => {
  assert.equal(formatRuntime(180), '3h');
  assert.equal(formatRuntime(166), '2h 46m');
  assert.equal(formatRuntime(45), '45m');
  assert.equal(formatRuntime(0), '0m');
});

test('validatePin checks PIN correctly', () => {
  assert.equal(validatePin('123', '123'), true);
  assert.equal(validatePin(' 123 ', '123'), true);
  assert.equal(validatePin('000', '123'), false);
  assert.equal(validatePin('', '123'), false);
});

test('getActiveFiltersCount calculates active filter elements', () => {
  const emptyFilters: FilterState = {
    query: '',
    streamings: [],
    genres: [],
    mediaType: 'all',
    sortBy: 'rating'
  };
  assert.equal(getActiveFiltersCount(emptyFilters), 0);

  const activeFilters: FilterState = {
    query: 'test',
    streamings: ['netflix', 'prime'],
    genres: ['Drama'],
    mediaType: 'series',
    sortBy: 'year'
  };
  // 2 streamings + 1 genre + 1 mediaType != 'all' + 1 sortBy != 'rating' = 5
  assert.equal(getActiveFiltersCount(activeFilters), 5);
});

test('filterMovies filters by search query and platforms', () => {
  const filterByQuery: FilterState = {
    query: 'Nolan',
    streamings: [],
    genres: [],
    mediaType: 'all',
    sortBy: 'rating'
  };
  const res1 = filterMovies(mockMovies, filterByQuery);
  assert.equal(res1.length, 1);
  assert.equal(res1[0].title, 'Oppenheimer');

  const filterByStreaming: FilterState = {
    query: '',
    streamings: ['max'],
    genres: [],
    mediaType: 'all',
    sortBy: 'rating'
  };
  const res2 = filterMovies(mockMovies, filterByStreaming);
  assert.equal(res2.length, 1);
  assert.equal(res2[0].title, 'Duna: Parte 2');
});

test('sortMovies sorts correctly by year and rating', () => {
  const sortedByYear = sortMovies(mockMovies, 'year');
  assert.equal(sortedByYear[0].year, 2024);

  const sortedByTitle = sortMovies(mockMovies, 'title');
  assert.equal(sortedByTitle[0].title, 'Duna: Parte 2');
});

test('recommendMovie provides a match based on survey', () => {
  const survey = {
    mood: 'sombrio',
    timeLimit: 'serie',
    platform: 'appletv'
  };
  const recommendation = recommendMovie(mockMovies, survey);
  assert.notEqual(recommendation, null);
  assert.equal(recommendation?.title, 'Ruptura');
});

test('calculateProfileStats generates accurate statistics', () => {
  const userList = {
    'm1': {
      movieId: 'm1',
      status: 'completed' as const,
      userRating: 5.0,
      updatedAt: '2026-10-15',
      isFavorite: true
    },
    'm2': {
      movieId: 'm2',
      status: 'watching' as const,
      userRating: 4.5,
      updatedAt: '2026-10-15',
      isFavorite: false
    }
  };

  const stats = calculateProfileStats(mockMovies, userList);
  assert.equal(stats.completedCount, 1);
  assert.equal(stats.watchingCount, 1);
  assert.equal(stats.favoriteCount, 1);
  assert.equal(stats.totalWatchedMinutes, 180);
  assert.equal(stats.hoursWatched, '3.0');
  assert.equal(stats.averageRating, '4.8');
});

test('getFriendReviewsForMovie returns other profiles who watched or rated', () => {
  const profiles: Profile[] = [
    {
      id: 'p1',
      name: 'João',
      avatarUrl: '',
      accentColor: '#8B5CF6',
      createdAt: '',
      isPinProtected: false,
      list: {
        'm1': { movieId: 'm1', status: 'completed', userRating: 5.0, review: 'Incrível', updatedAt: '', isFavorite: true }
      }
    },
    {
      id: 'p2',
      name: 'Maria',
      avatarUrl: '',
      accentColor: '#F59E0B',
      createdAt: '',
      isPinProtected: false,
      list: {
        'm1': { movieId: 'm1', status: 'completed', userRating: 4.5, review: 'Gostei muito', updatedAt: '', isFavorite: false }
      }
    }
  ];

  // If João is looking at m1, he sees Maria's review
  const reviewsForJoao = getFriendReviewsForMovie(profiles, 'm1', 'p1');
  assert.equal(reviewsForJoao.length, 1);
  assert.equal(reviewsForJoao[0].profileName, 'Maria');
  assert.equal(reviewsForJoao[0].userRating, 4.5);
  assert.equal(reviewsForJoao[0].review, 'Gostei muito');
});

test('getSimilarMovies returns related titles based on director or genres', () => {
  const similar = getSimilarMovies(mockMovies, mockMovies[0]);
  assert.ok(similar.length > 0);
  assert.notEqual(similar[0].id, mockMovies[0].id);
});

