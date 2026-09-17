# Behavioral Questions

Flashcards for the non-technical rounds, grouped by who asks them. Read the question, answer out loud, then expand to check. Answers marked **model answer** are drafted method answers; adjust them to your voice. Answers marked **use story N** point into [stories.md](stories.md).

## HR screen

## 1. Tell me about yourself

<details>
<summary>Answer</summary>

Ninety seconds, three beats, present → past → future. No life history, no hobbies unless asked.

1. **Now:** role, company, what you own. "I'm a frontend engineer at _X_ where I own _Y_ for _N_ users."
2. **Proof:** one or two results with numbers. "Recently I led our Gatsby to Next.js migration, which cut build times from _A_ to _B_ and improved _metric_ by _C_."
3. **Why here:** what you want next and why this role fits. "I'm looking for _scope_, and this role's _thing from the job post_ is exactly that."

_Fill in and practise until it sounds spoken, not recited._

</details>

## 2. Why are you leaving your current company?

<details>
<summary>Answer</summary>

Forward-looking, never a complaint. Name what you want that you cannot get where you are: bigger scope, a product domain, a platform team, faster shipping. One sentence of genuine appreciation for the current place first. Never mention a manager, a colleague, or money as the reason.

_Fill in your one-line reason._

CoinSwitch is my first and only company, so expect the follow-up "why leave after four years, and why now?" A good shape: gratitude for the range I got (trading UI, a full-stack referral platform, a migration I led), then the specific thing I want next that it cannot give me.

</details>

## 3. Why do you want to work here?

<details>
<summary>Answer</summary>

Two specifics about them plus one about you. Read the engineering blog, the product, recent launches. "You ship _X_ to _N_ users, your team has written about _Y_, and I want to work on _Z_ at that scale." Generic praise scores zero.

</details>

## 4. Current CTC, expected CTC, notice period, buyout, relocation

<details>
<summary>Answer</summary>

Answer factually and briefly; this round is a filter, not a negotiation.

- **Current CTC:** state it plainly, fixed vs variable if asked.
- **Expected:** give a range whose bottom you would actually accept, anchored on market data for the level, and say "depending on the overall role and scope." Do not name a single number first if you can avoid it.
- **Notice period:** the real number, whether it is negotiable, and whether you would consider a buyout.
- **Relocation / remote:** a clear yes or no with any conditions.

_Fill in your numbers so you never improvise them._

</details>

## 5. Where do you see yourself in five years? Why should we hire you?

<details>
<summary>Answer</summary>

**Five years:** a direction, not a title. "Owning a product area end to end and mentoring others" or "deep frontend architecture across teams". Tie it to what this company offers.

**Why hire you:** three things you bring, each backed by one result. Match them to the job post's top three requirements.

</details>

## 6. What are your strengths and weaknesses?

<details>
<summary>Answer</summary>

Two strengths, each with a one-line example. One real weakness that is not a core job requirement, plus what you are doing about it. "I used to over-engineer early; now I write the simplest version first and refactor when a second use case appears" is a real answer. "I'm a perfectionist" is not.

</details>

## Hiring manager

## 7. What is the most complex problem you have solved?

<details>
<summary>Answer</summary>

**Use story 1** (migration) by default; story 2 or 3 if the role is debugging or performance heavy. Lead with the two-minute version: the constraint, the decision, the number. Stop and let them probe.

</details>

## 8. Walk me through your most recent project: architecture and your part in it

<details>
<summary>Answer</summary>

Draw it if there is a whiteboard. Client → API → data, then zoom into the frontend: routing, state, data fetching, rendering strategy, build and deploy. Then say precisely what you owned versus what the team owned. Expect follow-ups: why that choice, what would break at 10× traffic, what you would change. **Use story 1 or 4.**

</details>

## 9. What would you do differently on that project?

<details>
<summary>Answer</summary>

Have one honest answer per story, prepared. A good one names a trade-off you would rebalance ("I'd ship page by page behind a flag instead of the big cut-over; the risk was not worth the two weeks saved"). Never say "nothing".

</details>

## 10. How do you approach a new task or feature?

<details>
<summary>Answer</summary>

**Model answer.**

1. **Clarify** the goal and the user, then the edge cases and what is explicitly out of scope. Write it down in the ticket so everyone sees the same thing.
2. **Break it down** into vertical slices that each ship something usable, rather than layers (all the API first, all the UI later).
3. **Design the risky part first**: the data shape, the API contract, the state model. Name the trade-off and get a quick review before coding.
4. **Estimate** per slice with a buffer, and say what would change the estimate.
5. **Build** behind a feature flag, with tests at the level that catches the real risk.
6. **Ship and measure**: analytics or logs for the behaviour that matters, then remove the flag.
7. **Communicate early** the moment something slips. A surprise a day before the deadline is the failure, not the slip itself.

</details>

## 11. How do you estimate work, and what do you do when it slips?

<details>
<summary>Answer</summary>

**Model answer.** Estimate at the slice level, not the feature level; add a buffer for the unknowns you have named; state assumptions with the number. When it slips, say so on the day you know, with the cause and two options: cut scope or move the date. Let the PM choose. Track why estimates slip so the next one is better.

</details>

## 12. How do you handle ambiguous requirements or changing priorities?

<details>
<summary>Answer</summary>

**Model answer.** Ambiguity: ask the two or three questions whose answers change the design, propose a default for everything else, and write the assumptions down so they can be corrected cheaply. Priority change: acknowledge, ask what drops to make room, finish the current slice to a clean stopping point, and re-plan visibly. **Use story 2 or 6** for the concrete example.

</details>

## 13. Tell me about a disagreement with a PM or designer

<details>
<summary>Answer</summary>

**Use story 5.** Show that you understood their goal first, brought evidence rather than opinion, agreed on how the decision would be made, and committed to the outcome. Bonus if the example is a frontend one: performance budget vs a heavy design, accessibility vs a visual choice, scope vs a date.

</details>

## 14. Tell me about a deadline you missed or a failure

<details>
<summary>Answer</summary>

**Use story 6.** Own it plainly, explain how early you flagged it, what you did to contain the damage, and the specific change in how you work now. Spend most of the time on the last part.

</details>

## 15. How do you review code, and how do you mentor?

<details>
<summary>Answer</summary>

**Model answer.** Review for correctness and risk first, design second, style last and only if there is no linter. Ask questions instead of issuing orders; approve with nits rather than blocking on taste; review within a working day so nobody is stuck. Mentoring: pair on the first task, then review with explanations rather than fixes, then let them own something small end to end. **Use story 7.**

</details>

## 16. What do you want from your next role?

<details>
<summary>Answer</summary>

Two or three concrete things that this role offers, phrased as growth rather than escape: scope, domain, ownership of a system, working with a stronger team. Then one question back about whether the role actually offers them.

</details>

## Behavioral categories

## 17. Tell me about a conflict with a coworker

<details>
<summary>Answer</summary>

**Use story 5.** Coworker conflict wants the same shape as PM disagreement: their view, your view, the evidence, the decision, the commitment. If you have none, say how you prevent them: early design reviews and written decisions.

</details>

## 18. Tell me about feedback you received and acted on

<details>
<summary>Answer</summary>

_Fill in a real piece of critical feedback, who gave it, what you changed, and how you know it stuck._ The interviewer is testing whether you can hear criticism without defending. Pick something specific and slightly uncomfortable.

</details>

## 19. Tell me about something you had to learn fast

<details>
<summary>Answer</summary>

**Use story 1** if Next.js was new to you at the time, otherwise _fill in_. Say how you learned it (docs, source, a spike, a person), how long it took, and what you shipped with it.

</details>

## 20. Tell me about a time you influenced a decision without authority

<details>
<summary>Answer</summary>

**Use story 7.** Influence stories work when you show the evidence you gathered and the people you brought along, not the argument you won.

</details>

## 21. Tell me about something you pushed for that nobody asked you to do

<details>
<summary>Answer</summary>

_Fill in: a tooling improvement, a monitoring gap you closed, tests you added, an accessibility fix._ Ownership questions want initiative plus follow-through, so include how you got it adopted.

</details>

## 22. What frustrates you at work? How would colleagues describe you?

<details>
<summary>Answer</summary>

Frustration: pick a process frustration you actively fix, such as unclear requirements or slow reviews, and say what you do about it. Colleagues: two or three adjectives with a one-line example each. _Fill in._

</details>

## 23. How do you stay up to date?

<details>
<summary>Answer</summary>

Name two or three specific sources and one thing you recently learned and used. _Fill in._ Generic "I read blogs" scores nothing.

</details>

## Questions to ask them

## 24. Questions for the engineers

<details>
<summary>Answer</summary>

- What is the hardest engineering problem the team is working on right now?
- How are technical decisions made, and can you give a recent example?
- What does the deploy process look like, from merge to production?
- What is the most frustrating part of working here?
- What would the most important problem be for me to solve in the first three months?

</details>

## 25. Questions for the hiring manager

<details>
<summary>Answer</summary>

- What does success look like for this role at six months?
- How do you ramp up new engineers, and who would I work with most?
- How is performance evaluated?
- What is the team's biggest challenge this year?
- How do you handle disagreements between senior engineers?

</details>

## 26. Questions for HR

<details>
<summary>Answer</summary>

- What are the remaining steps and the expected timeline?
- What does the level and compensation structure look like for this role?
- Anything about the role or team I should know before the next round?

Never ask anything the job post or website already answers.

</details>
