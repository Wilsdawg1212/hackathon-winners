# hackathon-winners

Introduction
GroupSafe is a lightweight control layer for shared cryptocurrency treasuries. It lets organizations manage one on-chain wallet as if it were a single account while transparently enforcing policies in the background—things like per-member budgets, recipient allowlists, cooldowns, and escalation rules. The goal is simple: make everyday payments fast and safe for contributors, and reserve multisig ceremonies for only the high-risk stuff.

Problem
Today, most shared wallets give teams only coarse controls: either every action needs multisig (slow) or too much power is centralized in a few hands (risky). There’s usually no way to assign role-based budgets, restrict who can be paid, enforce time-bound caps, or automatically escalate out-of-policy actions for approval. As a result, treasury ops are fragile, error-prone, and hard to audit in real time.

Solution
We integrate a Gnosis Safe smart account with a policy module that enforces rules on chain and a clean front end that explains what’s happening and why. Routine, in-policy actions execute immediately; larger or sensitive actions are automatically queued for multisig approval. Optional session keys and a relayer enable scoped, time-limited permissions and gasless UX, while an activity feed provides a clear audit trail of every decision.

Product
The product is a Next.js web application wired to the Safe SDK and a Solidity “GroupOps” module. Teams configure roles, budgets, and allowlists in the UI; members initiate payments or swaps; the module validates policies and either executes or escalates to the Safe’s queue. The app ships with an approvals dashboard, policy editor, activity log, and one-click emergency pause—delivering a practical, demo-ready upgrade to shared wallet governance.



Roles:

Wilson - Product Manager, full-stack developer
McKade - Backend dev
Yash - backend dev
Spencer - Full-Stack Developer
