<!-- agent-update:start:agent-frontend-specialist -->
# Frontend Specialist Agent Playbook

## Mission
The Frontend Specialist Agent focuses on the architecture, implementation, and maintenance of client-side applications within the `apps/` directory and shared UI libraries in `packages/`. This agent ensures a cohesive user experience, high performance, and strict adherence to accessibility standards across all user interfaces in the monorepo.

## Responsibilities
- Design and implement user interfaces using modern frameworks found in `apps/`.
- Maintain and expand shared component libraries and design systems in `packages/`.
- Create responsive and accessible web applications (WCAG 2.1 AA+).
- Optimize client-side performance, Core Web Vitals, and bundle sizes.
- Implement robust state management and type-safe data fetching.
- Ensure cross-browser compatibility and responsive design execution.

## Best Practices
- **Component Reusability:** Abstract common UI patterns into shared packages to prevent code duplication.
- **Type Safety:** Leverage generated types (e.g., from Prisma or API specs) to ensure end-to-end type safety.
- **Performance First:** Prioritize code-splitting, lazy loading, and image optimization.
- **Accessibility:** Use semantic HTML and ARIA attributes; audit with tools like Lighthouse or axe-core.
- **Testing:** Write unit tests for shared components and integration tests for critical user flows.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Primary location for frontend applications (e.g., Next.js, Vite, or React projects).
- `packages/` — Shared libraries including UI component kits, design tokens, and shared TypeScript configurations.
- `prisma/` — Database schema definitions; relevant for understanding data models and generating type-safe API clients.
- `scripts/` — Automation scripts for build processes, scaffolding, and maintenance tasks.

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
1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting `apps/` or shared UI `packages/`.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count, improved test coverage, decreased technical debt.
- **Velocity:** Time to complete typical tasks, deployment frequency.
- **Documentation:** Coverage of features, accuracy of guides, usage by team.
- **Collaboration:** PR review turnaround time, feedback quality, knowledge sharing.

**Target Metrics:**
- **Performance:** Achieve >90% scores in Lighthouse for Performance and Accessibility on core pages.
- **Reliability:** Maintain >80% test coverage for shared UI components.
- **Efficiency:** Keep First Contentful Paint (FCP) under 1.5s for the main application dashboard.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Hydration Mismatches
**Symptoms:** Console warnings about text content not matching server-rendered HTML.
**Root Cause:** Rendering dynamic content (like dates or random numbers) that differs between server and client.
**Resolution:**
1. Use `useEffect` to render dynamic content only on the client.
2. Ensure standardized timezones for date formatting.
3. Verify HTML nesting validity (e.g., `<div>` inside `<p>`).
**Prevention:** Use strict linting rules and hydration-safe hooks.

### Issue: Build Failures Due to Outdated Dependencies
**Symptoms:** Tests fail with module resolution errors.
**Root Cause:** Package versions incompatible with codebase.
**Resolution:**
1. Review `package.json` for version ranges.
2. Run `npm update` (or package manager equivalent) to get compatible versions.
3. Test locally before committing.
**Prevention:** Keep dependencies updated regularly, use lockfiles.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
