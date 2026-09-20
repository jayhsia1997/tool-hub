# Countdown settings redesign validation (#10)

Captured after settings + non-fullscreen preview redesign. Projection styles compared against [fullscreen-presentation.md](./fullscreen-presentation.md).

## Capture conditions

| Field | Value |
| --- | --- |
| Date (local) | 2026-09-20 |
| Desktop viewport | 1280×800, `devicePixelRatio` 2 |
| Mobile viewport | 390×800, `deviceScaleFactor` 2 |
| Route | `/countdown` |
| Title (active captures) | `Baseline Capture` |
| Method | Live Vite app in automated browser + CDP |

## Screenshots

- [countdown-empty-desktop.png](./countdown-empty-desktop.png) — settings left, empty preview right
- [countdown-empty-mobile.png](./countdown-empty-mobile.png) — settings above preview (stacked)
- [countdown-active-desktop.png](./countdown-active-desktop.png) — chrome preview with live ring + digits
- [countdown-projecting-after.png](./countdown-projecting-after.png) — simulated projecting (see Limitations)

## Layout checks

| Check | Result |
| --- | --- |
| Desktop two-column (`≥900px`) | Settings left / preview right; no horizontal overflow |
| Mobile stack (`390px`) | Preview below settings; no horizontal overflow |
| Empty copy | `Set a target time to begin` before Apply and after Cancel |
| Draft edit | Title draft left the active display title unchanged |
| Homepage → countdown | Featured card still opens `/countdown`; dated Target Time restores |

## Chrome preview styles (non-fullscreen)

| Property | Observed |
| --- | --- |
| Preview surface | `rgb(24, 24, 24)` (`#181818`) |
| Title font | Geist / Segoe UI / system-ui |
| Digits font | JetBrains Mono |
| Title / digits color | `rgb(244, 241, 234)` (`#F4F1EA`) |
| Progress thresholds | Unchanged emerald / amber / rose |

## Projection isolation vs #9 baseline

Simulated projecting by overriding `Document.prototype.fullscreenElement` and dispatching `fullscreenchange` (same class of limitation as the #9 baseline when native fullscreen is blocked).

| Property | After (#10) | Baseline (#9) |
| --- | --- | --- |
| Page background | `rgb(15, 20, 25)` | match |
| Page font | `"Segoe UI", system-ui, sans-serif` | match |
| Digits font | `ui-monospace, "Cascadia Code", Consolas, monospace` | match |
| Page layout | `fixed`, full viewport, `z-index: 10` | match |
| Display padding / radius | `0` / `0` | match |
| Title | absolute, top `56px` at 800px height, Segoe UI | match |
| Circle size @ 1280×800 | ~463px (`max(280, floor(min(vw,vh)*0.58))`) | match formula |

Chrome fonts/palette do not appear on the projecting surface.

## Automated checks

- `pnpm test` — 26 passed
- `pnpm lint` — clean
- `pnpm build` — clean

## Limitations

- Native fullscreen entry/exit and mouse-reveal return control were covered by Vitest Fullscreen API mocks; the projecting screenshot used a `fullscreenElement` override rather than a user-gesture `requestFullscreen()`. Re-check native fullscreen on real hardware before shipping if needed.
- Completion-state projecting screenshot was not re-captured; completion still uses the same isolated `.countdown-display` / `.countdown-title` rules verified above.
