import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "./test/renderApp";
import { THEME_STORAGE_KEY } from "./theme/themeStorage";

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
    expect(screen.getByRole("searchbox", { name: /search tools/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /starred/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /documentation/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /keyboard shortcuts/i })).toBeInTheDocument();

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

  it("follows system Light from the initial render before any manual choice", () => {
    mockMatchMedia(false);
    renderApp("/");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(screen.getByRole("button", { name: /use dark theme/i })).toBeInTheDocument();
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

  it("searches tools by name, description, and tags across available and Coming soon entries", async () => {
    const user = userEvent.setup();
    renderApp("/");

    const search = screen.getByRole("searchbox", { name: /search tools/i });
    const tools = () => screen.getByRole("list", { name: /tools/i });

    await user.type(search, "Markdown");
    expect(within(tools()).getAllByRole("listitem")).toHaveLength(1);
    expect(within(tools()).getByText(/markdown live preview/i)).toBeInTheDocument();
    expect(screen.getByText(/^1 tools?$/i)).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "luminance");
    expect(within(tools()).getByText(/color contrast & palette/i)).toBeInTheDocument();
    expect(within(tools()).getAllByRole("listitem")).toHaveLength(1);

    await user.clear(search);
    await user.type(search, "fullscreen");
    expect(within(tools()).getByText(/countdown timer/i)).toBeInTheDocument();
    expect(within(tools()).getAllByRole("listitem")).toHaveLength(1);
  });

  it("intersects category filters with search and derives counts from matching tools", async () => {
    const user = userEvent.setup();
    renderApp("/");

    expect(screen.getByRole("button", { name: /^all \(10\)$/i })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: /time & productivity/i }));
    expect(screen.getByRole("button", { name: /time & productivity/i })).toHaveAttribute("aria-pressed", "true");

    const tools = () => screen.getByRole("list", { name: /tools/i });
    const timeItems = within(tools()).getAllByRole("listitem");
    expect(timeItems).toHaveLength(3);
    expect(screen.getByText(/^3 tools$/i)).toBeInTheDocument();
    expect(within(tools()).getByText(/countdown timer/i)).toBeInTheDocument();
    expect(within(tools()).getByText(/stopwatch & split laps/i)).toBeInTheDocument();
    expect(within(tools()).getByText(/unix timestamp converter/i)).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox", { name: /search tools/i }), "unix");
    expect(within(tools()).getAllByRole("listitem")).toHaveLength(1);
    expect(within(tools()).getByText(/unix timestamp converter/i)).toBeInTheDocument();
    expect(screen.getByText(/^1 tools?$/i)).toBeInTheDocument();
  });

  it("shows no-results feedback and clears only the query while keeping the category", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("button", { name: /developer/i }));
    await user.type(screen.getByRole("searchbox", { name: /search tools/i }), "zzzz-no-match");

    expect(screen.queryByRole("list", { name: /tools/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /no matching tools found/i })).toBeInTheDocument();
    expect(screen.getByText(/^0 tools$/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear search query/i }));

    expect(screen.getByRole("searchbox", { name: /search tools/i })).toHaveValue("");
    expect(screen.getByRole("button", { name: /developer/i })).toHaveAttribute("aria-pressed", "true");
    expect(within(screen.getByRole("list", { name: /tools/i })).getAllByRole("listitem").length).toBeGreaterThan(0);
    expect(within(screen.getByRole("list", { name: /tools/i })).getByText(/json formatter & validator/i)).toBeInTheDocument();
  });

  it("focuses search with slash, Command+K, and Control+K, and Escape clears and leaves search", async () => {
    const user = userEvent.setup();
    renderApp("/");

    const search = screen.getByRole("searchbox", { name: /search tools/i });
    expect(search).not.toHaveFocus();

    await user.keyboard("/");
    expect(search).toHaveFocus();

    await user.type(search, "timer");
    await user.keyboard("{Escape}");
    expect(search).toHaveValue("");
    expect(search).not.toHaveFocus();
    expect(within(screen.getByRole("list", { name: /tools/i })).getAllByRole("listitem")).toHaveLength(10);

    await user.keyboard("{Meta>}k{/Meta}");
    expect(search).toHaveFocus();
    await user.keyboard("{Escape}");

    await user.keyboard("{Control>}k{/Control}");
    expect(search).toHaveFocus();
  });

  it("does not steal focus from another editable control for search shortcuts", async () => {
    const user = userEvent.setup();
    renderApp("/");

    const other = document.createElement("input");
    other.setAttribute("aria-label", "Other field");
    document.body.appendChild(other);
    other.focus();
    expect(other).toHaveFocus();

    await user.keyboard("/");
    expect(other).toHaveFocus();
    expect(screen.getByRole("searchbox", { name: /search tools/i })).not.toHaveFocus();

    await user.keyboard("{Meta>}k{/Meta}");
    expect(other).toHaveFocus();

    await user.keyboard("{Control>}k{/Control}");
    expect(other).toHaveFocus();

    other.remove();
  });

  it("lets keyboard users open and dismiss the Keyboard Shortcuts explanation and return focus", async () => {
    const user = userEvent.setup();
    renderApp("/");

    const trigger = screen.getByRole("button", { name: /keyboard shortcuts/i });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: /keyboard shortcuts/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/focus search/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/clear and leave search/i)).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /keyboard shortcuts/i })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
