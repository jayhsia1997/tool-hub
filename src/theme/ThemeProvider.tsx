import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./themeContext";
import {
  loadThemePreference,
  resolveAppearance,
  saveThemePreference,
  type ThemeAppearance,
  type ThemePreference,
} from "./themeStorage";

function applyAppearance(appearance: ThemeAppearance) {
  document.documentElement.setAttribute("data-theme", appearance);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    const initial = loadThemePreference();
    applyAppearance(resolveAppearance(initial));
    return initial;
  });
  const [systemAppearance, setSystemAppearance] = useState<ThemeAppearance>(() =>
    resolveAppearance(null),
  );

  const appearance = preference ?? systemAppearance;

  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function syncSystem() {
      setSystemAppearance(media.matches ? "dark" : "light");
    }

    syncSystem();
    media.addEventListener("change", syncSystem);
    return () => media.removeEventListener("change", syncSystem);
  }, []);

  function setAppearance(next: ThemeAppearance) {
    saveThemePreference(next);
    setPreference(next);
  }

  return (
    <ThemeContext.Provider value={{ appearance, preference, setAppearance }}>
      {children}
    </ThemeContext.Provider>
  );
}
