---
name: topic-writeup
description: Record a learned interview topic in this Question-Bank repo (JavaScript, TypeScript, React, Next.js, system design, performance, security, storage, HTML/CSS, accessibility, testing, Node.js, machine coding) — write the question-and-answer flashcard into the right note, tick and link the item in that area's TODO.md checklist, refresh the bars with node progress.js, and commit. Use this whenever the user says they learned, read up on, studied or finished a topic, pastes rough notes or a paragraph they wrote, asks to "write up <topic>", "add notes on <topic>", "add <topic> to the notes", "tick <topic>", "add this output question", or wants an existing note entry expanded or corrected — even if they don't name a file or the checklist. Not for DSA problems: those go through the dsa-writeup skill.
---

# Topic write-up

The user learned something and wants it in the repo as a flashcard they can revise from, with the checklist moved forward, in one pass. Sometimes they hand you their own rough notes; sometimes just a topic name. Either way, the output is the same shape, and the reply says which of the two you did.

The notes are revised on GitHub by reading the question, answering in your head, then expanding. So the heading must be a real interviewer question and the first sentence of the answer must be the one they would say out loud. Detail comes after.

## What a finished run looks like

- A numbered entry at the end of the right note file, in the format of that file's neighbours.
- The item in the area's `TODO.md` ticked and linked to the entry.
- `node progress.js` run from the repo root so all bars are current.
- One commit `notes: <topic>` pushed to `main`.
- A short reply: where it landed, whether you reshaped their notes or drafted from scratch, anything you corrected or could not verify, and the new progress line for that area.

## Step 1: Locate the item and pick the note file

Grep every checklist for the topic: `grep -rn "<topic>" */TODO.md`. The open line looks like `- [ ] Event delegation` or `- [ ] ⭐ Hydration: what it is, ...`. The section it sits in decides the note file:

| Checklist section | Note file |
| --- | --- |
| javascript: JavaScript | `javascript/theory.md` |
| javascript: TypeScript | `javascript/typescript.md` |
| javascript: Output questions | `javascript/code-snippets.md` |
| react: React | `react/theory.md` (hooks and small implementations: `react/code-snippets.md`) |
| react: Next.js | `react/nextjs.md` |
| system-design: Fundamentals | `system-design/networking.md` |
| system-design: Frontend system design questions, High level design | `system-design/hld.md` |
| system-design: Architecture & patterns | `system-design/design-patterns.md` |
| system-design: Data fetching & API design | `system-design/data-fetching.md` |
| system-design: Real-time & offline | `system-design/communication.md` |
| system-design: Auth in SPAs, Security | `system-design/security.md` |
| system-design: Deployment & delivery | `system-design/deployment.md` |
| system-design: Runtime & browser internals | `system-design/browser-internals.md` |
| system-design: HTML & CSS | `system-design/html-css.md` |
| system-design: Accessibility | `system-design/accessibility.md` |
| system-design: Database & caching | `system-design/storage.md` |
| system-design: Logging & monitoring | `system-design/monitoring.md` |
| system-design: Testing | `system-design/testing.md` |
| system-design: Performance | `system-design/performance.md` |
| system-design: Node.js | `system-design/nodejs.md` |
| system-design: Interview approach | `system-design/interview-approach.md` |
| machine-coding: any | `machine-coding/<kebab-name>.md`, one file per component |

Files that do not exist yet are created on first use with a one-line `# Title` heading (look at `javascript/theory.md` for the plain form, `javascript/code-snippets.md` for one with an intro line). When you create a note, link it from the root `README.md` under that area, in the same `- [Title](path) — what it covers` shape as its neighbours. The checklist's own intro paragraph lists its note files too where one exists; keep that in step.

Some README lines carry a count, such as "(33 questions)" or "(35 snippets)". When you append to a note whose README line has one, bump it. A stale count is the kind of small rot that makes the README stop being trusted.

If the topic is in no checklist, it is off-plan but still worth recording: write it up and add a ticked line to the best-fitting section.

## Step 2: Decide the mode and be honest about it

**Notes given.** Reshape what they wrote into the format. Keep their claims, examples and wording where it is already clear; fix grammar and structure freely. Do not add facts they did not state unless the answer would be wrong or incomplete without them, and when you do, say so in the reply. If something they wrote is incorrect, correct it in the note and name the correction in the reply, because a wrong flashcard gets memorised.

**Name only.** Draft the entry yourself as the model answer an interviewer expects. Stick to well-established material; no invented statistics, version numbers or benchmarks. If a detail is useful but you are not certain of it (a behaviour that changed between framework versions, say), either leave it out or keep it and name it in the reply as unverified. Never let an uncertain claim sit in the note unflagged, because the note will be memorised as fact. Say in the reply that this was drafted, not reshaped, so they know to read it critically before trusting it in revision.

## Step 3: Write the entry

Number it as the next `##` in the file. Match the neighbours; there are three shapes in the repo.

**Theory (most notes):** heading is the interviewer's question, answer collapsed.

~~~md
## N. What is event delegation and why use it?

<details>
<summary>Answer</summary>

One to three sentences that answer the question outright. This is what they will say in the interview.

Then the detail: how it works, when to use it, trade-offs. Bullets or a short comparison table where that reads better than prose.

```js
// minimal example that demonstrates the concept, not a full app
```

</details>
~~~

**Output question (`javascript/code-snippets.md`):** code visible, output collapsed. Run the snippet with `node` before writing the output; never guess it.

~~~md
## N. Short label for the trap

```js
// the snippet exactly as it should be predicted
```

<details>
<summary>Output & why</summary>

```text
the exact output
```

Why, in a few sentences, naming the rule that explains it.

</details>
~~~

**Implementation (`react/code-snippets.md`, `machine-coding/*.md`):** heading, one line saying what it does, then the code, no collapse. Machine coding files also carry a `## Requirements`, `## Approach` and `## Gotchas` before the code, because the point of those is to rehearse the conversation with the interviewer, not just the code.

Guidance on the parts that need judgement:

- **Heading**: phrase as the question you would be asked, even if the checklist text is a noun ("Event delegation" becomes "What is event delegation and why use it?"). Keep it under about twelve words so the anchor stays readable.
- **First sentence**: the direct answer. If the reader only remembers this line, they pass the question.
- **Code**: minimal, runnable, fenced with a language tag (`js`, `jsx`, `ts`, `text` for diagrams). Run plain JS with `node` when the answer depends on what it prints.
- **Comparisons** ("X vs Y", "when to use which") read best as a small table.
- Leave a blank line after `<summary>` and before `</details>` or GitHub renders the inside as raw text.

## Step 4: Tick the checklist

Turn the open line into a link. Keep the checklist's own wording as the link text, drop the ⭐ (priority no longer matters once it is done), and link with the path relative to the checklist's folder:

```md
- [ ] ⭐ Event delegation
- [x] [Event delegation](theory.md#34-what-is-event-delegation-and-why-use-it)
```

- **Anchor**: heading lowercased, everything except letters, digits, spaces and hyphens removed, spaces to hyphens. Backticks and punctuation vanish, so `## 3. Difference between `==` and `===`` becomes `#3-difference-between--and-`. Confirm by grepping the note for the heading.
- **Position**: in a plain section, ticked items sit above open ones; move the line up to the end of the ticked block. In a section organised by bold sub-groups (Performance), leave it in place so the grouping survives.
- **Several checklist lines covered by one entry** (an answer that settles both "Hooks" and "Custom hooks"): tick each and point them at the same anchor.

Then, from the repo root:

```bash
node progress.js
```

It prints one line per area; the area you touched should have gone up by the number of lines you ticked.

## Step 5: Commit and push

Stage the note, the area checklist, the root `TODO.md` (the progress script rewrites its dashboard, so it is always part of the change), and `README.md` when you touched it. Commit as `notes: <topic>`, with the topic spelled as the checklist spells it (`notes: Event delegation`, `notes: Hydration`), and push to `main`. Every previous write-up in this repo went straight to `main`.

## Reply

A few lines: file and heading number, reshaped or drafted, anything corrected or added beyond their notes, and the progress line. If you created a note file or linked it from the README, say so.
