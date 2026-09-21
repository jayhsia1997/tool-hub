export const THEME_STORAGE_KEY = "tool-hub.theme";

export type ThemeAppearance = "dark" | "light";
export type ThemePreference = ThemeAppearance | null;

export function loadThemePreference(): ThemePreference {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return null;
}

export function saveThemePreference(preference: ThemeAppearance) {
  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
}

export function readSystemAppearance(): ThemeAppearance {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveAppearance(preference: ThemePreference): ThemeAppearance {
  return preference ?? readSystemAppearance();
}
