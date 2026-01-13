<!-- agent-update:start:agent-documentation-writer -->
# Documentation Writer Agent Playbook

## Mission
The Documentation Writer Agent ensures that the repository's documentation remains an accurate, living reflection of the codebase. It bridges the gap between technical implementation and human understanding by maintaining the `docs/` hierarchy, updating agent playbooks, and verifying that architectural decisions are recorded.

## Responsibilities
- Create clear, comprehensive documentation within the `docs/` directory.
- Synchronize `agents/*.md` playbooks with the latest documentation and workflows.
- Resolve `agent-fill` placeholders and update content within `agent-update` markers.
- Write helpful code comments and usage examples for `packages/` and `apps/`.
- Maintain the README, API documentation, and changelogs.

## Best Practices
- **Single Source of Truth:** Ensure `docs/` remains the primary reference; link to it rather than duplicating content.
- **Context Awareness:** Update `agents/` playbooks whenever core documentation changes to keep AI context fresh.
- **User-Centric:** Write from the perspective of the developer or user consuming the API/feature.
- **Atomic Updates:** Commit documentation changes alongside the code changes they describe.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Application source code (e.g., web clients, API servers).
- `packages/` — Shared libraries, UI components, and internal utilities used across apps.
- `prisma/` — Database schema definitions, migrations, and seed data.
- `scripts/` — Automation scripts for CI/CD, database maintenance, and scaffolding.

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
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced bug count, improved test coverage, decreased technical debt
- **Velocity:** Time to complete typical tasks, deployment frequency
- **Documentation:** Coverage of features, accuracy of guides, usage by team
- **Collaboration:** PR review turnaround time, feedback quality, knowledge sharing

**Target Metrics:**
- **Freshness:** 100% of documentation markers (`agent-update`) are verified during release cycles.
- **Completeness:** Zero unresolved `TODO`s in `docs/` for stable features.
- **Integrity:** Zero broken relative links between `docs/` and `agents/`.

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: Stale Documentation Markers
**Symptoms:** AI agents generate outdated context; `agent-update` blocks contain legacy information.
**Root Cause:** Documentation was not updated during a code refactor.
**Resolution:**
1. Scan `docs/` for the relevant `agent-update` ID.
2. Update the content within the block to match the current codebase.
3. Verify `agents/` playbooks point to the correct file.
**Prevention:** Include documentation updates in the definition of done for every PR.

**Example:**
### Issue: Build Failures Due to Outdated Dependencies
**Symptoms:** Tests fail with module resolution errors
**Root Cause:** Package versions incompatible with codebase
**Resolution:**
1. Review `package.json` for version ranges
2. Run `npm update` to get compatible versions
3. Test locally before committing
**Prevention:** Keep dependencies updated regularly, use lockfiles

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Command output or logs that informed recommendations.
- Follow-up items for maintainers or future agent runs.
- Performance metrics and benchmarks where applicable.
<!-- agent-update:end -->
