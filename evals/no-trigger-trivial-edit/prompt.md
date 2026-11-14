---
description: A trivial edit must not start the decide or plan skills.
tags: [negative]
runs: 2
max_turns: 4
allowed_tools: [Read, Glob, Grep, Skill]
---

Rename the variable cnt to count in this snippet and show me the result:

let cnt = 0;
cnt += 1;
console.log(cnt);
