# <Product name>: roadmap

- Status: Draft | Approved (<date>, by <owner>)
- Last updated: <date>
- Related: product brief <link>, architecture <link>

Milestones are ordered by risk. A slice is the thinnest piece a user can see working end to end. Slices marked
`parallel` touch separate file sets and may be built at the same time.

## Milestone M1: <goal a user would recognise>

- Demo: <what the owner will try at the end>
- Tests the assumption: <assumption from the brief>
- Standing merge approval: <none | "owner's words", date, recorded as D-number>
- Status: Not started | In progress | Done (<date>)

| Slice | What a user can do | Features | Depends on | Parallel | Status |
|---|---|---|---|---|---|
| M1-S1 | <outcome> | F1 | none | no | Not started |
| M1-S2 | <outcome> | F2 | M1-S1 | parallel with M1-S3 | Not started |
| M1-S3 | <outcome> | F4 | M1-S1 | parallel with M1-S2 | Not started |

Release at the end of M1: <yes, to production | no, internal demo only>.

## Milestone M2: <goal>

<Same shape.>

## Later

- <ideas not yet placed in a milestone, with their source>
