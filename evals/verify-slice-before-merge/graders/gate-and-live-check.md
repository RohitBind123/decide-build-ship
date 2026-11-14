---
type: llm
---

PASS if the reply covers all of these: static checks (build, lint, typecheck) run in full; tests selected for what changed and what depends on it plus a small smoke set, with every command and its reason recorded as evidence; code and security reviews; and a live check of the real running app with synthetic data, with screenshots or samples saved.
FAIL if the reply only says to run the whole test suite and merge, or skips the live check.
