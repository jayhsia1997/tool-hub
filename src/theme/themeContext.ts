import { createContext } from "react";
import type { ThemeAppearance, ThemePreference } from "./themeStorage";

export type ThemeContextValue = {
  appearance: ThemeAppearance;
  preference: ThemePreference;
  setAppearance: (appearance: ThemeAppearance) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
