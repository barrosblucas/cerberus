```markdown
---
ai_update_goal: "Standardize development workflow documentation for a monorepo with Prisma."
required_inputs: ["package.json", "prisma/schema.prisma", "CI configs"]
success_criteria: "Clear steps for setup, database management, and contribution flow."
---
<!-- agent-update:start:development-workflow -->
# Development Workflow

This document outlines the engineering standards and day-to-day processes for contributing to this repository.

## Branching & Releases

We follow a **Trunk-Based Development** workflow.

- **Main Branch:** `main` is the source of truth. It should always be deployable.
- **Feature Branches:** Create short-lived branches for all changes.
  - Format: `feat/description`, `fix/issue-description`, `chore/maintenance`.
- **Commit Messages:** We follow [Conventional Commits](https://www.conventionalcommits.org/) to automate versioning and changelogs.
  - Example: `feat(ui): add new login modal`
  - Example: `fix(api): resolve prisma connection timeout`

## Local Development

This repository is structured as a monorepo containing `apps`, `packages`, and `prisma` configurations.

### Prerequisites
- Node.js (LTS version recommended)
- npm (or compatible package manager)
- Docker (optional, for local database instances)

### Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Configuration:**
    Copy the example environment file and update secrets as needed.
    ```bash
    cp .env.example .env
    ```

3.  **Database Setup (Prisma):**
    Ensure your database is running, then apply migrations.
    ```bash
    # Run migrations
    npx prisma migrate dev

    # Generate Prisma Client
    npx prisma generate
    ```

4.  **Start Development Server:**
    Run the applications and packages in watch mode.
    ```bash
    npm run dev
    ```

5.  **Build for Production:**
    To verify the build pipeline locally:
    ```bash
    npm run build
    ```

## Code Review Expectations

All Pull Requests (PRs) must meet the following criteria before merging:

1.  **CI Checks:** All automated tests, linting, and build steps must pass.
2.  **Self-Review:** Authors should annotate complex logic in the PR diff.
3.  **Agent Collaboration:** If AI agents assisted in the code generation, please reference the specific agent used. See [AGENTS.md](../../AGENTS.md) for collaboration tips.
4.  **Approvals:** At least one peer review approval is required.

## Onboarding Tasks for New Engineers

1.  **Repository Access:** Ensure you have access to the GitHub repo and any associated package registries.
2.  **First Issue:** Look for issues labeled `good first issue` or `help wanted` on the project board.
3.  **Read the Docs:** Familiarize yourself with the architecture in `docs/README.md`.
4.  **Verify Setup:** Successfully run `npm run test` to confirm your local environment is correct.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Confirm branching/release steps with CI configuration and recent tags.
2. Verify local commands against `package.json`; ensure flags and scripts still exist.
3. Capture review requirements (approvers, checks) from contributing docs or repository settings.
4. Refresh onboarding links (boards, dashboards) to their latest URLs.
5. Highlight any manual steps that should become automation follow-ups.

<!-- agent-readonly:sources -->
## Acceptable Sources
- CONTRIBUTING guidelines and `AGENTS.md`.
- Build pipelines, branch protection rules, or release scripts.
- Issue tracker boards used for onboarding or triage.

<!-- agent-update:end -->
```
