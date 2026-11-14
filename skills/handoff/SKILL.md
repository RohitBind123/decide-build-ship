---
name: handoff
description: Writes and refreshes a persistent handoff file in the repository so work survives a context limit, a usage limit, a crash, a machine restart or a switch to another session or account - branch and head sha, what is done, what is running (agents, worktrees, ports, locks), pending owner questions and answers, standing rules and approvals, and the exact next step, as a paste-ready prompt for a fresh session. Also resumes from that file. Use at every phase change, when the context is getting long, before a restart or shutdown, when ending a session with work in flight, when a usage limit is near, and at session start when a handoff file exists.
license: MIT
---

# Handoff

Limits and restarts can arrive without warning. Keep a handoff file current so that a new session, which cannot
see this one, can continue in minutes.

## Before you start

Read the `Build workflow` section of the project's `CLAUDE.md` for `Handoff file` (default `tasks/handoff.md`),
`Remote` and `Approvals`. The file lives in the repository, never only in a scratch or temp directory: those
are wiped on reboot.

## When to write or refresh

- At every phase change: decisions settled, plan committed, builders started, gate green, merged.
- When the conversation is long, or a usage limit is near. Do not wait for a warning.
- Before a restart, shutdown, sleep, or switching to another session or account.
- When ending a session with work still running.

## What to write

Fill [assets/handoff.md](assets/handoff.md). It must stand on its own:

1. **Paste-ready prompt** at the top, addressed to a fresh session: what the project is, which skills to use,
   and the exact next step.
2. **Where things stand:** repository path, branch, head sha, whether the working tree is clean, what is
   pushed.
3. **Done:** finished steps, with commit shas and evidence paths.
4. **In flight:** each running agent (id or name, task, worktree, branch), ports and throwaway databases in
   use, locks held, background commands.
5. **Owner:** questions asked and not yet answered; answers received, verbatim; standing approvals.
6. **Rules:** the standing rules that apply (or a pointer to `CLAUDE.md`), and anything the owner said this
   session that is not yet written elsewhere.
7. **Next step:** one concrete action, and the commands to check the state before taking it.

Never put secrets, tokens or personal data in the file.

## Save it

1. Write the file. Commit it only on a slice branch (or the branch the project names for handoffs), staging
   that one path. Never commit it to the integration or production branch; there, leave it uncommitted and
   say so.
2. Push only a slice or handoff branch, and only if the project's approvals allow; otherwise ask. Never push
   the integration or production branch from here. A handoff that exists only on a machine that is about to
   restart is still useful; one that exists only in this conversation is not.
3. In a public repository, ask whether to commit the file or keep it local (git-ignored): it holds local paths
   and the owner's answers.
4. When the limit is close, also show the paste-ready prompt in your reply and give the file path.

## Resume from a handoff

1. Read the handoff file and the `Build workflow` section of `CLAUDE.md`.
2. Check the real state before trusting the file: `git status`, `git log -1`, `git worktree list`, and whether
   the listed agents, ports and locks still exist.
3. Report what matches and what has changed since the file was written.
4. Re-ask any owner question that is still open, then continue from the next step.
