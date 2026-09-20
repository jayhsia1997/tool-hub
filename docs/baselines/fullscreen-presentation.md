# Fullscreen presentation baseline (pre-#9)

Captured before homepage visual identity work in #9. Issue #10 must compare projection against this baseline after settings redesign.

## Capture conditions

| Field | Value |
| --- | --- |
| Date (UTC) | 2026-09-20T21:44:08.957Z |
| Viewport | 1280×800, `devicePixelRatio` 2 |
| Route | `/countdown` |
| Title | `Baseline Capture` |
| Target Time (local) | `18:13:04` |
| Remaining (accessible) | ~`00:28:55` (clock-based; drifts with wall time) |
| Completion Message | empty |
| Native fullscreen | Blocked in automation (`Permissions check failed`) |

**Method:** Computed styles and screenshots from the live app. Projecting metrics used the same CSS class and sizing formula as `CountdownTimerPage` (`circleSize = max(280, floor(min(vw,vh)*0.58))`, `strokeWidth = max(12, round(circleSize*0.035))`) because the Fullscreen API is unavailable in the automated browser. Real-browser native fullscreen must still be checked manually for exit and return-control behavior.

## Screenshots

- [fullscreen-preview-before.png](./fullscreen-preview-before.png) — settings + non-fullscreen display (narrow capture)
- [fullscreen-projecting-before.png](./fullscreen-projecting-before.png) — attempting projecting overlay (settings still in DOM when class is forced without React fullscreen state)

## Tokens that must not change in projection

| Token | Value |
| --- | --- |
| `--countdown-bg` | `#0f1419` → `rgb(15, 20, 25)` |
| `--countdown-fg` | `#ffffff` → `rgb(255, 255, 255)` |
| Interface stack (title) | `"Segoe UI", system-ui, sans-serif` |
| Digit stack | `ui-monospace, "Cascadia Code", Consolas, monospace` |

## Projecting layout (`.countdown-page.projecting`)

| Property | Observed |
| --- | --- |
| Position | `fixed`, inset `0` |
| Size | full viewport (`1280×800` in this capture) |
| Background | `rgb(15, 20, 25)` |
| Layout | flex, centered |
| z-index | `10` |
| Padding / margin | `0` |

### Display (`.countdown-display` while projecting)

| Property | Observed |
| --- | --- |
| Background / color | `#0f1419` / `#ffffff` |
| Border radius | `0` |
| Padding / gap | `0` |
| Justify | center |

### Title (`.countdown-title` while projecting)

| Property | Observed / rule |
| --- | --- |
| Position | absolute, top `max(2.5rem, 7vh)` (~56px at 800px height), horizontally centered |
| Font | Segoe UI / system-ui, weight `600` |
| Size | `clamp(2.75rem, 7vw, 5rem)` (~89.6px at 1280px) |
| Color | `#ffffff` |

### Ring and digits

| Property | Observed / rule |
| --- | --- |
| Circle size | `463px` at 1280×800 (`max(280, floor(min(vw,vh)*0.58))`) |
| Stroke width | `16px` (`max(12, round(circleSize*0.035))`) |
| Digits font | original mono stack, weight `600`, size `calc(var(--circle-size) * 0.108)` (~50px) |
| Digit color | `#ffffff`; separators `rgb(255 255 255 / 0.55)` |
| Track stroke | `rgba(255, 255, 255, 0.2)` |
| Progress colors | green `stroke-emerald-500` when remaining fraction > 0.66; amber `stroke-amber-500` when > 0.33; else red `stroke-rose-500` |
| Digit animation | existing `SlidingNumber` behavior unchanged |

### Return control

- Hidden until mousemove while projecting; idle-hide after 2000ms
- Absolute top/right `1.5rem` on `.countdown-page.projecting .countdown-display button`
- Native `exitFullscreen` on activate; countdown keeps running

## Non-fullscreen display (shared tokens)

At preview size (not projecting): circle `200px`, stroke `8px`, title ~`2rem` Segoe UI, digits mono ~`21.6px`, display padding `3rem 1.5rem`, radius `12px`, same `#0f1419` / `#ffffff` tokens.

## Verification after #9 homepage chrome (2026-09-20)

Automated browser check after homepage visual identity (class-forced `.projecting` at 1280×800; native Fullscreen API still blocked in automation):

| Check | Result |
| --- | --- |
| `--countdown-bg` / page background | `#0f1419` / `rgb(15, 20, 25)` — unchanged |
| `--countdown-fg` / title & digits | `#ffffff` — unchanged |
| Projection fonts | Segoe UI / system + original mono — not Geist / JetBrains Mono |
| Chrome canvas | `#111111` with Geist — isolated from projection tokens |
| Homepage desktop/mobile | Readable; no horizontal overflow at 1280 and 390 widths |
| Route | Featured card → `/countdown`; Back to Tool Hub returns home |
| `npm test` / `npm run lint` / `npm run build` | All passed during #9 implementation |

Native fullscreen exit and return-control idle-hide still need a manual pass on a real browser.

## Verification checklist for later tickets

- [ ] Title placement, size clamp, and white color match projecting rules
- [x] Background remains `#0f1419` (not homepage canvas `#111111`) — checked after #9
- [x] Fonts remain Segoe UI / system and the original mono stack (not Geist / JetBrains Mono) — checked after #9
- [ ] Ring size/stroke follow the viewport formula; green → amber → red thresholds unchanged
- [ ] Digits animate; completion message replaces heading when supplied
- [ ] Return control placement and mouse reveal/hide unchanged
- [ ] Settings remain hidden only when truly projecting via Fullscreen API
