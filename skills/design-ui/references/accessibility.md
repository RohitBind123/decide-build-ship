# Accessibility

Target WCAG 2.2 level AA on the web (https://www.w3.org/TR/WCAG22/) and honour the platform's accessibility
settings on native apps. Accessibility is checked in every slice, not in a final audit.

## Structure and semantics

- Use native elements first (button, link, input, heading, list, table). Add ARIA only when no native
  element fits, and keep roles, names and states correct.
- One main heading per page; headings in order. Landmarks for header, navigation, main and footer.
- Every image has a text alternative, or is marked decorative.

## Keyboard and focus

- Everything works with a keyboard alone, in a logical order. No keyboard traps.
- Focus is always visible, with at least 3:1 contrast, and is not hidden under sticky headers.
- Dialogs move focus in, keep it inside, and return it to the trigger on close.

## Visual

- Contrast 4.5:1 for text, 3:1 for large text, icons and control boundaries.
- Colour never carries meaning alone: add text, an icon or a pattern.
- Text resizes to 200% without loss of content; layout reflows at 320 CSS px wide.
- Touch and pointer targets at least 24 by 24 CSS px on the web; 44 by 44 points on iOS and 48 by 48 dp on
  Android are the platform recommendations.

## Motion and time

- Respect reduced-motion settings. No flashing more than three times per second.
- Time limits can be extended or turned off; auto-moving content can be paused.

## Forms and errors

- Labels are programmatically tied to inputs. Errors are announced and described in text.
- Do not ask for information the user already gave in the same flow; support password managers and paste.

## Testing in the gate

- Automated: an accessibility checker (for example axe) in end-to-end tests for each new screen and state.
- Manual on new flows: keyboard only; a screen reader (VoiceOver, TalkBack or NVDA); 200% zoom; dark mode;
  reduced motion.
- Record the results in the slice's evidence folder.
