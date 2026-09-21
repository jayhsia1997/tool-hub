## Problem Statement

Tool Hub currently presents one Countdown Timer card in a dark-only interface. Users need the richer tool directory shown in the supplied Luxury Dark and Luxury Light homepage references, with working discovery controls, clear availability, and consistent theme choices across the entire application. The references contain placeholder controls, an inaccurate tool count, a simulated timer, and inconsistent Light interactions; reproducing those defects would mislead users.

## Solution

Build a responsive Luxury homepage with a searchable, categorized, star-enabled directory. Place the available Countdown Timer first and display the other nine reference tools as Coming soon. Remove the entire Featured section and all homepage timer previews. Extend Dark and Light themes to the homepage, Countdown Timer settings, preview, and fullscreen. Use Geist throughout and rebuild the interface with Tailwind CSS and reusable components while preserving existing countdown behavior.

## User Stories

1. As a visitor, I want to recognize the existing Tool Hub logo, so that the refreshed site retains its identity.
2. As a visitor, I want a concise English introduction, so that I understand the directory's purpose.
3. As a visitor, I want the Luxury layout and palette on desktop and mobile, so that the interface remains coherent at different screen sizes.
4. As a visitor, I want Countdown Timer first in the unfiltered tool grid, so that I can find the available tool immediately.
5. As a visitor, I want the nine upcoming tools clearly marked Coming soon, so that I know their availability before trying to open them.
6. As a visitor, I want accurate tool counts, so that the directory does not advertise nonexistent entries.
7. As a visitor, I want to open Countdown Timer from its card, so that I can use the existing tool.
8. As a visitor, I want unavailable tools to avoid leading to empty pages, so that I do not encounter misleading navigation.
9. As a visitor, I want no Featured section or timer preview on the homepage, so that the page remains a tool directory.
10. As a user, I want to search tool names, descriptions, and tags, so that I can find relevant capabilities.
11. As a user, I want search to include available and Coming soon tools, so that I can discover the whole catalog.
12. As a user, I want category filtering, so that I can narrow the catalog by purpose.
13. As a user, I want search and category filters to intersect, so that results satisfy both selections.
14. As a user, I want a helpful no-results state and clear-search action, so that I can recover from an unsuccessful search.
15. As a keyboard user, I want slash, Command+K, or Control+K to focus search, so that I can access discovery quickly.
16. As a keyboard user, I want Escape to clear and leave search, so that I can return to browsing.
17. As a user entering text in another control, I want search shortcuts to leave my input alone, so that typing is not interrupted.
18. As a user, I want to star and unstar any tool, so that I can organize both available and upcoming tools.
19. As a user, I want a Starred view, so that I can find my favorites together.
20. As a returning user, I want my favorites retained locally, so that I do not need to select them again after reloading.
21. As a first-time user, I want the interface to follow my system theme, so that it matches my preference without setup.
22. As a user, I want to select Dark or Light manually, so that I can choose the appearance I prefer.
23. As a returning user, I want my manual theme choice preserved across navigation and reloads, so that the interface remains consistent.
24. As a user, I want the homepage, timer settings, and preview to share the selected theme, so that moving between them feels coherent.
25. As a presenter, I want fullscreen to use the selected theme and Geist, so that projection follows the application's visual choice.
26. As a presenter, I want stable numeric alignment while digits change, so that the countdown remains readable.
27. As a user, I want consistent Geist typography across labels and numeric displays, so that the interface has one typographic system.
28. As a user, I want readable contrast and visible keyboard focus in both themes, so that I can operate every control reliably.
29. As a mobile user, I want accessible discovery controls and no horizontal overflow, so that I can browse on a narrow screen.
30. As a user, I want a Keyboard Shortcuts explanation, so that I can learn supported actions.
31. As a user, I want GitHub and Feedback links to reach the actual project and its issues, so that I can inspect or discuss the product.
32. As a visitor, I want accurate capability copy without unsupported version, offline, or privacy claims, so that I can trust what the interface says.
33. As a Countdown Timer user, I want today's local Target Time validation and optional text fields preserved, so that familiar configuration continues to work.
34. As a Countdown Timer user, I want draft edits to take effect only after a valid Apply, so that editing does not disrupt the active countdown.
35. As a returning Countdown Timer user, I want the original dated Target Time restored, so that reloading does not restart or shift the countdown.
36. As a Countdown Timer user, I want existing completion and cancellation behavior preserved, so that the redesign does not alter my workflow.
37. As a presenter, I want existing progress-ring color thresholds preserved, so that time pressure remains recognizable in either theme.
38. As a presenter, I want to enter and leave fullscreen without restarting the countdown, so that presentation remains reliable.

## Implementation Decisions

- Modify the homepage, application theme handling, Countdown Timer presentation, and shared interface components. Keep existing timer routes and behavior.
- Use the two supplied Luxury HTML references as visual baselines, with the explicitly approved exceptions. Retain the header, introduction, discovery controls, tool grid, appropriate informational content, and footer. Remove the entire Featured section, its controls and presets, and every homepage countdown preview.
- The directory has ten tools. Countdown Timer is the first default-grid entry and the only available tool. Mark Stopwatch & Split Laps, Unix Timestamp Converter, JSON Formatter & Validator, Base64 & URL Encoder, Regex Tester & Cheatsheet, Color Contrast & Palette, Markdown Live Preview, UUID & ULID Generator, and Text & Code Diff Checker as Coming soon. Do not implement those tools or link them to placeholder pages.
- Use shared tool metadata for names, descriptions, tags, categories, availability, and accurate counts. Search all tool names, descriptions, and tags; intersect search with category filtering. Provide no-results feedback and a clear-query action.
- Implement slash, Command+K, and Control+K search focus, with Escape clearing and leaving search. Avoid capturing these shortcuts from other editable controls. Provide the Keyboard Shortcuts explanation as an operable, accessible interface.
- Allow starring and unstarring all tools. Persist favorites locally and show them in Starred. A Coming soon card's favorite action remains usable independently of its unavailable open action.
- Initially follow the system theme, including system preference changes while no manual override exists. A manual Dark or Light selection is persisted locally and shared across routes and reloads.
- Apply both themes to the homepage, settings, preview, and fullscreen. Use Geist everywhere, including numeric displays, with tabular numerals for stable countdown alignment. Preserve existing progress-ring color thresholds and timer behavior.
- Reuse the existing Tailwind CSS setup, theme tokens, and suitable UI primitives. Rebuild styling with Tailwind CSS and extract reusable elements such as buttons, cards, discovery controls, theme controls, and shared page chrome where reuse warrants them. Do not copy the reference runtime scripts or dark-only filter class manipulation.
- Use the Dark reference's charcoal surfaces, warm cream text, and restrained gold accents. Use the Light reference's warm canvas, white cards, dark text, and restrained gold accents. Preserve the centered layout and responsive grid intent, adapting mobile padding and header spacing for readability and no clipping.
- Keep English copy and the existing Tool Hub logo. Remove account and Documentation controls. Link GitHub to https://github.com/jayhsia1997/tool-hub and Feedback to https://github.com/jayhsia1997/tool-hub/issues. Remove placeholder links and unsupported release/version, offline, and privacy claims.
- Preserve today's local Target Time semantics, seconds, validation, optional Title and Completion Message, Apply/draft separation, clock-based updates, cancellation, saved dated targets, and current completion behavior. Preserve fullscreen entry/exit and return-control behavior; the approved font and theme changes replace the prior requirement for unchanged fullscreen typography and colors.
- No backend or API changes are required. Theme and favorites are local preferences; do not change the existing countdown persistence contract.

## Testing Decisions

The user confirmed the interaction, regression, and real-browser testing scope during the requirements interview. Reuse the existing application-level rendering seam with routing as the primary automated boundary; a new lower-level feature-testing architecture is unnecessary.

- Test external behavior through accessible roles, labels, keyboard and pointer actions, navigation, and visible outcomes. Avoid assertions about component internals, Tailwind class strings, or duplicated implementation logic.
- Extend homepage coverage for the ten-tool catalog, availability, absence of Featured and timer previews, Countdown Timer navigation, search across supported metadata, combined category filtering, accurate counts, empty results, and clearing search.
- Cover favorite toggling for available and Coming soon tools, the Starred view, and persistence across remounts. Verify unavailable tools cannot open while their favorite controls remain operable.
- Cover search shortcuts and editable-field protection, plus the shortcut explanation's user-facing interaction.
- Cover system-theme initialization, system changes before manual selection, manual override, persistence, and cross-route consistency. Substitute only the browser preference boundary where jsdom needs it; keep assertions at the application boundary. Verify actual colors and typography in the browser.
- Prior art includes the existing application rendering helper with MemoryRouter, homepage navigation tests, Countdown Timer tests with controlled clocks and persistence/remounts, and the narrow Fullscreen API substitute.
- Reuse existing timer regressions for validation, optional text, Apply/draft separation, time boundaries, completion, cancellation, persisted dated targets, and fullscreen transitions. Extend only where the new behavior requires coverage.
- Validate both themes in a real browser at desktop and mobile sizes: reference fidelity subject to approved exceptions, Geist, readable contrast, visible focus, responsive grid and controls, and no clipping or horizontal overflow.
- Exercise the homepage-to-timer journey and real fullscreen entry/exit in both themes. Verify presentation colors, stable numeric alignment, progress-ring colors, and uninterrupted countdown behavior. Mocked fullscreen tests alone do not establish visual correctness.
- Run the existing test suite, lint, and production build during implementation. Record checks and browser evidence; this spec does not claim they have run.

## Out of Scope

- Implementing any of the nine Coming soon utilities or creating placeholder tool pages.
- Featured content, simulated or active homepage timer previews, and homepage Pomodoro controls.
- Accounts, cloud synchronization, new documentation pages, backend services, or API changes.
- New timer modes, duration presets, pause/resume, audible alerts, multiple timers, other target dates, or time-zone selection.
- Changes to existing timer semantics, completion behavior, or the countdown storage contract.
- Unsupported product claims and reference-only release badges.

## Further Notes

This is one cohesive feature specification for jayhsia1997/tool-hub, with no identified external dependency or requested child-ticket breakdown. The user confirmed the design and testing scope and requested publication through to-spec. Publishing this specification does not implement the feature.

This scope supersedes the earlier dark utility redesign issue #8 where it restricts the homepage to one featured tool, excludes discovery/favorites/theme switching, prescribes mixed fonts, or requires unchanged fullscreen fonts and colors. Its unaffected timer behavior requirements remain applicable. Do not close or alter the older issue as part of publishing this spec.

The supplied HTML files are visual references, not working feature contracts: their count of twelve is inaccurate, most controls are placeholders, and the Light filter script applies Dark styles. Current copies are local untracked inputs and must accompany implementation handoff for visual comparison. Their unavailable-tool functionality and unsupported claims must not be inferred as requirements.

The domain glossary now defines Tool, Coming soon, and Starred. No ADR is required for these reversible presentation and interaction decisions. Preserve unrelated working-tree changes during implementation.
