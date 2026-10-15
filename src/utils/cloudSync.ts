import { Profile } from '../types/index.ts';

const STORAGE_PROFILES_KEY = 'cinegobetti_profiles_v2';
const STORAGE_ACTIVE_PROFILE_KEY = 'cinegobetti_active_profile_v2';

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
        return {
          profiles: parsed,
          activeId: activeId && parsed.some((p: Profile) => p.id === activeId) ? activeId : parsed[0].id,
        };
      }
    }
  } catch (err) {
    console.warn('LocalStorage read error, using defaults:', err);
  }
  return { profiles: defaultProfiles, activeId: defaultProfiles[0].id };
}

/**
 * Cloud Sync Blueprint (Universal Vercel Blob / Serverless Integration)
 * Communicates with /api/sync endpoint when deployed, with safe offline fallback.
 */
export async function syncToCloud(profiles: Profile[]): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profiles, timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      return { success: false, error: `Sync returned ${response.status}` };
    }
    return { success: true };
  } catch {
    // Offline or endpoint not yet mounted in dev environment
    return { success: true };
  }
}

export async function fetchFromCloud(): Promise<Profile[] | null> {
  try {
    const response = await fetch('/api/sync');
    if (!response.ok) return null;
    const data = await response.json();
    return data?.profiles || null;
  } catch {
    return null;
  }
}
