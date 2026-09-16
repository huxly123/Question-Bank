# Behavioral Stories

A bank of five to seven stories that answer almost every behavioral question. Interviewers rotate through the same 30-odd prompts, so the work is not memorising answers but knowing which story to reach for. Each story is written STAR(R): Situation, Task, Action, Result, Reflection. Keep a two-minute version for "tell me about a time" and a thirty-second version for when it comes up as a follow-up.

Rules that make a story land:

- **Numbers.** Before and after. A story without a measurable result gets probed until it breaks.
- **"I", not "we".** Name your specific decisions. Interviewers are scoring you, not the team.
- **The alternative you rejected.** Naming the option you did not take is what shows judgement.
- **Reflection.** One sentence on what you would do differently. Seniority signal.

## Story matrix

Which story answers which kind of question. Blank cells are gaps to fill.

| Story | Complex problem | Ownership / impact | Technical decision | Conflict | Failure | Influence / mentoring | Ambiguity / priority change | Learned fast |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Gatsby → Next.js migration | ✔ | ✔ | ✔ | | | | | ✔ |
| 2. App ↔ web login issue | ✔ | ✔ | | | | | ✔ | |
| 3. Batch processing a large user list | ✔ | | ✔ | | | | | |
| 4. Micro-frontend architecture | | ✔ | ✔ | | | | | |
| 5. Disagreement I resolved | | | | ✔ | | ✔ | | |
| 6. A failure or missed deadline | | ✔ | | | ✔ | | ✔ | |
| 7. Someone I mentored or influenced | | | | | | ✔ | | |

## 1. Gatsby → Next.js migration

Answers: most complex problem you solved · biggest impact · a technical decision you drove · walk me through a project end to end.

**Situation.** _Fill in: the product, the team size, and what was wrong. Build times of how long? Page speed scores of what? Why did it matter to the business (SEO, conversions, developer time)?_

**Task.** Reduce build time and improve page speed by moving to Static Site Generation, and keep pages fresh without full rebuilds using Incremental Static Regeneration.

**Action.**
- _Fill in: why Next.js over staying on Gatsby or another option. What was the alternative you rejected and why?_
- _Fill in: how you sequenced the migration (page by page? behind a flag? big bang?) and how you kept the site live meanwhile._
- _Fill in: the hardest part (data fetching rewrite, image handling, routing, hydration mismatches?) and how you solved it._
- _Fill in: how you rolled out and measured._

**Result.** _Fill in with numbers: build time X → Y, Lighthouse or Core Web Vitals before → after, any business metric. This is the line the whole story exists for._

**Reflection.** _Fill in: what you would do differently, and what you would watch for at ten times the traffic._

## 2. App ↔ web login issue

Answers: a hard bug you debugged · a time you worked under ambiguity · a cross-team problem.

**Situation.** _Fill in: users logging in on the app then hitting the web (or the reverse) were failing how? How was it noticed, how many users, how urgent?_

**Task.** _Fill in: your responsibility. Were you assigned it or did you pick it up?_

**Action.**
- _Fill in: how you reproduced it and narrowed the cause (cookies vs tokens, domains, SameSite, redirect flow, token expiry?)._
- _Fill in: who you had to work with (mobile team, backend, auth provider) and how you coordinated._
- _Fill in: the fix, and how you verified it without breaking the other platform._

**Result.** _Fill in: fixed for how many users, in how long, any follow-up hardening._

**Reflection.** _Fill in: the monitoring or test you added so it cannot recur silently._

## 3. Batch processing a large user list

Answers: a performance or scale problem · a technical trade-off you made.

**Situation.** _Fill in: how large the list was, what the job did, and what failed (out of memory? timeouts? rate limits?)._

**Task.** Update user details for the whole list within memory limits.

**Action.** Looped over the list and processed it in batches instead of loading everything at once. _Fill in: batch size and how you picked it, whether batches ran sequentially or with a concurrency limit, how you handled a failed batch (retry, resume from checkpoint?), and the alternatives you rejected (streaming, a queue, a background worker)._

**Result.** _Fill in: memory before → after, total runtime, error rate._

**Reflection.** _Fill in._

## 4. Micro-frontend architecture

Answers: describe your system's architecture · a decision with organisational impact · monolith vs micro-frontends trade-off.

**Situation.** _Fill in: how many teams, what the monolith was, what hurt (deploy coupling, shared dependency conflicts, ownership?)._

**Task.** _Fill in._

**Action.** _Fill in: module federation or another approach, how shared dependencies were handled, how MFEs communicated (custom events, message bus, URL), how routing and auth were shared, how you kept a consistent design system._

**Result.** _Fill in: deploy frequency, build times, incidents from coupling before → after._

**Reflection.** _Fill in: what became harder (versioning, duplicated bundles, local dev setup) and whether you would do it again at that team size._

## 5. Disagreement I resolved

Answers: conflict with a coworker · disagreement with your manager or PM · a time you changed your mind or changed someone else's.

**Situation.** _Fill in: who disagreed about what. Pick a real technical or product disagreement, not a personality clash._

**Task.** _Fill in._

**Action.** _Fill in: how you understood their position first, what evidence or prototype you brought, how the decision was made, and how you committed to it afterwards even if it was not your preference._

**Result.** _Fill in._

**Reflection.** _Fill in: what you would raise earlier next time._

## 6. A failure or missed deadline

Answers: tell me about a failure · a deadline you missed · a mistake you made and what you learned.

**Situation.** _Fill in: a real one with a real cost. Interviewers can tell a fake failure._

**Task.** _Fill in._

**Action.** _Fill in: when you realised, who you told and how early, what you did to contain it, and what you changed so it would not repeat._

**Result.** _Fill in: honest outcome, then the improvement afterwards._

**Reflection.** The point of this story is the change in how you work, not the failure itself. _Fill in that change in one sentence._

## 7. Someone I mentored or influenced

Answers: leadership without authority · mentoring · pushing for a change nobody asked for.

**Situation.** _Fill in: a junior you onboarded, a practice you introduced (code review norms, testing, a11y checks), or a decision you convinced the team to take._

**Task.** _Fill in._

**Action.** _Fill in: how you made the case, how you handled pushback, how you made it stick._

**Result.** _Fill in: what changed and how you know._

**Reflection.** _Fill in._
