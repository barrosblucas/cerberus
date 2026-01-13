```markdown
---
title: Agent Handbook
description: Index of available AI agent playbooks and usage guidelines for the repository.
ai_update_goal: Maintain an up-to-date index of agent capabilities and repository context.
---

# Agent Handbook

This directory contains ready-to-customize playbooks for AI agents collaborating on the repository.

<!-- agent-update:start:repository-context -->
## Repository Context
This repository is organized as a Monorepo with the following structure:
- **apps/**: Contains the primary application entry points (Frontend/Backend).
- **packages/**: Shared internal libraries, UI components, and utilities.
- **prisma/**: Database schemas and migration history (ORM).
- **scripts/**: Build, deployment, and utility scripts.
<!-- agent-update:end -->

## Available Agents
<!-- agent-update:start:agent-list -->
- [Code Reviewer](./code-reviewer.md) — Review code changes for quality, style, and best practices.
- [Bug Fixer](./bug-fixer.md) — Analyze bug reports and error messages.
- [Feature Developer](./feature-developer.md) — Implement new features according to specifications.
- [Refactoring Specialist](./refactoring-specialist.md) — Identify code smells and improvement opportunities.
- [Test Writer](./test-writer.md) — Write comprehensive unit and integration tests.
- [Documentation Writer](./documentation-writer.md) — Create clear, comprehensive documentation.
- [Performance Optimizer](./performance-optimizer.md) — Identify performance bottlenecks.
- [Security Auditor](./security-auditor.md) — Identify security vulnerabilities.
- [Backend Specialist](./backend-specialist.md) — Design and implement server-side architecture.
- [Frontend Specialist](./frontend-specialist.md) — Design and implement user interfaces.
- [Architect Specialist](./architect-specialist.md) — Design overall system architecture and patterns.
- [Devops Specialist](./devops-specialist.md) — Design and maintain CI/CD pipelines.
- [Database Specialist](./database-specialist.md) — Design and optimize database schemas (specifically Prisma).
- [Mobile Specialist](./mobile-specialist.md) — Develop native and cross-platform mobile applications.
<!-- agent-update:end -->

## How To Use These Playbooks
1. **Pick the agent** that matches your task.
2. **Enrich the template** with project-specific context (e.g., specific paths in `apps/` or `packages/`).
3. **Share the final prompt** with your AI assistant.
4. **Capture learnings** in the relevant documentation file so future runs improve.

## Related Resources
- [Documentation Index](../docs/README.md)
- [Contributor Guidelines](../../CONTRIBUTING.md)
```
