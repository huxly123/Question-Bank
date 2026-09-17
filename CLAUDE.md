## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Career context

@career.md
@experience.md

Read both before advising on learning, courses, projects, skills, job preparation, or career decisions, and before writing or reviewing behavioral stories. career.md sets the goal (frontend engineer → AI product / full-stack AI engineer), the current skill levels, what not to recommend, and the required shape of learning explanations (what / why / problem / how / when / when not / career fit / example, ending with a **Notes** section).
