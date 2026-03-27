// storage.ts
// SSR-safe localStorage utilities.
// All operations are no-ops on the server and fail silently if storage
// is unavailable (e.g. private browsing with storage blocked).

function isAvailable(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export const storage = {
  get(key: string): string | null {
    if (!isAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    if (!isAvailable()) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // storage quota exceeded or blocked — silently ignore
    }
  },

  remove(key: string): void {
    if (!isAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // silently ignore
    }
  },

  getJSON<T>(key: string): T | null {
    const raw = storage.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  },
};
