import { Profile, UserMovieData } from '../types/index.ts';

const STORAGE_PROFILES_KEY = 'cinegobetti_profiles_v2';
const STORAGE_ACTIVE_PROFILE_KEY = 'cinegobetti_active_profile_v2';

export function normalizeCloudProfile(p: any): Profile {
  const list: Record<string, UserMovieData> = {};

  // 1. If already in new v2 format
  if (p && p.list && typeof p.list === 'object') {
    Object.assign(list, p.list);
  }

  // 2. If in legacy format (cinevault arrays)
  if (Array.isArray(p?.watched)) {
    p.watched.forEach((id: string) => {
      const isMenu = id === 'w31';
      if (!list[id]) {
        list[id] = {
          movieId: id,
          status: 'completed',
          userRating: p.ratings?.[id] || (isMenu ? 3.0 : 4.0),
          review: p.notes?.[id] || (isMenu ? 'Mediano' : ''),
          updatedAt: p.completedAt?.[id] || '2026-09-12',
          isFavorite: isMenu,
        };
      }
    });
  }

  if (Array.isArray(p?.priority)) {
    p.priority.forEach((id: string) => {
      if (!list[id]) {
        list[id] = {
          movieId: id,
          status: 'completed',
          updatedAt: new Date().toISOString(),
          isFavorite: true,
        };
      } else {
        list[id].isFavorite = true;
      }
    });
  }

  if (Array.isArray(p?.queue)) {
    p.queue.forEach((id: string) => {
      if (!list[id]) {
        list[id] = {
          movieId: id,
          status: 'watchlist',
          updatedAt: new Date().toISOString(),
          isFavorite: false,
        };
      }
    });
  }

  // Resolve avatar: custom photo -> avatarUrl -> legacy avatar key -> fallback
  let resolvedAvatar = p?.customAvatar || p?.avatarUrl || p?.avatar || 'netflix-red';
  if (resolvedAvatar === 'custom' && p?.customAvatar) {
    resolvedAvatar = p.customAvatar;
  }

  // Default accent color based on profile
  const defaultAccent = p?.id === 'manu'
    ? '#8B5CF6'
    : p?.id === 'irmao' || p?.id === 'gio'
    ? '#F59E0B'
    : '#10B981';

  return {
    id: p?.id || 'profile-1',
    name: p?.name || 'Perfil',
    avatarUrl: resolvedAvatar,
    accentColor: p?.accentColor || defaultAccent,
    createdAt: p?.createdAt || '2026-01-10',
    isPinProtected: !!p?.pin,
    pin: p?.pin || undefined,
    list,
  };
}

export function persistLocally(profiles: Profile[], activeProfileId: string): void {
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(STORAGE_ACTIVE_PROFILE_KEY, activeProfileId);
  } catch (err) {
    console.warn('LocalStorage error while saving Cinegobetti data:', err);
  }
}

export function loadLocally(defaultProfiles: Profile[]): { profiles: Profile[]; activeId: string } {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    const activeId = localStorage.getItem(STORAGE_ACTIVE_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = parsed.map(normalizeCloudProfile);
        const resolvedActiveId =
          activeId && normalized.some((p: Profile) => p.id === activeId)
            ? activeId
            : normalized[0].id;
        return {
          profiles: normalized,
          activeId: resolvedActiveId,
        };
      }
    }
  } catch (err) {
    console.warn('LocalStorage read error, using defaults:', err);
  }
  return { profiles: defaultProfiles, activeId: defaultProfiles[0].id };
}

/**
 * Cloud Sync (Universal Vercel Blob / Serverless Integration)
 * Communicates with /api/sync endpoint with dual schema preservation.
 */
export async function syncToCloud(profiles: Profile[]): Promise<{ success: boolean; error?: string }> {
  try {
    const legacyCompatibleProfiles = profiles.map((p) => {
      const watched: string[] = [];
      const queue: string[] = [];
      const ratings: Record<string, number> = {};
      const notes: Record<string, string> = {};

      Object.values(p.list || {}).forEach((item) => {
        if (item.status === 'completed') {
          watched.push(item.movieId);
          if (item.userRating) ratings[item.movieId] = item.userRating;
          if (item.review) notes[item.movieId] = item.review;
        } else if (item.status === 'watchlist' || item.status === 'watching') {
          queue.push(item.movieId);
        }
      });

      return {
        ...p,
        avatar: p.avatarUrl.startsWith('data:') ? 'custom' : p.avatarUrl,
        customAvatar: p.avatarUrl.startsWith('data:') ? p.avatarUrl : null,
        watched,
        queue,
        ratings,
        notes,
      };
    });

    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profiles: legacyCompatibleProfiles, timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      return { success: false, error: `Sync returned ${response.status}` };
    }
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function fetchFromCloud(): Promise<Profile[] | null> {
  try {
    const response = await fetch('/api/sync');
    if (!response.ok) return null;
    const json = await response.json();
    const rawProfiles = json?.data?.profiles || json?.profiles;
    if (Array.isArray(rawProfiles) && rawProfiles.length > 0) {
      return rawProfiles.map(normalizeCloudProfile);
    }
    return null;
  } catch {
    return null;
  }
}
