export const FAVORITES_STORAGE_KEY = "tool-hub.favorites";

export function loadFavoriteIds(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids: readonly string[]): void {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...ids]));
}
