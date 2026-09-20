## Problem Statement

Tool Hub currently offers a minimal homepage and a vertically stacked Countdown Timer settings page. Their light styling does not reflect the supplied dark utility reference or the supplied Tool Hub logo. Users need a coherent, focused interface and a clearer relationship between settings and the active countdown without disrupting the existing fullscreen projection experience.

## Solution

Redesign the homepage, Countdown Timer settings, and non-fullscreen preview using charcoal surfaces, warm white text, restrained gold accents, and the supplied monochrome four-tile logo. Present only the existing Countdown Timer capability. Place settings beside the preview on desktop and above it on mobile. Preserve all existing countdown behavior and the entire fullscreen presentation.

## User Stories

1. As a visitor, I want to recognize Tool Hub by its supplied logo and name, so that the interface has a consistent identity.
2. As a visitor, I want a short introduction, so that I can understand the purpose of Tool Hub quickly.
3. As a visitor, I want one featured Countdown Timer card, so that I can open the available tool directly.
4. As a visitor, I want the homepage to represent available capabilities accurately, so that I am not directed toward unavailable tools or controls.
5. As a user, I want consistent dark surfaces and warm white typography, so that the homepage and settings feel cohesive.
6. As a user, I want restrained gold emphasis and clear interaction states, so that I can identify relevant controls.
7. As a desktop user, I want settings on the left and the countdown preview on the right, so that both remain visible while configuring the timer.
8. As a mobile user, I want settings above the preview, so that I can configure and inspect the timer on a narrow screen.
9. As a user without an active countdown, I want a clear prompt to set a Target Time, so that I know how to begin.
10. As a user, I want to enter today's local Target Time with seconds, so that I can count down to a precise time.
11. As a user, I want Title and Completion Message to remain optional, so that I can use a neutral display or customize its text.
12. As a user, I want invalid or past Target Times to remain rejected with visible feedback, so that I can correct my input.
13. As a user, I want Apply to activate valid settings, so that I control when changes take effect.
14. As a user editing an active countdown, I want the existing countdown to continue until I apply valid replacement settings, so that draft edits do not disrupt it.
15. As a user, I want the preview to show the actual remaining time, so that it accurately represents the active countdown.
16. As a user, I want the progress ring to retain its green, amber, and red progression, so that I can recognize increasing time pressure.
17. As a user, I want Cancel countdown to clear the active countdown and saved settings, so that I can start again.
18. As a returning user, I want reload to restore the original dated Target Time, so that the countdown does not restart or shift to another day.
19. As a user, I want the countdown to stop at zero and display my Completion Message when provided, so that completion is clearly communicated.
20. As a presenter, I want fullscreen typography, background, dimensions, placement, and progress colors to remain unchanged, so that the redesign does not disrupt an established projection setup.
21. As a presenter, I want fullscreen to hide settings and retain the existing return control behavior, so that projection remains focused.
22. As a presenter, I want leaving fullscreen to preserve the running countdown, so that I can return to settings without restarting it.
23. As a user, I want to return from the settings page to Tool Hub, so that navigation remains straightforward.
24. As a keyboard user, I want labeled fields and visible focus states, so that I can operate the redesigned interface reliably.

## Implementation Decisions

- Modify the Homepage, Countdown Timer settings, non-fullscreen preview, and their visual styling. Preserve existing routes and navigation destinations.
- Use a brand header, short introduction, and one featured Countdown Timer card. Do not duplicate the reference's larger utility directory or nonfunctional controls.
- Use the user-supplied SVG unchanged as the logo: a rounded dark square containing four monochrome tiles, with a dashed outline on the lower-right tile.
- Use the supplied HTML as visual direction, not as a new feature inventory or a source of product claims. The two supplied HTML attachments are identical.
- Use canvas `#111111`, inset surface `#141414`, card surface `#181818`, raised surface `#1E1E1E`, primary text `#F4F1EA`, secondary text `#8E8A82`, and accent `#B89B5E`. Resolve conflicting values in the existing design reference in favor of this approved palette.
- Use Geist for interface text and JetBrains Mono for numeric readouts and metadata outside fullscreen. Follow the reference's restrained borders, compact rounded cards, and centered content with a maximum width of 1120px. Maintain readable contrast and visible keyboard focus.
- On desktop, arrange settings left and preview right. On mobile, stack settings above preview. Choose the responsive breakpoint according to available space without horizontal overflow.
- Before Apply, show "Set a target time to begin" in the preview region; do not render a simulated running countdown. Cancel returns to this empty state.
- After Apply, show the real active countdown. Draft changes to Title, Target Time, or Completion Message do not update the active display until successfully applied.
- Preserve today's local Target Time semantics, seconds input, optional text fields, validation, clock-based remaining time, persistence, and cancellation behavior.
- Preserve the current completion behavior: a supplied Completion Message replaces the heading while the ring and `00:00:00` remain; otherwise retain the existing title behavior.
- Preserve the progress ring and its existing green, amber, and red thresholds in both preview and projection.
- Isolate new styles so fullscreen preserves its existing fonts, background, sizes, title and ring placement, return-control placement, digit animation, and responsive sizing. Preserve native fullscreen exit and mouse-reveal/idle-hide behavior.
- No backend, schema, API contract, domain terminology, or storage-format changes are required.

## Testing Decisions

The user confirmed the following testing scope.

- Test externally observable behavior through the existing application-level rendering seam with routing. Prefer accessible roles, labels, user interactions, and resulting visible states over CSS class assertions, component internals, or duplicating implementation logic.
- Cover the Homepage and Countdown Timer through the existing app rendering helper. Existing homepage navigation tests and Countdown Timer tests provide prior art for fake-clock control, persistence/remount behavior, and a narrow Fullscreen API substitute.
- Add targeted coverage for the pre-Apply empty state, navigation through the redesigned card, and returning to the empty state after cancellation. Reuse existing regression tests for Apply/draft separation, validation, optional text, completion, saved dated targets, and fullscreen transitions; extend only where a behavior is not already covered.
- Validate the visual redesign in a real browser at desktop and mobile widths: the approved palette and logo, desktop two-column layout, mobile stacking, readable content, visible focus, and absence of clipping or horizontal overflow.
- Capture the existing fullscreen presentation before implementation and compare after implementation at matching viewport and timer states. Verify placement, typography, background, ring dimensions/colors, completion presentation, and return-control behavior. Mocked fullscreen tests alone do not establish visual parity.
- Exercise the real browser journey from homepage through Apply, draft editing, fullscreen entry/exit, and cancellation. Use the existing UI boundary for browser verification; a new browser automation framework is not required by this spec.
- Run the existing test suite, lint, and production build during implementation. This specification work does not claim those checks or browser verification have already run.

## Out of Scope

- Additional tools, search, categories, favorites, user accounts, or new theme-switching controls.
- Pomodoro, duration presets, pause/resume, audible alerts, multiple timers, other target dates, time-zone selection, or cloud synchronization.
- Any fullscreen visual redesign, including fonts, background, dimensions, and layout.
- Reference-only release badges, simulated countdowns, and unsupported privacy/offline claims.
- Changes to timer semantics, persistence contracts, or the completion behavior currently implemented.

## Further Notes

The user approved the visual direction, single-tool homepage, desktop/mobile settings layout, Apply-based preview semantics, and complete preservation of fullscreen presentation in the design discussion. The existing Countdown Timer specification contains stale implementation status and describes completion differently from the current code; this redesign explicitly preserves current behavior rather than using that discrepancy to expand scope.

This is one cohesive redesign in `jayhsia1997/tool-hub`, with no identified external blockers or child-ticket breakdown. The design and testing scope have been confirmed. No new glossary entry or ADR is needed because no domain meaning or consequential architectural trade-off changes.
