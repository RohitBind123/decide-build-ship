---
description: Settled decisions plus a spec should start plan-slice and produce a vertical slice plan.
tags: [trigger, plan-slice]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

Spec (approved): Customers of one bakery pre-order bread online for pickup the next day. Staff see orders on an order board. The bakery owner sets how many orders each 30-minute pickup slot can take.

Decisions (settled): D1 slots are 30 minutes from 7:00 to 12:00. D2 the owner sets a limit per slot; default 10. D3 a full slot is shown as "Full" and cannot be picked.

Plan the first slice for pickup slots. Do not write code yet.
