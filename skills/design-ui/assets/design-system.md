# <Product name>: design system

- Status: Draft | Approved (<date>, by <owner>)
- Last updated: <date>
- Platforms: <web | iOS | Android | desktop>

## Direction

- Brand adjectives: <three words>
- Admired products and what to take from each: <product: reason>
- Signature element: <the one deliberate, distinctive choice>
- Default theme: light | dark | follows the system
- Density: comfortable | compact

## Type

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| `display` | <40/48> | <700> | <page titles on marketing screens> |
| `title` | <24/32> | <600> | |
| `body` | <16/24> | <400> | |
| `caption` | <12/16> | <400> | |

Typefaces: <text face>, <display face or none>. Numbers in tables: tabular.

## Colour

| Token | Light | Dark | Contrast checked against |
|---|---|---|---|
| `bg` | <#hex> | <#hex> | |
| `surface` | | | |
| `text` | | | `bg`, `surface` |
| `text-muted` | | | `bg`, `surface` |
| `accent` | | | |
| `accent-text` | | | `accent` |
| `success` / `warning` / `danger` | | | |
| `focus` | | | `bg`, `surface` |

## Spacing, shape and elevation

- Spacing steps: <4, 8, 12, 16, 24, 32, 48, 64>
- Radius: <4, 8, 12, full>
- Elevation: <flat, raised, overlay> and how each is drawn

## Motion

- Durations: <fast 120 ms, base 200 ms, slow 300 ms>
- Easing: <enter, exit>
- Reduced motion: <what replaces movement>

## Components

| Component | Variants | States covered | Notes |
|---|---|---|---|
| Button | primary, secondary, quiet, destructive | default, hover, pressed, focus, disabled, loading | |

## Content rules

- Voice: <for example plain, warm, direct>
- Missing values: <"Not available" or em dash>
- Dates and numbers: <locale rules>

## Accessibility

- Target: WCAG 2.2 AA; platform settings honoured.
- Exceptions agreed with the owner: <none, or the decision link>
