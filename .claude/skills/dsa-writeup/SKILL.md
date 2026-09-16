---
name: dsa-writeup
description: Record a newly solved DSA problem in this Question-Bank repo — verify the user's JavaScript solution against the examples, append a flashcard entry to the right DSA/*.md note, tick and link the problem in DSA/TODO.md, refresh the progress bars with node progress.js, and commit. Use this whenever the user says they solved, finished, cracked or did a DSA / LeetCode / GfG problem, pastes a JavaScript solution, or says things like "add this to the notes", "write up <problem>", "tick <problem>", "mark <problem> done", "record this one" — even if they don't mention a file or the tracker. Also use it when they want an existing DSA note entry fixed, re-verified or improved.
---

# DSA write-up

The user has just solved a problem and hands you its name plus their JavaScript. Your job is to turn that into a revisable flashcard in the repo and move the tracker forward, in one pass, without them touching Markdown.

The write-up is the study step, not paperwork. The user revises later by reading the problem and trying to recall the pattern and the key insight before expanding the answer. So the pattern name and the one-sentence insight matter more than the code.

## What a finished run looks like

- The problem has a numbered entry at the end of the right `DSA/<topic>.md` note, in the exact format below.
- Its line in `DSA/TODO.md` is ticked, links to that entry, and carries the pattern and sheet tag.
- `node progress.js` has been run from the repo root so every count and bar is current.
- One commit, message `dsa: <problem name>`, pushed to `main`.
- A short reply: where it went, any bug you found in their code, and the new solved count.

## Step 1: Locate the problem

Grep `DSA/TODO.md` for the problem name. The open line looks like `- [ ] Move Zeroes` or `- [ ] Longest Consecutive Sequence **B75**`. Note which numbered section it sits in; that decides the note file:

| Tracker section | Note file |
| --- | --- |
| 1. Arrays | `array.md` |
| 2. Two Pointers & Sliding Window | `sliding-window.md` |
| 3. Strings | `string.md` |
| 4. Stack & Queues | `stack-queue.md` |
| 5. Binary Search | `binary-search.md` |
| 6. Recursion | `recursion.md` |
| 7. Linked List | `linked-list.md` |
| 8. Binary Tree | `binary-tree.md` |
| 9. Binary Search Tree | `bst.md` |
| 10. Trie | `trie.md` |
| 11. Backtracking | `backtracking.md` |
| 12. Heap | `heap.md` |
| 13. Greedy & Intervals | `greedy.md` |
| 14. Dynamic Programming | `dynamic-programming.md` |
| 15. Graphs | `graphs.md` |
| 16. Bit Manipulation | `bit-manipulation.md` |
| 17. Matrix | `matrix.md` |

If the note file does not exist yet, create it with the same two-line intro every note uses:

```md
# <Section title, e.g. Linked List>

Read the problem, decide the pattern and sketch the approach in your head, then expand **Answer** to check. Code blocks are complete functions you can copy as-is.
```

A new note file is referenced from two places that would otherwise go stale, so update both in the same change:

- the list of note files in the intro paragraph of `DSA/TODO.md` (the sentence starting "When you solve one, write it up in the matching topic note"), keeping the files in tracker-section order;
- the root `README.md`, where the DSA section has one line listing every note as `[Title](DSA/file.md)`; add the new note in the same position.

If the problem is not in the tracker at all, it is off-plan but still worth recording: write it up in the best-fitting note and add a ticked line to the matching tracker section (see Step 5) with no sheet tag.

## Step 2: Verify the solution before writing anything

Never write code into the notes that you have not seen pass. Put the user's function plus the problem's canonical examples (LeetCode's, or the ones in the tracker source) into a scratch file and run it with `node`. Include at least one edge case the examples skip: empty input, single element, all-same values, k larger than n, whichever applies.

If it fails, do not quietly swap in your own solution. The user is learning, and a silently corrected bug is a bug they will repeat in the interview. Make the smallest fix that keeps their approach, and name the bug and the failing input in your reply. If their approach is correct but asymptotically worse than the standard one, keep theirs as an **Alternative** block with its own complexity line and put the standard approach first, saying so in the reply.

Linked list and tree problems need a tiny helper to build the structure from an array. Write it in the scratch file, not in the note.

## Step 3: Clean the code

The block must be copyable into any editor and readable in an interview. Keep the user's logic and variable intent; normalise the surface:

- A named function, `camelCase`, matching the LeetCode name where one exists (`moveZeroes`, `reverseList`, `isAnagram`). Top-level script with hardcoded input becomes a function taking parameters.
- `const` by default, `let` only for what changes. Two-space indent, semicolons.
- No `console.log`, no test calls, no commented-out attempts.
- Short inline comments only where a line is not self-explanatory. Do not narrate every line; the key insight sentence carries the explanation.

## Step 4: Append the entry

Number it as the next `##` in that note. Use this shape exactly; the surrounding notes depend on it for anchors and the tracker links depend on the heading text.

~~~md
## N. Problem Title

One or two sentence statement in plain words. Say what is given and what to return.

```text
Input:  nums = [0, 1, 0, 3, 12]
Output: [1, 3, 12, 0, 0]

Input:  nums = [0]
Output: [0]
```

<details>
<summary>Answer</summary>

**Pattern:** the technique, phrased like a row in the patterns cheat sheet at the bottom of `DSA/TODO.md`.

**Key insight:** one sentence, the justification you would say aloud to an interviewer for why this approach works.

**Complexity:** O(n) time, O(1) space.

```js
function moveZeroes(nums) {
  ...
}
```

</details>
~~~

Guidance for the parts that need judgement:

- **Statement**: rewrite in your own words, not the LeetCode paragraph. Constraints only if they change the approach.
- **Examples**: two or three, aligned `Input:` / `Output:` inside one `text` block. Add a `// short why` after an output when the answer is not obvious from the input.
- **Pattern**: reuse an existing cheat sheet row name when one fits. If the problem introduces a genuinely new technique (fast and slow pointers, BFS by level, backtracking with pruning), add a row to the cheat sheet table at the bottom of `DSA/TODO.md` with a "recognise it when" phrase and link the problem from it.
- **Key insight**: the one thing that, once said, makes the code obvious. Not a description of the loop.
- **Alternative**: when there is a second approach worth knowing (the user's brute force, an O(1)-space variant), add it after the main block as `**Alternative (label):** one line of why`, then its own `js` block.

Leave a blank line after `<summary>` and before `</details>`, or GitHub will not render the Markdown inside.

## Step 5: Update the tracker

Turn the open line into a solved line. The solved form is:

```md
- [x] [Problem Title](note-file.md#anchor) — Short pattern (N, B75)
```

- **Anchor**: the heading, lowercased, every character that is not a letter, digit, space or hyphen removed, spaces turned into hyphens. `## 3. Find Duplicates` becomes `#3-find-duplicates`. `## 5. Maximum Subarray (Kadane's Algorithm)` becomes `#5-maximum-subarray-kadanes-algorithm`. Check by grepping the note for the heading you linked.
- **Short pattern**: two to five words, the same idea as the entry's Pattern line.
- **Sheet tag**: says which study sheets the problem belongs to, so the user can see coverage per sheet later. Work it out from two facts: an open line tagged `**B75**` was added from Blind 75 and is *not* on the Namaste sheet; an untagged open line came from the Namaste sheet. Then check `references/blind75.md` in this skill, because many Namaste problems are also Blind 75 problems. Combine:
  - untagged and not in the Blind 75 list → `(N)`
  - untagged and in the Blind 75 list → `(N, B75)`
  - tagged `**B75**` → `(B75)`
  - off-plan (not in the tracker) → no tag
- **Position**: solved lines sit at the top of each section, before the open ones. Move the ticked line up to the end of the solved block.

Then run the progress script from the repo root and check the DSA line it prints went up by one:

```bash
node progress.js
```

## Step 6: Commit and push

Stage only the files you touched: the note, `DSA/TODO.md`, and any new note file. Commit as `dsa: <problem name>` and push to `main`. The repo is the user's personal notes and every previous write-up was pushed straight to `main`.

## Reply

Keep it to a few lines: the note and heading number the problem landed in, the pattern you filed it under, the bug and failing input if you found one, and the new progress line from the script. If you added a cheat sheet row or created a new note file, say so.
