---
name: design-ui
description: Gives a product a deliberate, production-grade interface - writes the design system page (brand direction, type scale, colour tokens with light and dark themes, spacing, radius, elevation, motion, components), designs every screen state (empty, loading, partial, error, offline, success), applies accessibility (WCAG 2.2 AA, keyboard, screen readers, contrast, reduced motion, touch targets) and platform conventions for web, iOS, Android and desktop, and reviews built screens from real screenshots against a checklist so the result does not look generic. Use when a product or slice has screens to design or build, when starting a design system, when someone says "make it look good", "design this screen", "review the UI", "it looks generic", "dark mode", "accessibility", or before verifying a slice with user-facing screens.
license: MIT
---

# Design the interface

Good interfaces are decided, not decorated. This skill writes the design rules down once, applies them to every
screen a slice adds, and checks the result in a real browser or simulator.

## Before you start

Read the `Build workflow` section of `CLAUDE.md` for `Design system` (default `docs/spec/design-system.md`),
`Product type` and `Project rules`. Read the product brief's personas and design direction. A project's own
design system, brand guide or component library always wins over this skill's defaults.

If a companion design skill is installed (for example a platform guidelines reviewer, a frontend design skill
or a web-platform guidance skill), use it for its platform and keep this skill's rules for states, content and
accessibility. See [references/platforms.md](references/platforms.md).

Copy this checklist into your reply:

```
Design progress:
- [ ] 1. Design system page exists and is approved
- [ ] 2. Screens for the slice listed, with every state
- [ ] 3. Tokens and components used; no one-off values
- [ ] 4. Accessibility rules applied
- [ ] 5. Built screens reviewed from screenshots, light and dark, small and large
```

## 1. Design system first

If there is no design system page, write one from [assets/design-system.md](assets/design-system.md) using
[references/foundations.md](references/foundations.md):

1. Ask the owner (AskUserQuestion) for three brand adjectives, two or three products they admire and why,
   light or dark default, and information density. Recommend answers that fit the personas.
2. Propose a type scale, colour tokens for both themes, spacing, radius, elevation and motion tokens, and the
   core components. Check every text and icon colour pair for contrast before proposing it.
3. Choose one distinctive element on purpose (a typeface, an accent, a layout rhythm, an illustration style)
   so the product does not look like a template. Everything else stays quiet.
4. Get the page approved and record the approval in the decisions log.

## 2. Design each screen with every state

For every screen in the slice plan, list the states in
[references/states-and-content.md](references/states-and-content.md): first use, empty, loading, partial,
full, error, offline, permission denied, and success. Each state says what the user sees and what they can do
next. Wording on screen is approved by the owner through `decide`.

## 3. Build with tokens

- Use tokens and existing components only. A new value or component is added to the design system page first.
- One primary action per screen. Destructive actions are visually distinct and confirm or offer undo.
- Layout works from the smallest supported width (360 px on the web) to wide screens, with no horizontal scroll.
- Motion explains a change (where something came from, what changed); it is short and respects reduced motion.

## 4. Accessibility is part of done

Apply [references/accessibility.md](references/accessibility.md): semantic structure, labels, focus order and
visible focus, keyboard and screen reader paths, contrast, text resizing, touch target size, reduced motion, and
never colour alone to carry meaning. Automated checks (for example axe in end-to-end tests) run in the gate;
they do not replace a manual keyboard and screen reader pass on new flows.

## 5. Review from screenshots

Review the real screens, not the code. Capture each screen and state in light and dark, at small and large
sizes, during the live check, then go through
[references/review-checklist.md](references/review-checklist.md). Delegate the review to the `design-reviewer`
agent when the plugin is installed. Fix every finding that breaks a rule; raise taste-level suggestions to the
owner as optional questions.

## Next

Design system approved: back to `plan-slice` or `build-slice`. Screens reviewed: continue `verify-slice`.
