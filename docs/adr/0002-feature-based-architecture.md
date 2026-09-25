# Feature-based application architecture

Status: Approved. Decisions Q1-Q14 and the consolidated design were confirmed
through Q15 on 2026-09-21. Implementation has not started.

The current pages and global stylesheet combine multiple responsibilities,
making ownership and future tool additions harder to manage. Adopt app, feature,
and shared boundaries with explicit feature entry points and enforced dependency
direction, preserving existing behavior and browser data. This adds composition
and migration work compared with simply moving files, but makes ownership and
cross-feature dependencies explicit without introducing service abstractions.

## Confirmed scope

- Organize the application around `app`, `features`, `shared`, and `test` to
  clarify ownership and provide a consistent home for future tools. Create
  directories only when they contain needed code; avoid speculative frameworks.
- Preserve existing UI, routes, interactions, and compatibility with saved
  browser data. Moving files, separating responsibilities, and adjusting
  dependencies are in scope; product and visual changes are separate work.
- Exclude remote API, backend, authentication, and external service integration
  scaffolding. Do not add QueryProvider, AuthProvider, HTTP clients, or MSW.
- Retain required browser capabilities, including localStorage, fullscreen, and
  system theme detection. Keep existing GitHub and Feedback links.
- Colocate tests with the code they exercise without requiring a matching test
  for every component, hook, or utility. Preserve application-level behavioral
  integration tests as the primary seam; add unit tests only for independently
  valuable logic. Keep shared setup, render helpers, and browser substitutes in
  `src/test`.

## Confirmed module design

- Use `features/tool-directory` for the homepage, catalog, search, categories,
  Starred, favorites persistence, and directory shortcuts. Do not split search
  or favorites into standalone features yet.
- Use `features/countdown-timer` for settings, countdown state, projection,
  pure time calculations, and countdown persistence. Future implemented tools
  receive their own features.
- Treat theme as a shared capability; app composes providers and routes.
- Separate discovery controls and ToolCard from homepage orchestration. Separate
  countdown/apply state, projection lifecycle, settings, and readout from the
  countdown page. Keep feature-specific calculations and storage private to
  their feature; do not add generic service or repository abstractions.
- Production dependency direction is `app -> features -> shared`, with direct
  `app -> shared` dependencies allowed. Shared must not import app or features.
  Features must not import app or other features; app composes cross-feature
  interactions.
- Split styles by ownership while preserving existing class names, Tailwind,
  CSS conventions, cascade, and visual results. Centralize global tokens and
  base styles; colocate feature styles. Do not introduce CSS Modules here.
- Retain the current Google Fonts delivery of Geist. This refactor does not
  establish a fully offline or network-free runtime.

## Composition and public boundaries

- App owns routes and site layout. Supply the countdown feature with a render
  prop that wraps its ordinary workspace in the app layout. During projection,
  render the projection directly. Keep the feature owner mounted across this
  transition so draft and applied countdown state are not reset.
- App supplies directory-specific footer content through a layout slot. The
  directory feature owns its shortcuts trigger/dialog interaction; layout does
  not infer directory behavior from the current URL.
- Each feature has an explicit `index.ts` exporting only the page or composition
  entries needed by app. Internal imports address internal modules directly,
  not the feature's own index. Do not create a shared-wide barrel.
- Enforce production dependency direction, feature public entry points, and
  the ban on cross-feature imports with ESLint. Cover alias and relative imports,
  including re-exports. Product code must not import test support.
- App-level journey tests live beside app code, even when they exercise one
  feature. Independent feature/component/function tests live beside their
  subject. Test support may import App for `renderApp`; this test-only dependency
  is not a production-layer violation.
- Promote code to shared only when it has established cross-feature value or
  is a domain-neutral primitive/utility. Countdown calculations, projection,
  and favorites storage remain feature-owned. Theme, UI primitives, and `cn`
  belong in shared. Avoid speculative generic storage hooks or global types.

## Target structure

Names below describe the intended concrete mapping; small internal filenames
may be refined during implementation without changing the approved ownership.
Tests are added only when their behavior warrants independent coverage.

```text
src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── CountdownTimer.test.tsx
│   ├── layout.tsx
│   ├── layout.css
│   ├── routes/
│   │   └── AppRoutes.tsx
│   └── providers/
│       └── AppProviders.tsx
├── features/
│   ├── tool-directory/
│   │   ├── index.ts
│   │   ├── ToolDirectoryPage.tsx
│   │   ├── tool-directory.css
│   │   ├── catalog.ts
│   │   ├── favoritesStorage.ts
│   │   ├── components/
│   │   │   ├── DiscoveryControls.tsx
│   │   │   ├── ToolCard.tsx
│   │   │   ├── DirectoryShortcuts.tsx
│   │   │   └── KeyboardShortcutsDialog.tsx
│   │   └── hooks/
│   │       └── useToolDirectory.ts
│   └── countdown-timer/
│       ├── index.ts
│       ├── CountdownTimerPage.tsx
│       ├── countdown-timer.css
│       ├── countdownTime.ts
│       ├── countdownStorage.ts
│       ├── components/
│       │   ├── CountdownSettings.tsx
│       │   └── CountdownReadout.tsx
│       └── hooks/
│           ├── useCountdown.ts
│           └── useProjection.ts
├── shared/
│   ├── components/
│   │   ├── ToolHubLogo.tsx
│   │   ├── ui/
│   │   │   └── ...existing primitives
│   │   └── examples/
│   │       └── circle-progress-demo.tsx
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── themeContext.ts
│   │   ├── themeStorage.ts
│   │   └── useTheme.ts
│   ├── lib/
│   │   ├── isEditableTarget.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── assets/
│   └── ...existing assets
└── test/
    ├── setup.ts
    ├── renderApp.tsx
    └── fullscreenMock.ts
```

`AppProviders` composes the existing ThemeProvider. `main.tsx` retains React root,
StrictMode, and BrowserRouter; tests continue to supply MemoryRouter. Do not
introduce framework file-routing semantics, lazy routes, a new global state
library, or new application providers. `layout.tsx` is an ordinary React module.
Feature-local types remain near their owning logic unless a dedicated file is
actually useful. Existing assets and the UI example are retained, not removed
as incidental cleanup.

## Existing file mapping

| Existing source | Destination and treatment |
| --- | --- |
| `src/App.tsx` | `app/App.tsx`, with route and provider composition extracted |
| `src/HomePage.tsx` | `features/tool-directory/ToolDirectoryPage.tsx`, with controls, card, and discovery state separated |
| `src/tools/catalog.ts`, `src/favoritesStorage.ts` | Private modules in `features/tool-directory` |
| `src/CountdownTimerPage.tsx` | Countdown feature page, settings/readout components, countdown/projection hooks |
| `src/countdownTime.ts`, `src/countdownStorage.ts` | Private modules in `features/countdown-timer`; preserve storage key and schema |
| `src/components/SiteChrome.tsx` | `app/layout.tsx`; directory behavior supplied through a slot |
| `src/components/KeyboardShortcutsDialog.tsx` | Directory feature; trigger/dialog orchestration owned by DirectoryShortcuts |
| `src/theme/*`, `src/components/ThemeToggle.tsx` | `shared/theme`; preserve the initial theme contract with `index.html` |
| `src/components/ToolHubLogo.tsx`, `src/components/ui/*`, `src/components/examples/*` | Corresponding `shared/components` locations |
| `src/lib/*` | `shared/lib` |
| `src/index.css` | `shared/styles/globals.css`; preserve Tailwind entry, tokens, and base styles |
| `src/App.css` | App layout styles and feature-owned styles, preserving cascade |
| `src/App.test.tsx`, `src/CountdownTimerPage.test.tsx` | App-level integration test files under `app` |
| `src/test/*` | Retain support location and update imports |

Feature stylesheet loading must respect the public boundary, for example through
feature entry-point side-effect imports. App controls composition/import order.
Audit overlapping selectors and responsive rules before splitting CSS; separate
files alone do not isolate selectors. Preserve effective cascade and verify
rendered results rather than assuming a mechanical move is equivalent.

## Migration and acceptance

Deliver one complete refactor with runnable intermediate steps: boundary moves,
responsibility extraction, stylesheet separation, and configuration alignment.
Do not alter route URLs, catalog availability, storage keys/schemas, theme
initialization, countdown semantics, or user-facing interactions.

- Keep `@/*` resolving to `src/*`. Update shadcn paths in `components.json`,
  including global CSS and UI/utils destinations, and the ESLint UI override.
- Keep Vitest setup in `src/test/setup.ts`. Preserve existing behavioral test
  cases during migration; do not replace them with assertions on new internals.
- Check boundary rules with representative forbidden imports, including alias,
  relative paths, feature internals, cross-feature imports, and test support.
  Confirm permitted imports still pass lint.
- Run the existing tests, lint, production build, and diff whitespace checks.
- Verify both themes at desktop and mobile sizes in a real browser, including
  directory discovery, favorites, shortcuts, navigation, and initial theme.
- Verify countdown Apply/draft separation, cancellation, restoration after
  reload, completion, actual fullscreen entry/exit, and the mouse return control.
  Confirm switching projection preserves the active countdown and draft state.
- Compare rendered layout before and after the change. Record browser evidence
  and any checks that could not be performed; jsdom does not validate native
  fullscreen or visual parity. Do not install a new test framework.

No implementation checks have run during this documentation-only interview.
Final design confirmation does not itself request implementation, commits,
issue creation, or publication.

This ADR is the authoritative record of the approved architecture decisions and
migration constraints. Future architectural decisions belong in `docs/adr/`;
`CONTEXT.md` remains the domain glossary.
