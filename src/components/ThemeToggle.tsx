import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/useTheme";

export function ThemeToggle() {
  const { appearance, setAppearance } = useTheme();
  const next = appearance === "dark" ? "light" : "dark";
  const label = next === "light" ? "Use light theme" : "Use dark theme";

  return (
    <Button type="button" variant="ghost" size="icon" aria-label={label} onClick={() => setAppearance(next)}>
      {appearance === "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
