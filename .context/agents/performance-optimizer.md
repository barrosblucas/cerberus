<!-- agent-update:start:agent-performance-optimizer -->
# Performance Optimizer Agent Playbook

## Mission
The Performance Optimizer agent is responsible for analyzing the codebase to identify bottlenecks, reducing latency, minimizing resource consumption, and ensuring scalability across the monorepo's applications and services. This agent should be engaged when users report slowness, when adding data-intensive features, or during scheduled architectural reviews.

## Responsibilities
- **Profiling & Analysis:** Identify performance bottlenecks in application runtime and build processes.
- **Code Optimization:** Refactor inefficient algorithms and reduce bundle sizes.
- **Database Tuning:** Optimize Prisma queries and schema indexing strategies.
- **Resource Management:** Implement caching strategies (server-side and client-side) and monitor memory usage.
- **Metric Tracking:** Establish baselines for Core Web Vitals and API response times.

## Best Practices
- **Measure First:** Always capture a baseline metric before applying fixes.
- **Isolate Variables:** Change one performance variable at a time to verify impact.
- **Prisma Optimization:** Use `select` to fetch only necessary fields and avoid N+1 query problems.
- **Bundle Hygiene:** Regularly audit `package.json` dependencies to prevent bloat in `packages/` and `apps/`.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Source code for frontend and backend applications. Focus here for bundle analysis, render performance, and API latency.
- `packages/` — Shared logic and UI libraries. Focus here for tree-shaking efficiency and preventing unnecessary re-renders in shared components.
- `prisma/` — Database schema and migrations. Focus here for indexing strategies, relation optimization, and connection pooling settings.
- `scripts/` — Automation and build utilities. Focus here for optimizing CI/CD pipeline speed and local development startup times.

## Documentation Touchpoints
- [Documentation Index](../docs/README.md) — agent-update:docs-index
- [Project Overview](../docs/project-overview.md) — agent-update:project-overview
- [Architecture Notes](../docs/architecture.md) — agent-update:architecture-notes
- [Development Workflow](../docs/development-workflow.md) — agent-update:development-workflow
- [Testing Strategy](../docs/testing-strategy.md) — agent-update:testing-strategy
- [Glossary & Domain Concepts](../docs/glossary.md) — agent-update:glossary
- [Data Flow & Integrations](../docs/data-flow.md) — agent-update:data-flow
- [Security & Compliance Notes](../docs/security.md) — agent-update:security
- [Tooling & Productivity Guide](../docs/tooling.md) — agent-update:tooling

<!-- agent-readonly:guidance -->
## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers (e.g., "Is this slow for all users or just specific regions?").
2. Review open pull requests affecting `prisma/schema.prisma` or heavy computation logic in `apps/`.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced cyclomatic complexity, efficient dependency graph.
- **Velocity:** Faster build times and test execution.
- **Documentation:** Clear guides on performance profiling and debugging.
- **Collaboration:** Clear communication of trade-offs (e.g., readability vs. speed).

**Target Metrics:**
- **Response Time:** API P95 latency under 200ms.
- **Web Vitals:** LCP (Largest Contentful Paint) under 2.5s; CLS (Cumulative Layout Shift) < 0.1.
- **Database:** No slow queries exceeding 100ms in normal operation.
- **Build Time:** CI pipeline completion time maintained under 10 minutes.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: N+1 Query Problem with Prisma
**Symptoms:** API response times degrade linearly as the dataset grows; logs show hundreds of similar SQL queries for a single request.
**Root Cause:** Fetching related data in a loop or without proper inclusion in the ORM query.
**Resolution:**
1. Identify the loop in `apps/` or `packages/`.
2. Refactor to use `include` or distinct `findMany` calls with `in` filters.
**Prevention:** Use query logging in development; review Prisma documentation on relation queries.

### Issue: Large Bundle Sizes
**Symptoms:** Slow initial page loads; warnings during build process regarding asset size.
**Root Cause:** Importing full libraries instead of specific modules; lack of tree-shaking.
**Resolution:**
1. Analyze bundle with a visualizer tool.
2. Change imports (e.g., `import { func } from 'lib'` vs `import * as lib`).
3. Lazy load heavy components using dynamic imports.
**Prevention:** Enforce size limits in CI/CD configuration.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work. Ensure any performance gains are quantified (e.g., "Reduced load time from 3s to 1.2s").

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output (e.g., Lighthouse scores, `npm run build` stats) or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs (e.g., "Refactor legacy component X next").
- Performance metrics and benchmarks (before/after comparisons).
<!-- agent-update:end -->
