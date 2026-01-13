---
ai_update_goal: Document the system's data pipelines, integration points, and internal component communication.
required_inputs: Repository structure, Prisma schema, external API usage.
success_criteria: Clear Mermaid diagram of high-level flow, definition of internal package dependencies, and explicit external integration details.
---

<!-- agent-update:start:data-flow -->
# Data Flow & Integrations

This document outlines how data enters, moves through, and exits the system, including interactions with external services and the role of specific repository components.

## High-level Flow

The primary data pipeline follows a standard interaction model between the frontend applications, the API layer, and the database, with asynchronous offloading to AI agents.

```mermaid
graph TD
    User[User Interaction] -->|HTTP/REST| App[Apps (Next.js/Node)]
    App -->|Reads/Writes| DB[(Prisma / Database)]
    App -->|Triggers| Agent[AI Agents]
    Agent -->|Retrieves Context| DB
    Agent -->|API Call| LLM[External LLM Provider]
    LLM -->|Response| Agent
    Agent -->|Persists Result| DB
    DB -->|Updates| App
```

## Internal Movement

The repository relies on a monorepo structure managed by `pnpm` and `turbo`. Data movement is governed by strict boundaries between workspace packages.

### Component Interaction
*   **Apps (`apps/`)**: These are the entry points for data. They handle user input, validation, and API routing. They consume logic and types from `packages/`.
*   **Shared Packages (`packages/`)**:
    *   Contain shared TypeScript interfaces to ensure payload shapes match between the Frontend and Backend.
    *   Host utility functions for data transformation before it reaches the database.
*   **Data Layer (`prisma/`)**:
    *   Acts as the single source of truth for the data schema.
    *   All database access flows through the generated Prisma Client, ensuring type safety across the monorepo.
*   **Agent Configuration (`AGENTS.md`, `AI-GOVERNANCE.md`)**:
    *   These files serve as "Soft Configuration." While not executable code, they define the *prompts*, *rules*, and *constraints* that the AI Agents (running within `apps` or scripts) must adhere to when processing data.

### Build & Config Flow
*   Configuration files (`biome.json`, `tsconfig.base.json`, `turbo.json`) ensure that data strictness (linting, type-checking) is enforced at build time, preventing malformed data handling logic from reaching production.

## External Integrations

The system relies on external providers for core AI functionality and infrastructure.

<!-- agent-fill:integration -->
### LLM Provider (OpenAI / Anthropic)
*   **Purpose**: Generates text, code, or data analysis based on user prompts forwarded by the system.
*   **Authentication**: API Key via Environment Variables (`OPENAI_API_KEY`, etc.).
*   **Payload Shapes**: JSON-based chat completion objects (Messages array, Temperature, Model ID).
*   **Retry Strategy**: Exponential backoff (up to 3 retries) on 5xx errors or Rate Limit (429) responses.
<!-- /agent-fill -->

### Database Provider (Postgres)
*   **Purpose**: Persistent storage for application state and agent memory.
*   **Connection**: Connection string via `DATABASE_URL`.
*   **Management**: Schema changes managed via `prisma migrate`.

## Observability & Failure Modes

### Monitoring
*   **Logs**: Structured JSON logs are emitted for every API request and Agent execution cycle.
*   **Tracing**: Key transactions (especially those involving external LLM calls) should include a correlation ID to trace the flow from User Input -> App -> Agent -> LLM.

### Failure Handling
*   **Database**: If `prisma` cannot connect, the application enters a generic "Maintenance Mode" or returns 503 Service Unavailable.
*   **LLM Outages**: If the AI provider is unreachable, agents queue tasks for later execution or degrade to a read-only mode where historical data is served without new generation.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Validate flows against the latest integration contracts or diagrams.
2. Update authentication, scopes, or rate limits when they change.
3. Capture recent incidents or lessons learned that influenced reliability.
4. Link to runbooks or dashboards used during triage.

<!-- agent-readonly:sources -->
## Acceptable Sources
- Architecture diagrams, ADRs, integration playbooks.
- API specs, queue/topic definitions, infrastructure code.
- Postmortems or incident reviews impacting data movement.

<!-- agent-update:end -->
