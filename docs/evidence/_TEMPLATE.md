# Evidence: <slice id> <slice name>

- Slice branch: <branch>
- Head verified: <full sha>
- Date: <YYYY-MM-DD>
- Result: GREEN | RED

## Gate plan

| Step | Command | Why selected |
|---|---|---|
| Build | `<command>` | Always |
| Lint | `<command>` | Always |
| Unit | `<command>` | Changed: <modules>; dependents: <modules> |
| End to end | `<command>` | Features touched: <features> |
| Smoke | `<command>` | Fixed set |

## Attempts

| # | Commit | Steps run | Result | Notes |
|---|---|---|---|---|
| 1 | <sha> | all selected | RED | <failed test, cause> |
| 2 | <sha> | failed only | GREEN | <fix> |

## Reviews

| Reviewer | Findings | Fixed | Accepted with reason | Raised to owner |
|---|---|---|---|---|
| <code / security / database / content> | <count by severity> | <count> | <count> | <D-numbers> |

## Live check

- App started with: `<command>`, database: throwaway, data: synthetic
- Client used: <browser, simulator or tool and version>
- Flows walked: <list>
- Screenshots: <folder>
- API samples: <folder>

## AI evals (AI slices only)

- Eval set: <path and version>; model: <exact id>
- Baseline: <score ± spread>; this slice: <score ± spread>; pass bar: <bar>
- Cost per action: <value> (budget <value>); p95 latency: <value> (budget <value>)
- Adversarial cases: <passed>/<total>

## Before and after

- BEFORE: <files>
- AFTER: <files>

## Open items

- <anything not done, and who owns it>
