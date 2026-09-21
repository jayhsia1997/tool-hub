import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "./theme/themeStorage";
import { renderApp } from "./test/renderApp";

const COMING_SOON_NAMES = [
  "Stopwatch & Split Laps",
  "Unix Timestamp Converter",
  "JSON Formatter & Validator",
  "Base64 & URL Encoder",
  "Regex Tester & Cheatsheet",
  "Color Contrast & Palette",
  "Markdown Live Preview",
  "UUID & ULID Generator",
  "Text & Code Diff Checker",
] as const;

function mockMatchMedia(matchesDark: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mediaQueryList = {
    matches: matchesDark,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    dispatchEvent: () => false,
    emit(matches: boolean) {
      mediaQueryList.matches = matches;
      const event = { matches, media: mediaQueryList.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };

  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => {
      if (query === "(prefers-color-scheme: dark)") {
        return mediaQueryList;
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      };
    }),
  );

  return mediaQueryList;
}

describe("Tool Hub homepage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    mockMatchMedia(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("shows branding, introduction, ten-tool catalog, and accurate counts without Featured or previews", () => {
    renderApp("/");

    expect(screen.getByRole("img", { name: /tool hub/i })).toBeInTheDocument();
    expect(within(screen.getByRole("banner")).getByText(/^tool hub$/i)).toBeInTheDocument();
    expect(screen.getByText(/a collection of focused tools/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /precision tools for everyday focus/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/focused tools for everyday work/i)).toBeInTheDocument();
    expect(screen.getByText(/^10 tools$/i)).toBeInTheDocument();

    expect(screen.queryByText(/^featured$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/featured core utility/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pomodoro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/set a target time to begin/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /starred/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /documentation/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /keyboard shortcuts/i })).not.toBeInTheDocument();

    const tools = screen.getByRole("list", { name: /tools/i });
    const items = within(tools).getAllByRole("listitem");
    expect(items).toHaveLength(10);

    const links = within(tools).getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName(/countdown timer/i);
    expect(links[0]).toHaveAttribute("href", "/countdown");
    expect(items[0]).toHaveTextContent(/countdown timer/i);
    expect(items[0]).toHaveTextContent(/available/i);

    for (const name of COMING_SOON_NAMES) {
      expect(within(tools).getByText(name)).toBeInTheDocument();
    }
    expect(within(tools).getAllByText(/coming soon/i)).toHaveLength(9);
  });

  it("lets a user open Countdown Timer and return home, while Coming soon tools do not navigate", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("link", { name: /countdown timer/i }));

    expect(screen.getByRole("heading", { name: /countdown timer/i })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /back to tool hub/i }));

    expect(within(screen.getByRole("banner")).getByText(/^tool hub$/i)).toBeInTheDocument();

    const tools = screen.getByRole("list", { name: /tools/i });
    expect(within(tools).queryByRole("link", { name: /stopwatch/i })).not.toBeInTheDocument();
    expect(within(tools).getByText(/stopwatch & split laps/i)).toBeInTheDocument();
  });

  it("links GitHub and Feedback to the real project destinations", () => {
    renderApp("/");

    const github = screen.getByRole("link", { name: /github/i });
    expect(github).toHaveAttribute("href", "https://github.com/jayhsia1997/tool-hub");

    const feedback = screen.getByRole("link", { name: /feedback/i });
    expect(feedback).toHaveAttribute("href", "https://github.com/jayhsia1997/tool-hub/issues");
  });

  it("follows the system theme until a manual choice is stored, then keeps that choice across routes and remounts", async () => {
    const user = userEvent.setup();
    const media = mockMatchMedia(true);

    const { unmount } = renderApp("/");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    act(() => {
      media.emit(false);
    });
    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    await user.click(screen.getByRole("button", { name: /use dark theme/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    act(() => {
      media.emit(true);
    });
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(screen.getByRole("link", { name: /countdown timer/i }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("button", { name: /use light theme/i })).toBeInTheDocument();

    unmount();
    renderApp("/countdown");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
