# Design review checklist

Review screenshots of the real app, each state, light and dark, at the smallest and a large size. Each finding
cites the rule it breaks (a design system token, a reference here, or a platform guideline page) or is labelled
as a judgment call.

## Contents

- Hierarchy and layout
- Consistency
- States and content
- Accessibility
- Platform fit
- Craft
- Reporting findings

## Hierarchy and layout

- The most important thing on the screen is the most visible. One primary action.
- Related items are grouped; groups are separated. Alignment is consistent.
- Nothing is cut off, overlapping or scrolling sideways at the smallest size.
- Long names, large numbers and translated text still fit.

## Consistency

- Only tokens: no stray colours, sizes, radii or shadows.
- The same action looks and is named the same everywhere.
- Icons come from one set, at consistent sizes and stroke weights.

## States and content

- Every state in the states table exists and looks intentional.
- Missing values are shown as missing, never as zero. No internal codes or field names on screen.
- Wording is approved, specific and consistent with the product's vocabulary.

## Accessibility

- Contrast passes in both themes, including disabled and placeholder text where it carries meaning.
- Focus is visible and in a logical order; targets meet the minimum size.
- Meaning never depends on colour alone. Reduced motion is respected.

## Platform fit

- Navigation, controls and gestures match the platform's conventions.
- Dark mode, text scaling and safe areas work.

## Craft

- The screen has the product's deliberate signature and does not look like a default template.
- No decoration without a job: no gratuitous gradients, shadows, glass or cards inside cards.
- Motion is short, purposeful and consistent.

## Reporting findings

Write each finding as one line in the slice's evidence folder:

```
<screen> / <state> / <theme, size>: <problem>. Rule: <citation or "judgment">. Fix: <specific change>.
Severity: high (blocks a user or breaks a rule) | medium | low (polish)
```

High and medium findings are fixed in the slice. Low findings are fixed when cheap or moved to the backlog.
Taste-level suggestions go to the owner as optional questions.
