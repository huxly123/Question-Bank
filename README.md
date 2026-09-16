# Question Bank

Personal interview preparation notes — theory, output questions, code snippets, and DSA practice, organized by topic. Every question's answer is collapsed behind a **details** toggle, so you can quiz yourself: read the question, answer it in your head, then expand to check.

## How this repo works

1. **Pick a topic** from the area's checklist. [TODO.md](TODO.md) is the dashboard that links to every checklist and shows progress per area.
2. **Learn it and write it up** in the matching note file (or a new file), following [template.md](template.md).
3. **Tick it in that checklist** and turn the item into a link to the section you wrote, so the checklist stays the "what's next" view and the notes stay the "what I know" view.
4. **Run `node progress.js`** from the repo root to refresh every progress bar.
5. **Revise** by opening a note file on GitHub and answering the questions before expanding them.

**Adding a new topic area:** create a folder with a `theory.md` and a `TODO.md` (see [template.md](template.md) and any existing area checklist), and link both below. The dashboard picks the new checklist up automatically.

## Notes

### JavaScript
- [Checklist](javascript/TODO.md) — JavaScript and TypeScript topics still to cover
- [Theory](javascript/theory.md) — data types, hoisting, closures, `this`, promises, classes, and more (33 questions)
- [Code snippets](javascript/code-snippets.md) — predict-the-output practice (35 snippets)

### React
- [Checklist](react/TODO.md) — React and Next.js topics still to cover
- [Theory](react/theory.md) — virtual DOM, reconciliation, controlled/uncontrolled components, hooks, HOCs
- [Code snippets](react/code-snippets.md) — debounce, throttle, infinite scroll

### System Design
- [Checklist](system-design/TODO.md) — system design, performance, browser internals, HTML/CSS, accessibility, testing and Node topics, including the Namaste course lessons
- [Security](system-design/security.md) — XSS, CSRF, CORS, CSP, cookies, HTTPS, JWT/OAuth/session auth
- [Networking](system-design/networking.md) — how the web works, REST, GraphQL, gRPC, CDN, load balancer, API gateway
- [Communication](system-design/communication.md) — polling, SSE, WebSockets, webhooks
- [Performance](system-design/performance.md) — rendering pipeline, Core Web Vitals, code splitting
- [Design patterns](system-design/design-patterns.md) — MVC, Atomic Design, module, singleton, HOC
- [Storage](system-design/storage.md) — cookies, localStorage, sessionStorage, IndexedDB, Cache Storage, main-thread blocking

### Behavioral
- [Experience questions](behavioral.md) — project stories, behavioral prep, and the prep checklist

### Machine Coding
- [Checklist](machine-coding/TODO.md) — components to build live, plus the course's low-level design lessons

### DSA
- [DSA tracker](DSA/TODO.md) — every problem, solved and open, with a patterns cheat sheet; solved ones link to their write-up
- [Array](DSA/array.md), [Binary Search](DSA/binary-search.md), [Recursion](DSA/recursion.md), [Stack and Queues](DSA/stack-queue.md), [String](DSA/string.md), [Two Pointers and Sliding Window](DSA/sliding-window.md) — self-quizzing problem notes with copyable JavaScript solutions

## Other

- [TODO](TODO.md) — progress dashboard linking every area checklist
- [progress.js](progress.js) — refreshes all counts and bars: `node progress.js`
- [Resources](resources.md) — interview question banks and job boards
- [Template](template.md) — format and conventions for new notes
