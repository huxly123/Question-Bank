# Work Experience Context

Persistent record of what I have actually built and owned, so advice, behavioral stories and project write-ups draw on real detail rather than guesses. Sourced from my resume (September 2026); italic prompts mark numbers and specifics the resume does not carry yet. Contact details are deliberately left out of this file.

Profile links: [linkedin.com/in/huxlysingh](https://linkedin.com/in/huxlysingh/) · [github.com/huxly123](https://github.com/huxly123)

## Summary

Frontend engineer with 4+ years building scalable, high-performance web applications in TypeScript, JavaScript, React, Next.js and Remix. Experienced in architecting modular frontend systems, building reusable UI component libraries, and optimising performance for large-scale products. Strong background in GraphQL integrations, SSR/SSG architectures and modern frontend practice, working with cross-functional teams while holding a high bar on code quality, performance and user experience.

## CoinSwitch — Senior Software Engineer (Feb 2022 – present)

**Product and users:** CoinSwitch crypto trading platform (web), including the Futures and Options trading surfaces, and the Lemonn stock exchange platform. _Fill in: team size, monthly active users or traffic, which surfaces are mine day to day._

**Tech stack I worked in:** TypeScript, JavaScript, React, Next.js, Remix, GraphQL, Node.js, Express, Redux, Jotai, Tailwind, Sass, Material UI, D3.js; Firebase, AWS (CodePipeline, CloudFront, S3), Cloudflare, Redis; Webpack, Jest, Storybook, Jenkins, Amplitude.

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
