# Work Experience Context

Persistent record of what I have actually built and owned, so advice, behavioral stories and project write-ups draw on real detail rather than guesses. Sourced from my resume (September 2026); italic prompts mark numbers and specifics the resume does not carry yet. Contact details are deliberately left out of this file.

Profile links: [linkedin.com/in/huxlysingh](https://linkedin.com/in/huxlysingh/) · [github.com/huxly123](https://github.com/huxly123)

## Summary

Frontend engineer with 4+ years building scalable, high-performance web applications in TypeScript, JavaScript, React, Next.js and Remix. Experienced in architecting modular frontend systems, building reusable UI component libraries, and optimising performance for large-scale products. Strong background in GraphQL integrations, SSR/SSG architectures and modern frontend practice, working with cross-functional teams while holding a high bar on code quality, performance and user experience.

## CoinSwitch — Senior Software Engineer (Feb 2022 – present)

**Product and users:** CoinSwitch crypto trading platform: the marketing website, the CoinSwitch Pro web trading app (futures and options), the React Native mobile app with its Flutter add-to-app Pro Futures module, and the Lemonn stock exchange platform. _Fill in: team size, monthly active users or traffic, which surfaces are mine day to day._

**Tech stack I worked in:** TypeScript, JavaScript, React, React Native, Next.js, Remix, GraphQL, Node.js, Express, Redux, Jotai, Tailwind, Sass, Material UI, D3.js; Flutter and Dart (Riverpod, GoRouter, Shorebird OTA) for the Pro Futures migration; Firebase, AWS (CodePipeline, CloudFront, S3), GCP (GKE, Artifact Registry), Cloudflare, Redis; Webpack, Jest, Vitest, Storybook, Jenkins, Argo Workflows, Helm charts; observability with New Relic and then Last9 (OpenTelemetry, RUM), Amplitude.

### Projects and achievements

**Options Exchange and Options Strategy Builder (frontend)**
- Problem: options trading needs dense, real-time, data-intensive UI: an options chain, charts, and strategy calculations that must stay correct while prices move.
- My role: developed the frontend, including the Options Chain table and TradingView chart integrations, and the options strategy calculation logic.
- Approach: modular, maintainable code so the strategy calculations and the trading UI could evolve independently.
- Result: supports real-time trading workflows. _Fill in: number of active traders, update frequency handled, any latency or render-time figures._
- Hard part: _fill in: keeping the chain table fast under live updates? the strategy maths? TradingView integration quirks?_

**INR-based trading for Futures and Options**
- Problem: users had to think in a non-INR denomination; placing trades directly in INR removes friction.
- My role: built the UI workflows, dynamic price and rate conversion logic, and modular currency conversion utilities.
- Result: accurate real-time conversions across the trading interfaces. _Fill in: adoption or volume impact, rounding and precision edge cases you had to solve._

**Lemonn referral program (end to end)**
- Problem: the Lemonn stock exchange platform needed a referral programme where users sign up through referral links and earn rewards based on successful referrals and their trading activity.
- My role: designed and developed both frontend and backend in Next.js; architected the referral tracking logic, reward calculation workflows and data storage on Firebase.
- Approach: secure and scalable reward processing. _Fill in: how rewards were calculated and deduplicated, how abuse was prevented, why Firebase over Postgres._
- Result: _fill in: referrals or sign-ups driven, reward volume processed._
- This is my strongest full-stack story: I owned the data model and the backend workflows, not only the UI.

**Gatsby to Next.js migration of the CoinSwitch website (led)**
- Problem: slow builds and static content that required a redeploy to update.
- My role: led the migration, optimised the build pipeline, enabled Incremental Static Regeneration so dynamic content updates without redeployments.
- Result: build time reduced by about 70%; significantly improved application performance. _Fill in: build time before and after in minutes, Lighthouse or Core Web Vitals before and after, how the cut-over was sequenced._
- This is the behavioral story interviewers drill on; see [behavioral/stories.md](behavioral/stories.md).

**Technical SEO for the CoinSwitch website**
- Collaborated with the SEO team: technical SEO best practices, page structure and metadata, frontend performance for search visibility and ranking.
- Result: improved overall SEO score. _Fill in: score before and after, organic traffic or ranking change._

**Web server proxy and middleware layers securing backend APIs**
- Problem: backend APIs needed consistent security enforcement and efficient routing from the web tier.
- My role: implemented and enhanced the proxy and middleware layer: centralised request handling with authentication validation, rate limiting, and request sanitisation against XSS and unauthorised access; optimised API routing and response efficiency.
- Why it matters: this is real backend work in production, relevant to the full-stack round. _Fill in: Node/Express or Next.js middleware? where rate limits were stored (Redis)? request volume._

**Frontend security and performance hardening**
- Lazy loading of components and assets, script loading optimisation (defer/async), code splitting, bundle size optimisation.
- Content Security Policy, XSS protection, secure handling of API requests.
- Result: improved page load performance and a more secure client-side architecture. _Fill in: bundle size and load-time numbers._

**RBAC trade-on-behalf for CoinSwitch Pro (Jan – Aug 2026, built end to end)**
- Problem: employees (super-admins, relationship managers) needed to view and trade on behalf of specific client accounts inside the Pro web app, with strict control over who can act for whom and a clean audit of what happened.
- My role: I owned the feature from requirements to production. In January 2026 I defined the API contract with the backend team (role check for the logged-in employee, client list, request-access, admin-has-access-over-client), set the timeline in February, and built the web app and Node BFF side: authentication of the employee from the session JWT, a client switcher, per-request on-behalf context forwarded to upstream services as headers, and cookies carrying the selected client and mode.
- Hardening (Aug 2026), when the feature was re-enabled after being disabled: rewrote the gate as `rbacMiddlewareV2`, an allow-list from an environment-driven employee → clients map parsed fail-closed, mounted once on the BFF; added a second authorization check against the permissions service (`canTrade`) so on-behalf needs both the mapping and a live grant, fail-closed to 503 if the service is down; reduced the grant cache from 24 hours to 10 minutes so revocation propagates; renamed cookies; removed the affiliate-operator variant end to end across eleven files; added a super-admin KYC gate; stopped an unnecessary upstream call for every non-RBAC user; and reviewed the branch against fifteen security findings, fixing the high and medium ones test-first (unverified employee id from a decoded JWT, an encrypted-id helper that failed open, a debug header leaking to logs, PII in log payloads, an affiliate path that inherited trading headers). Shipped as sibling PRs across uat, pre-prod and master with matching Helm chart env changes.
- Result: _fill in: number of employees and clients enabled, incidents avoided, what the audit trail looks like._
- Why it matters for interviews: authentication vs authorization, fail-closed design, header propagation through a BFF, secrets and config per environment, and a security review loop, all in one story.

**New Relic → Last9 observability migration for CoinSwitch Pro web (Jul – Aug 2026, led)**
- Problem: the Pro web app's monitoring ran on New Relic, which was being retired company-wide; without a replacement the app would have had zero observability.
- My role: led the migration for the Pro web app and its Node BFF. Instrumented the server with OpenTelemetry traces and logs (explicit http, express, winston and ioredis instrumentation only, after dropping the auto-instrumentation bundle over vulnerable transitive dependencies) and the browser with Last9 RUM. Designed the log taxonomy (`cspro.api.error` on every failed upstream call with URL, status, duration, request id, user id and an allow-list-scrubbed payload; `cspro.api.latency` for slow successes; `cspro.server.error`), the sampling strategy (1% traces and 1% RUM sessions in production, 100% in lower environments, adjustable per request without a deploy) and the numeric user-id plumbing so frontend and backend events join. Built the production Ops dashboard with a top-down triage layout: critical errors and API error rate → user experience (broken pages, socket errors, order latency) → server health (4xx, slow calls, p95, traffic). Wrote the env-var runbook the other frontend teams used and documented eleven OpenTelemetry integration traps (sampler defaults, missing env label, `recordException` without error status, cardinality from client-controlled labels, histogram buckets).
- Hard part: the company npm proxy quarantined new OpenTelemetry releases, so the stack had to be pinned; the RUM SDK leaked one event's exception attributes onto later custom events; and a merged deploy PR shipped without a payload-scrubbing fix, which is why every log field is now allow-listed rather than deny-listed.
- Result: _fill in: date New Relic was switched off, dashboards and alerts that replaced it, cost or coverage numbers if any._

**React WebView → Flutter migration of CoinSwitch Pro Futures inside the crypto app (2026)**
- Context: the CoinSwitch crypto app is React Native. CoinSwitch Pro, the futures and options trading UI, was a separate React web app (`coinswitch.co/pro/futures`) that the app opened inside a WebView through a bridge layer (`WebViewLauncher`, `WebViewStackManager`). I had been one of the main contributors to that Pro web app since July 2022: 700+ commits covering futures, options, order pad, PnL, partial exits, the Kuber (INR) futures flows and the trading terminal.
- The migration: the Pro Futures screens (home, trade, orders, positions, order pad, adjust leverage, candle chart) were rebuilt natively in Flutter as an add-to-app module (`coinswitch_app`) hosted by the React Native app over a MethodChannel bridge (`FlutterBridge`, `onFlutterNavigateHandler`), with Riverpod for state, GoRouter for navigation, design-system parity with the GenesisUI component library, Shorebird OTA for Dart-only patches, and a canary → stable release gate.
- My role (from the repo history, Aug–Sep 2026): 73 commits in the Flutter module, about 200 file changes in `lib/platform/pro`, plus Kuber futures, the shared platform layer, the candle chart and tests. Concretely: ported the Adjust Leverage money math (liquidation price with buffered initial margin, cost-to-close, fee sourcing) from the React web implementation to Flutter and aligned it with the backend, including four rounds of review fixes around REST fallback, cancel confirmation and concurrency; visual-QA parity fixes against the mobile web version; scalper (Bolt) and expert-picks fixes; DEX scale-down feature flags implemented across React Native, Flutter and the GraphQL BFF; funds-shortfall and leverage-slider behaviour for Pro and Kuber. Around the migration I also built release tooling: OTA patch scoping, release-line parity checks, pre-release gap audits, on-device screenshot test suites and frame-jank profiling.
- Why it matters for interviews: it is a cross-stack story (React web → Flutter → React Native host → Node BFF) about parity, money-critical calculations and release safety, not a UI rewrite.
- _Fill in: why the team moved off the WebView (jank? native feel? OTA control? cold start?), which screens you owned end to end vs contributed to, the timeline and team size, and any measured result (frame drops, crash-free rate, load time, adoption)._
- Related team context, not mine: a colleague's proof of concept rebuilt the crypto home screen with server-driven UI (Stac) inside the same RN host plus Flutter add-to-app setup, and concluded Shorebird OTA covered most of the "ship without a release" goal with fewer moving parts.

**AWS → GCP migration (2026)**
- I worked on CoinSwitch's migration from AWS to Google Cloud.
- Company context (from the internal migration docs): a code-change audit across 39 exchange (CSX) repos and 68 CSK repos mapped AWS services to GCP equivalents (SQS/SNS → Pub/Sub, S3 → Cloud Storage, Lambda → Cloud Run, Secrets Manager → Secret Manager, CloudWatch → Cloud Logging and Monitoring); infrastructure moved to GKE with a drain-and-switch cutover grouped by data domain and a two-week AWS parallel run for rollback; CI built images once with Argo Workflows and Kaniko and pushed to both ECR and Artifact Registry; the Helm charts repo routed GCP deployments by a `gcp/` path prefix so AWS pipelines stayed untouched.
- _Fill in precisely, this is the part interviewers will probe: which services or repos you migrated (the web servers for the CoinSwitch website and Pro? the GraphQL BFF? the Lemonn platform?), what you changed (Dockerfiles and registry paths, environment and secrets config, storage or CDN wiring, internal service endpoints), how you tested and cut over, and what broke._
- Possibly related evidence in the BFF repo, August 2026, to confirm: I moved the broker gateway base URL and the TradingView sub-account call to internal gateway endpoints across all environment files and fixed the internal gateway being plain HTTP rather than HTTPS.

**Code reviews and mentoring**
- Conducted code reviews and gave technical guidance to junior developers on code quality, modular architecture and performance; worked with cross-functional teams on scalable, maintainable frontend implementations.
- _Fill in: how many people, one concrete example of a practice you introduced (this feeds behavioral story 7)._

### Incidents and debugging I handled

_Fill in from memory. Known so far from the behavioral notes: the app-to-web login issue and the large user-list batch processing; root causes and numbers still to be written down._

### What I would do differently

_Fill in; one line per project above becomes the "what would you change" answer._

## Education

- Masai School, Full Stack Web Development Program, Apr 2021 – Dec 2021
- Anna University, Chennai, BTech Chemical Engineering, May 2016 – Jun 2020

## Earlier roles

None. CoinSwitch is my first and only company; I joined in February 2022 straight after the Masai School programme. When an interviewer asks about "other companies" or "different environments", the honest framing is breadth inside one company: crypto trading (Futures, Options), the Lemonn stock platform, the marketing website, and both frontend and backend work.
