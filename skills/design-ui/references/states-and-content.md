# States and content

A screen is designed only when every state is designed. Most "it looks broken" reports are a missing state.

## States to design for every screen

| State | What the user sees | Rule |
|---|---|---|
| First use | why the screen matters and the first action | one clear call to action, no empty chrome |
| Empty | that nothing is here yet, and how to add the first item | different from "no results for this filter" |
| Loading | a skeleton shaped like the final layout | no layout jump when data arrives; spinner only for short actions |
| Partial | the data that loaded, and which part failed | never hide good data because one part failed |
| Full | the real content, including long names and large numbers | test with the longest realistic values |
| Error | what went wrong in plain words and what to do | keep the user's input; offer retry |
| Offline | what still works and what will sync later | queue writes when the product supports it |
| Permission denied | that this needs another role, and who to ask | never a blank screen |
| Success | that the action worked, and what changed | confirm in place; undo for destructive actions |

## Content rules

- Missing is not zero. Unknown values show as "Not available" or an em dash, never as 0, $0 or 0%.
- Internal codes never reach users: map enums, status codes and field names to plain labels.
- Buttons say what they do ("Save changes", "Cancel order"), not "OK" or "Submit".
- Error messages name the problem and the fix, without blaming the user or exposing internals.
- Dates, times, numbers and currency follow the user's locale and time zone, and say which time zone when it
  matters.
- Confirmation dialogs for destructive actions name the thing being destroyed.
- Every new user-facing sentence is approved by the owner (`decide`).

## Forms

- A visible label for every field; hints before errors; errors next to the field and summarised at the top on
  submit.
- Validate on blur or submit, not on every keystroke. Keep input on error.
- Use the right input types and autocomplete attributes; do not block paste.
- Mark optional fields, not required ones, when most fields are required.
