# Topic Template

Copy this format when adding a new note file or a new question to an existing one.

---

# <Topic Name> Theory

## 1. <Question written the way an interviewer would ask it?>

<details>
<summary>Answer</summary>

Short, clear answer in 1–3 sentences first. Then details, lists, or comparisons.

- Key point one
- Key point two

```js
// Minimal code example demonstrating the concept
const example = true;
```

</details>

## 2. <Next question?>

<details>
<summary>Answer</summary>

Answer here.

</details>

---

## Conventions

- **One file per topic area**, named `theory.md` (plus `code-snippets.md` if the area has output-question practice). New area = new folder.
- **Numbered `##` headings** phrased as questions — the heading is the flashcard prompt.
- **Answers always wrapped in `<details><summary>Answer</summary>`** so the file is self-quizzing on GitHub. Keep a blank line after `<summary>` and before `</details>` so Markdown renders inside.
- **Code in fenced blocks** with a language tag (`js`, `jsx`, `text` for ASCII diagrams).
- For output questions: show the code **without** revealing comments; put the output and explanation inside the details block (see `javascript/code-snippets.md`).
- When you add a new area, list its topics in [TODO.md](TODO.md) and link the file from [README.md](README.md).
