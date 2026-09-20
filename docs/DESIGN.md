---
name: Precision Dark Utility
colors:
  surface: '#111111'
  surface-dim: '#141414'
  surface-bright: '#222222'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#181818'
  surface-container: '#181818'
  surface-container-high: '#1E1E1E'
  surface-container-highest: '#242424'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c8c7be'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#333333'
  outline-variant: '#2A2A2A'
  surface-tint: '#c9c6c0'
  primary: '#ffffff'
  on-primary: '#31312c'
  primary-container: '#e5e2db'
  on-primary-container: '#65645f'
  inverse-primary: '#5f5e59'
  secondary: '#cbc6bd'
  on-secondary: '#32302a'
  secondary-container: '#494740'
  on-secondary-container: '#b9b5ac'
  tertiary: '#ffffff'
  on-tertiary: '#3f2e00'
  tertiary-container: '#ffdf9e'
  on-tertiary-container: '#79612a'
  error: '#BA1A1A'
  on-error: '#690005'
  error-container: '#371C1D'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2db'
  primary-fixed-dim: '#c9c6c0'
  on-primary-fixed: '#1c1c18'
  on-primary-fixed-variant: '#474742'
  secondary-fixed: '#e7e2d8'
  secondary-fixed-dim: '#cbc6bd'
  on-secondary-fixed: '#1d1b16'
  on-secondary-fixed-variant: '#494740'
  tertiary-fixed: '#ffdf9e'
  tertiary-fixed-dim: '#e2c382'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#59440f'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#1A1A1A'
  gold-light: '#CFB67D'
  gold-dark: '#947A44'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  kbd:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1.5rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

Precision Dark Utility combines functional minimalism with an understated luxury-technical aesthetic. Built for engineers, power users, and designers who prioritize zero distraction, privacy, and speed, the visual tone evokes high-end mechanical instruments and terminal productivity software.

Key design tenants:
- **Utilitarian Elegance:** High-density information delivery rendered through a dark palette with warm cream typography and targeted brass/gold highlights.
- **Subdued Restraint:** Visual weight is achieved through tonal surface layering and razor-thin containment lines rather than heavy drop shadows or vibrant saturated colors.
- **Tactile Precision:** Monospaced keyboard accelerators, compact tool badges, and crisp interactive states reinforce direct instrument manipulation.

## Colors

The palette uses deep obsidian and charcoal tones paired with off-white warm cream text and disciplined gold accents:

- **Surface Layers (`#111111`, `#141414`, `#181818`, `#1E1E1E`, `#242424`):** Provide hierarchical elevation without muddy gray shifts, creating contrast against foreground elements.
- **Primary Text (`#F4F1EA`):** A warm off-white cream tone providing high legibility while avoiding the glare of pure `#FFFFFF`.
- **Secondary / Muted Text (`#8E8A82`):** A warm stone gray for supporting descriptions, metadata, labels, and inactive controls.
- **Accent Gold (`#B89B5E`):** Reserved strictly for active indicators, featured status badges, primary highlights, and focus borders.
- **Dividers & Outlines (`#262626`, `#2A2A2A`, `#333333`):** Provide structure and surface separation.

## Typography

Typography pairs `Geist` for interfaces and headings with `JetBrains Mono` for metadata, tags, and key hints.

- **Headlines:** Set in `Geist` semi-bold with negative tracking to maintain punchy density. On mobile viewports (<640px), headline-xl steps down to 28px/36px.
- **Body:** Set in `Geist` regular. `body-md` (14px) is the primary interactive scale, balancing information density with reading ergonomics.
- **Labels & Monospace:** `JetBrains Mono` handles categories, keyboard shortcut keys (`kbd`), status flags, and live readouts with slight positive tracking to maintain clarity at micro sizes.

## Layout & Spacing

The layout follows a centered, fixed-max-width grid bounded at `1120px` (`max-w-[1120px]`).

- **Grid Alignment:** Primary content uses a 3-column responsive system:
  - Mobile (<768px): 1 column with `margin: 1.5rem`.
  - Tablet (768px - 1024px): 2 columns with `gutter: 1.25rem`.
  - Desktop (>1024px): 3 columns with `gutter: 1.5rem` and outer canvas `margin-desktop: 3rem`.
- **Component Padding Scale:**
  - `space-xs` (4px) / `space-sm` (8px): Icon offsets, input inner gaps, and pill button internal margins.
  - `space-md` (12px): Standard button padding, search bar interiors, and header item gaps.
  - `space-lg` (20px): Card interiors, modal dialog padding, and panel sections.
  - `space-xl` (32px): Major vertical section spacing and hero separation.

## Elevation & Depth

Visual hierarchy is constructed through tonal surface stacking, frosted glass headers, and low-contrast perimeter borders:

- **Base Layer:** `#111111` acts as the root canvas.
- **Floating Header:** Glassmorphic layer using `#111111`/90 with `backdrop-blur-md` and a thin `#262626` bottom border.
- **Elevated Surfaces:** Cards and command panels sit on `#181818` with 1px `#2A2A2A` borders. Embedded controls and inset preview containers step down to `#141414` or up to `#1E1E1E`.
- **Shadows:** Minimal and soft (`shadow-sm`, `shadow-md`, `shadow-lg`). Shadows rely on black alpha blending (`rgba(0, 0, 0, 0.4 - 0.6)`) to lift floating elements without glowing edges.
- **Atmospheric Glow:** Used sparingly for hero moments via high-blur (64px–96px) low-opacity (5%) tertiary gold radial shapes.

## Shapes

The design uses a restrained, compact radius language (`roundedness: 1`):

- **Default / Micro (2px):** `rounded-xs` used on kbd tags and subtle accent markers.
- **Standard (4px):** `rounded` and `rounded-md` used on category pills, tag badges, and inner nested buttons.
- **Containers & Buttons (8px - 12px):** `rounded-lg` (8px) on standard buttons and icons; `rounded-xl` (12px) on cards, search command inputs, and container panels.
- **Full / Pill:** Reserved strictly for status badges, live activity indicators, and user avatars.

## Components

### Buttons
- **Primary Button:** `#F4F1EA` background with `#111111` text, semi-bold `body-md` typography, `rounded-lg`, subtle drop shadow. Hover state: `#E4E0D7`.
- **Secondary / Ghost Button:** Transparent or `#1E1E1E` background, 1px `#2A2A2A` border, `#8E8A82` text. Hover state: `#F4F1EA` text, border `#333333`.
- **Icon Button:** 32x32px square with `rounded-lg`, `#8E8A82` icon, transitioning to `#1E1E1E` background and `#F4F1EA` foreground on hover.

### Chips & Filter Pills
- **Active Filter:** `#F4F1EA` background, `#111111` text, `rounded-md`, 11px uppercase/medium font weight.
- **Inactive Filter:** `#1E1E1E` background, 1px `#2A2A2A` border, `#8E8A82` text. Hover state: `#252525` background, `#F4F1EA` text.

### Tool & Feature Cards
- **Card Container:** `#181818` background, 1px `#2A2A2A` border, `rounded-xl`, `space-lg` internal padding.
- **Interactive State:** Border transitions to `#B89B5E`/60 on hover, title shifts to `#B89B5E`, and leading icon scales slightly.
- **Card Footer Slot:** Inset `#141414` strip with 1px `#262626` border containing metadata in `JetBrains Mono` and an interactive arrow.

### Input Fields & Search Bars
- **Command Input:** Outer wrapper on `#181818` with `#141414` input container, 1px `#262626` border, `#F4F1EA` value text, `#8E8A82` placeholder.
- **Focus State:** 1px border transition to `#B89B5E`/60, no default browser outline.
- **Keyboard Accessories:** Inline `<kbd>` elements with `#1E1E1E` fill, `#333333` border, and 11px monospaced lettering.

### Badges & Metas
- **Technical Badges:** `JetBrains Mono` 11px uppercase in `#1E1E1E` container with `#2A2A2A` outline and `#8E8A82` text.
- **Status Indicator:** 6px circular dot with active CSS pulse or ping in accent `#B89B5E`.