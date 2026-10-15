import { describe, it, expect } from 'bun:test';
import { MOVIES_DATA, DEFAULT_PROFILES } from '../data/movies.ts';
import { AVATAR_OPTIONS } from '../data/avatars.ts';
import { normalizeCloudProfile } from './cloudSync.ts';

describe('Cinegobs Integration & Data Integrity', () => {
  it('contains the complete catalog of 217 movies/series', () => {
    expect(MOVIES_DATA.length).toBe(217);
  });

  it('preserves Manu profile with 47 watched movies and specific review', () => {
    const manu = DEFAULT_PROFILES.find((p) => p.id === 'manu');
    expect(manu).toBeDefined();
    expect(manu!.name).toBe('Manu');

    // Count watched movies in list (mapped to status: 'completed' in Cinegobs)
    const watchedKeys = Object.keys(manu!.list || {}).filter(
      (k) => manu!.list[k].status === 'completed'
    );
    expect(watchedKeys.length).toBe(47);

    // Check movie w31 (O Menu)
    const w31 = manu!.list['w31'];
    expect(w31).toBeDefined();
    expect(w31.userRating).toBe(3.0);
    expect(w31.review).toBe('Mediano');
  });

  it('normalizes legacy cloud profiles without losing watched list or notes', () => {
    const legacyCloudData = {
      id: 'manu',
      name: 'Manu',
      avatarUrl: '/imgs/icon.png',
      watched: ['w1', 'w2', 'w31'],
      queue: ['w3', 'w4'],
      ratings: { w31: 3.0 },
      notes: { w31: 'Mediano' },
    };

    const normalized = normalizeCloudProfile(legacyCloudData, DEFAULT_PROFILES[0]);
    expect(normalized.id).toBe('manu');
    expect(normalized.list['w1'].status).toBe('completed');
    expect(normalized.list['w2'].status).toBe('completed');
    expect(normalized.list['w3'].status).toBe('watchlist');
    expect(normalized.list['w31'].userRating).toBe(3.0);
    expect(normalized.list['w31'].review).toBe('Mediano');
  });

  it('provides a full selection of 18 avatar options', () => {
    expect(AVATAR_OPTIONS.length).toBe(18);
    const cinegobettiIcons = AVATAR_OPTIONS.filter((a) => a.category === 'Cinegobetti');
    expect(cinegobettiIcons.length).toBe(3);
  });

  it('ensures geral profile starts with an empty list and does not clone legacy watched array', () => {
    const geralDefault = DEFAULT_PROFILES.find((p) => p.id === 'geral');
    expect(geralDefault).toBeDefined();
    expect(Object.keys(geralDefault!.list || {}).length).toBe(0);

    const legacyGeralData = {
      id: 'geral',
      name: 'Geral',
      watched: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'],
      queue: ['w10', 'w11'],
    };

    const normalized = normalizeCloudProfile(legacyGeralData);
    expect(normalized.id).toBe('geral');
    expect(Object.keys(normalized.list).length).toBe(0);
  });
});
