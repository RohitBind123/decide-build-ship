# Foundations

Defaults to propose when a product has no design system. Every value becomes a named token; screens use tokens,
never raw values.

## Contents

- Type
- Colour
- Spacing and layout
- Shape and elevation
- Motion
- Components
- Avoiding the generic look

## Type

- One or two typefaces at most: one for text, optionally one for display. Use the platform's system font on
  native apps unless the brand needs otherwise.
- A modular scale (for example 12, 14, 16, 20, 24, 32, 40). Body text at least 16 px on the web; never below
  12 px anywhere.
- Line height about 1.4 to 1.6 for body text and 1.1 to 1.3 for headings. Line length 45 to 80 characters.
- Use weight and size for hierarchy before colour. Tabular numerals for tables, prices and counters.

## Colour

- Name tokens by role, not by hue: `bg`, `surface`, `surface-raised`, `text`, `text-muted`, `border`,
  `accent`, `accent-text`, `success`, `warning`, `danger`, `focus`.
- Define every token for light and dark themes. Dark is not inverted light: use dark grey surfaces, slightly
  lower saturation, and lighter surfaces for higher elevation.
- Contrast: 4.5:1 for body text, 3:1 for large text, icons and control borders (WCAG 2.2 AA).
- One accent colour for the primary action and selection. Status colours only for status.
- Charts use a separate, tested categorical palette that also works for colour-blind users.

## Spacing and layout

- A 4 or 8 px base unit; a small set of steps (4, 8, 12, 16, 24, 32, 48, 64).
- Group related items with less space, separate groups with more. Align to a grid; keep one content width.
- Breakpoints by content, commonly around 600, 900 and 1200 px. Test at 360 px.

## Shape and elevation

- One radius scale (for example 4, 8, 12, full). Nested corners: inner radius equals outer radius minus
  padding.
- Few elevation levels (flat, raised, overlay). Use borders or surface tone before heavy shadows.

## Motion

- Durations: 100 to 150 ms for small feedback, 200 to 300 ms for panels and page changes. Ease out for things
  entering, ease in for things leaving.
- Animate transform and opacity, not layout properties.
- With reduced motion requested, replace movement with a fade or nothing.

## Components

Define these before screens: button (primary, secondary, quiet, destructive; with loading and disabled
states), text field (label, hint, error), select, checkbox, radio, switch, dialog, sheet or drawer, toast, tabs,
table or list row, card, empty state, skeleton, badge, avatar, navigation (top bar, side bar or tab bar).
Each has every interactive state: default, hover, pressed, focus, disabled, loading, error.

## Avoiding the generic look

Generic interfaces come from defaults applied everywhere. Instead:

- Pick one deliberate signature (a typeface, an accent, a layout rhythm, an illustration or photo style) and
  repeat it consistently.
- Write real content into designs early; placeholder text hides hierarchy problems.
- Remove decoration that does not help a task: gradients, glows, cards inside cards, icons next to every label.
- Prefer fewer, larger, clearer elements over many small ones.
