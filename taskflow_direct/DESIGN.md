---
name: TaskFlow Direct
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-xs:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.03em
  currency-stat:
    fontFamily: Inter
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system embodies the operational precision of an enterprise workflow engine combined with the immediate clarity of high-trust transactional marketplaces. Targeted at distributed independent specialists, project leads, and operations teams managing micro-deliverables, the interface prioritizes transactional integrity, liquidity clarity, and task velocity.

The aesthetic follows a modern Corporate/Fintech approach: rigorously clean, high-density yet breathable, structured around deliberate negative space, calibrated border delineations, and low-cognitive-load metadata presentation. Visual feedback conveys financial dependability, removing ambiguity from task lifecycles, unlock mechanics, and escrow releases. The emotional response is one of operational mastery, absolute transactional transparency, and frictionless productivity.

## Colors

The color system delivers functional clarity across task operations, escrow metrics, and financial verification.

- **Primary (`#2563EB`)**: Anchor for core interactive states, critical call-to-actions, focused elements, and active progress paths. Deep indigo-blue variants (`#1D4ED8`) anchor active/pressed interactions, while lighter steps (`#3B82F6`) provide subtle container accents.
- **Secondary (`#10B981` / `#059669`)**: Dedicated to verified balances, completed deliverables, paid escrows, and positive return deltas.
- **Tertiary (`#F59E0B` / `#D97706`)**: Reserved for pending submissions, unlocking mechanics, escrow holds, and threshold warnings.
- **Error / Destructive (`#EF4444` / `#DC2626`)**: Strictly signals rejected submissions, failed payouts, validation errors, and critical destructive prompts.
- **Neutrals & Surfaces**: Backgrounds use crisp slate foundations (`#F8FAFC` canvas, `#FFFFFF` elevated cards, `#F1F5F9` sub-tier panels). Text uses high-contrast slate neutrals (`#0F172A` for primary headlines, `#334155` for body text, and `#64748B` for supporting metadata) to guarantee AA/AAA compliance across all critical operational data.

## Typography

Inter serves as the unified typographic engine, configured with tabular numeric figures (`tnum`) for all monetary values, time counters, task allocations, and tabular balance summaries.

Letter spacing is tightened progressively as type size scales up to retain cohesion and authority. All labels, badge tags, and metric indicators rely on semi-bold weightings with slight letter spacing expansion to maximize legibility across dense dashboard cards. Mobile adaptations automatically adjust leading and size scales for display and large headline classes to eliminate awkward wrappings on mobile viewport constraints.

## Layout & Spacing

The layout is built upon an 8-point base spacing grid, scaling strictly with proportional intervals. Content containers adhere to a 12-column fluid grid on desktop systems (max-width `1280px` for main content panes and `1440px` for utility analytics dashboards), collapsing down to an 8-column layout on tablets and a 4-column layout on mobile viewports.

- **Desktop (1024px and above)**: Section margins use `margin-desktop` (`2.5rem`), gutters remain consistent at `gutter` (`1.5rem`), allowing simultaneous sidebars, multi-panel kanban views, and transaction summary side-drawers.
- **Tablet (768px - 1023px)**: Sidebars collapse to icon-only vertical navigation rails or slide-over sheets. Margins adjust to `margin` (`1.5rem`), gutters settle at `gutter-sm` (`1rem`).
- **Mobile (below 768px)**: Canvas margins collapse to `margin-mobile` (`1rem`), with card paddings reducing to `space-md` (`1rem`) to maximize content scanning efficiency. Stacks transition to full-width linear column arrays.

## Elevation & Depth

Visual hierarchy uses a refined combination of surface tonal layers, crisp structural borders (`#E2E8F0`), and multi-stop ambient shadows tinted with deep slate (`rgba(15, 23, 42, ...)`). This avoids muddy drop-shadows and preserves crisp separation.

- **Level 0 (Flat Canvas)**: `#F8FAFC`, zero shadow, boundary free.
- **Level 1 (Base Cards, Feed Panels)**: `#FFFFFF` surface resting on a solid border of `1px solid #E2E8F0`, accompanied by an ambient micro-shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Hovered Cards, Dropdowns, Filter Popovers)**: `#FFFFFF` surface with border `1px solid #CBD5E1` and ambient elevation: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Transaction Drawers, Sticky Toolbars)**: `#FFFFFF` surface with ambient elevation: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Level 4 (Toasts, System Banners)**: Inverted or high-contrast floating pill units with an elevation: `0 25px 50px -12px rgba(15, 23, 42, 0.18)`.

## Shapes

The platform utilizes a structured, approachable geometric radius system. Standard interactive surfaces, task detail cards, and modal containers leverage soft, contemporary corners that strike an optimal balance between structural enterprise discipline and modern SaaS warmth.

- **Cards & Data Modules**: Base containers utilize `rounded-xl` (`1rem` / `16px`), while high-level dashboard metric summaries and hero cards utilize `rounded-2xl` (`1.5rem` / `24px`).
- **Input Controls & Triggers**: Primary inputs, selects, segmented controllers, and standard action buttons use regular rounded tokens (`0.5rem` / `8px`).
- **Status Badges, Chips, & Micro-triggers**: Employ full pill geometry (`9999px`) to visually distinguish transactional statuses and unlocked states from structural card frames.

## Components

### Buttons
- **Primary Action**: Solid `#2563EB` fill, white text, semi-bold font weight, `0.5rem` corner radius, `0.5rem` vertical by `1rem` horizontal padding. Hover shifts to `#1D4ED8`. Active state triggers subtle scale down (`0.98`).
- **Secondary / Outline**: `#FFFFFF` background, `1px solid #CBD5E1` border, `#334155` text. Hover shifts to `#F8FAFC` background with `#0F172A` text.
- **Financial / Positive Action (Payouts / Approvals)**: Solid `#10B981` fill, `#FFFFFF` text. Hover shifts to `#059669`.
- **Tertiary / Unlock Action ($0.80 unlock)**: Tinted `#FEF3C7` background, `1px solid #FDE68A` border, `#B45309` text with a dedicated trailing lock/spark icon. Hover shifts to `#FDE68A`.

### Status Badges & Chips
- Designed as full pills (`rounded-full`) with `0.25rem` vertical by `0.625rem` horizontal padding.
- **Approved / Paid**: `#ECFDF5` background, `#047857` text, with optional `6px` solid emerald status indicator dot.
- **Pending / In Review**: `#FFFBEB` background, `#B45309` text, paired with an amber status indicator dot.
- **Rejected / Action Required**: `#FEF2F2` background, `#B91C1C` text.
- **Locked Task**: `#F1F5F9` background, `#475569` text, featuring subtle lock glyph.

### Form Inputs & Selectors
- Background: `#FFFFFF`. Border: `1px solid #CBD5E1`. Radius: `0.5rem`.
- Focus state: `1px solid #2563EB` border accompanied by an indigo glow ring: `0 0 0 3px rgba(37, 99, 235, 0.15)`.
- Helper text: `#64748B` typography, positioned with `space-xs` spacing below the control.

### Cards & Marketplace Items
- Encased within `rounded-xl` borders of `#E2E8F0` on `#FFFFFF` surfaces.
- Task feed cards exhibit a three-zone structure: Top zone houses category tags, lock/unlock availability, and budget indicators (`currency-stat`); middle zone displays deliverable scope; bottom zone contains client validation metrics, deadline timers, and the primary action trigger.
- Hover states on clickable task cards slightly elevate to Level 2 elevation and shift border tone to `#94A3B8`.

### Checkboxes & Radio Controls
- Base: `1px solid #CBD5E1` box (`4px` radius for checkboxes, full circle for radios).
- Selected state: Primary `#2563EB` fill displaying crisp white checkmark or center pip, accompanied by a soft blue ring transition.