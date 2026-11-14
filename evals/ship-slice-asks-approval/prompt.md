---
description: A ready slice should start ship-slice, which checks preconditions and asks for approval before merging.
tags: [trigger, ship-slice]
max_turns: 8
allowed_tools: [Read, Glob, Grep, Skill]
---

The pickup-slots slice is ready: the gate is green on commit 8c41d07, the live check passed, and the reviews are fixed. Let's get it into develop.
