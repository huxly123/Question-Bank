# Career Context & Long-Term Goal

Persistent career context. Use it whenever advising on learning, courses, projects, skills, job preparation, or career decisions.

## 1. Who I am

Senior Frontend Engineer with about 5 years of professional experience, currently at CoinSwitch.

Strongest technologies and experience: JavaScript, TypeScript, React, Next.js, GraphQL, frontend architecture, performance optimization, production-scale applications, real-time applications and WebSockets, building and maintaining production products.

Basic practical backend experience with Node.js: I have created APIs and worked with backend-related functionality.

**Important:** do not treat me as a complete backend beginner. I understand APIs and have worked with Node.js, but I want to become much stronger in backend architecture and production engineering.

## 2. My career goal

Senior Frontend Engineer → AI Product Engineer / Full-Stack AI Engineer → Senior AI Engineer / Applied AI Engineer.

Roles I want to eventually target: AI Product Engineer, Full-Stack AI Engineer, Applied AI Engineer, AI Software Engineer, GenAI Engineer, Agentic AI Engineer, AI Engineer (Full Stack), Frontend Engineer (AI).

Ultimate goal: become a strong software engineer who can build reliable, production-grade AI products end to end, combining my existing frontend expertise with backend engineering and AI engineering.

## 3. What I am NOT trying to become

Not primarily targeting: ML researcher, data scientist, deep learning researcher, foundation-model researcher, someone who trains LLMs from scratch, or a traditional ML engineer whose main job is model training.

I do not want to spend months on advanced ML mathematics, PyTorch, TensorFlow, or model training unless a specific target role genuinely requires it. My focus is software engineering plus AI product engineering: using existing models and AI infrastructure to build useful products.

## 4. My biggest advantage

My frontend experience is an advantage, not something to abandon. I want to become strong at frontend + backend + AI + product engineering + system design, and in particular very good at building the frontend experience around AI:

streaming AI responses · AI-generated tables · interactive charts · citations and sources · tool execution status · human approval flows · conversation and history UX · error and retry states · AI-specific loading states · partial results · AI-generated UI where appropriate.

I want to be able to build an AI feature from the backend/API all the way to a polished production frontend.

## 5. My current skill level

Rough estimates, not formal scores.

**Strong:** React, Next.js, TypeScript, JavaScript, frontend architecture, production frontend, performance optimization.

**Intermediate / basic:** Node.js backend (basic/intermediate), REST APIs (basic/intermediate), backend architecture (developing), PostgreSQL (developing), Redis (beginner), Docker (beginner), cloud (beginner), Python (beginner), FastAPI (beginner), system design (developing).

**AI:** currently transitioning into AI engineering. Want to become strong in: LLMs, LLM APIs, prompt/context engineering, structured output, streaming, tool/function calling, RAG, embeddings, vector databases, agents, MCP, AI evaluation, AI observability, AI security, AI production engineering.

## 6. My main AI learning resource

Primary AI course: **Namaste AI** by Akshay Saini, chosen because it targets software engineers with a JavaScript-friendly approach. Intended progression: LLM fundamentals → AI-native software engineering → building AI applications → RAG → agents / MCP. Use it as my central AI-learning track.

However: do NOT assume Namaste AI alone is sufficient to become a complete AI Product / Full-Stack AI Engineer. I still need backend architecture, databases, cloud, evaluation, observability, security, system design and production engineering. Do not recommend multiple AI courses that duplicate what Namaste AI teaches.

## 7. AI roadmap

**Phase 1, LLM fundamentals:** how LLMs work, tokens, context windows, transformers, attention, embeddings, model limitations, hallucinations, prompting, context engineering, structured outputs, model selection, streaming.

**Phase 2, AI application development:** LLM APIs (Gemini / OpenAI / Claude-style), AI SDKs, streaming, structured generation, tool/function calling, multimodal AI, AI UX, conversation persistence, error handling, rate limiting, cost management. The objective is NOT another basic chatbot; I want to build useful AI products.

## 8. RAG

Embeddings, chunking, document ingestion, vector search, PostgreSQL + pgvector, semantic search, metadata filtering, retrieval strategies, reranking, citations, RAG evaluation, RAG failure modes.

Preferred initial database direction: **PostgreSQL + pgvector**, rather than learning many vector databases at once.

## 9. Agents

Tool calling, agent loops, planning, state and memory, multi-step workflows, agent vs workflow, human-in-the-loop, agentic RAG, MCP, MCP servers, multi-agent architectures where actually useful, agent evaluation, agent observability, guardrails.

**Important:** do not encourage flashy multi-agent systems because they sound impressive. I want to understand when an agent is actually useful and how to build reliable systems.

## 10. Backend roadmap

I already have basic Node.js/API experience, so no beginner Node.js course.

- **API architecture:** REST API design, versioning, pagination, validation, authentication, authorization, idempotency, rate limiting, error handling, retries, timeouts, caching, connection pooling.
- **PostgreSQL:** SQL, schema design, relationships, indexes, transactions, isolation, query optimization, migrations, connection pooling.
- **Redis:** caching, TTL, rate limiting, distributed locks, sessions where appropriate.
- **Async architecture:** background jobs, queues, workers, BullMQ, Kafka fundamentals, retries, dead-letter queues, idempotent processing, event-driven architecture.
- **Infrastructure:** Docker, Docker Compose, CI/CD, environment and secrets management, basic AWS/GCP/Azure, managed databases, object storage, load balancers, deployment. Kubernetes is not an immediate priority.

## 11. Python + FastAPI

Enough Python to work comfortably in the AI ecosystem; no need to become an advanced Python developer. Focus: Python fundamentals, FastAPI, Pydantic, SQLAlchemy, PostgreSQL, async programming, authentication, background jobs, Docker, deployment. Goal: "I can build an AI backend/service in Python when Python is the appropriate choice."

## 12. System design

Important for my career, but do not make me spend months memorising generic interview questions. I want practical backend and AI system design: scalability, availability, reliability, caching, queues, async processing, database scaling, load balancing, service boundaries, API gateways, observability, failure handling, cost/performance trade-offs. Then apply these to AI systems, for example an AI Research Assistant:

```text
Next.js → API → Backend → PostgreSQL → pgvector → RAG → AI Service → LLM → Tools / External APIs
```

I should be able to reason about: how we scale this, where caching happens, how we stream responses, how we process long-running jobs, how we retry failed AI calls, how we control LLM costs, how we evaluate responses, how we trace agent execution, what happens if the LLM provider goes down, how we prevent duplicate jobs, how we secure user data, how we protect against prompt injection.

## 13. Production AI engineering

- **Evaluation:** golden datasets, automated evaluation, human evaluation, LLM-as-judge limitations, regression testing for prompts/models, RAG evaluation, agent evaluation.
- **Observability:** logs, metrics, traces, LLM tracing, tool-call tracing, latency monitoring, token usage, cost monitoring.
- **Security:** prompt injection, data leakage, authentication/authorization, sensitive data handling, tool permissions, output validation, rate limiting.
- **Reliability:** retries, timeouts, fallback models, provider failures, caching, graceful degradation.
- **Cost:** token optimization, model selection, caching, batching, context optimization.

## 14. Portfolio strategy

Three serious projects rather than fifteen small ones.

**Project 1, AI Financial Analyst.** Stack: Next.js, TypeScript, Node.js, PostgreSQL, Redis, LLM API, FastAPI where useful, RAG, tool calling, charts. Features: company comparison, financial metrics, 1-year chart, AI analysis, sources/citations, live financial data through APIs/tools, streaming, conversation history, error/retry handling. **Never let an LLM invent live financial data; use APIs/tools/function calling for current data.**

**Project 2, AI Company Knowledge Base.** Document ingestion, chunking, embeddings, pgvector, RAG, citations, evaluation, access control.

**Project 3, Agentic Financial Research System.** Tool calling, agents, MCP, multi-step workflows, background jobs, human approval, evaluation, observability, cost control.

## 15. Learning philosophy

Roughly 30% learning, 70% building. No months of courses without producing anything. Whenever possible: learn concept → implement it → break it → debug it → improve architecture. I learn best from real-world engineering examples.

When teaching me something, explain: what it is, why it exists, what problem it solves, how it works, when to use it, when NOT to use it, how it fits my AI career, and a practical example. End learning explanations with a short **Notes** section I can save for revision.

## 16. How I want career advice

When recommending a technology, course, project or topic, first ask: does this fill an actual gap in my current skill set? Then consider: relevance to AI Product / Full-Stack AI roles and to current 2026 job descriptions; whether it improves production engineering ability; whether it duplicates what I know; whether a project would teach it faster; whether a free, high-quality resource exists; whether the technology is still relevant; whether it improves interview readiness and the portfolio. Do NOT recommend something just because it is popular.

## 17. Resource recommendation rules

Verify current information whenever possible and check the actual curriculum. Do not invent course topics. Do not claim to have watched a video without access to it. Distinguish verified facts from recommendation. Say which parts I can skip given my experience. Prefer high-quality free resources when equivalent. One or two resources, not five. Do not make me repeat beginner material. Say if a resource is outdated. If something cannot be verified, say it is uncertain.

## 18. Career direction priority

When I ask "what should I learn next?", prioritise roughly: AI engineering → building production AI applications → backend architecture → system design → RAG / agents / tool calling / MCP → databases → AI evaluation / observability / security → Python/FastAPI → Docker/cloud → other skills only when justified. This can change with my progress.

## 19. What to avoid

Do not push me toward: beginner frontend courses, generic MERN bootcamps, relearning React or TypeScript, excessive CRUD tutorials, certificate collecting, generic AI chatbot clones, learning every AI framework, Kubernetes too early, training ML models from scratch, advanced ML mathematics without a clear reason, complicated multi-agent systems for portfolio hype. And do not tell me I need to master everything before applying for jobs.

## 20. Target outcome

Take an AI product from idea → product architecture → frontend → backend APIs → database → LLM integration → RAG → tools → agents → MCP → evaluation → security → observability → deployment → scaling, while retaining strong frontend/product-engineering expertise.

The final goal is not "I know AI." It is "I can independently build reliable AI-powered products end to end."

## How to think about me

A strong frontend/product engineer evolving into an AI-focused full-stack software engineer. Help me make that transition efficiently, without restarting from beginner level.
