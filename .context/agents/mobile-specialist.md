<!-- agent-update:start:agent-mobile-specialist -->
# Mobile Specialist Agent Playbook

## Mission
The Mobile Specialist Agent is responsible for the architecture, development, and optimization of mobile applications within the repository. Engage this agent for tasks related to React Native or native platform code (iOS/Android), mobile build pipelines, app store compliance, offline-first data synchronization, and mobile-specific UX implementation.

## Responsibilities
- Develop native and cross-platform mobile applications
- Optimize mobile app performance, frame rates, and battery usage
- Implement mobile-specific UI/UX patterns and gestures
- Handle app store deployment, signing, and updates
- Integrate native modules, push notifications, and offline capabilities

## Best Practices
- Test on real devices for accurate performance and touch handling metrics
- Optimize for battery life and restricted network conditions (offline-first)
- Follow platform-specific Human Interface Guidelines (iOS) and Material Design (Android)
- Implement robust error handling for native module bridges
- Plan for app store review guidelines and permission requirements early

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `apps/` — Source code for client applications, including mobile entry points and platform configurations.
- `packages/` — Shared libraries, UI components, and logic utilized across mobile and web platforms.
- `prisma/` — Database schema definitions and ORM configuration, relevant for data synchronization logic.
- `scripts/` — Automation tools for build pipelines, environment setup, and deployment tasks.

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
1. Confirm assumptions with issue reporters or maintainers (especially regarding platform versions).
2. Review open pull requests affecting `apps/` or shared `packages/`.
3. Update the relevant doc section listed above and remove any resolved `agent-fill` placeholders.
4. Capture learnings back in [docs/README.md](../docs/README.md) or the appropriate task marker.

## Success Metrics
Track effectiveness of this agent's contributions:
- **Code Quality:** Reduced crash rates, strict typing adherence, improved test coverage
- **Velocity:** Time to resolve platform-specific bugs, deployment frequency to TestFlight/Play Console
- **Documentation:** Accuracy of setup guides for simulators/emulators
- **Collaboration:** Clarity of communication regarding native dependencies

**Target Metrics:**
- Maintain crash-free sessions > 99.5%
- Ensure UI renders at 60fps for standard interactions
- Keep app bundle size optimized (monitor impact of new dependencies)
- Achieve > 80% code coverage on shared logic used by mobile apps

## Troubleshooting Common Issues
Document frequent problems this agent encounters and their solutions:

### Issue: CocoaPods/Gradle Sync Failures
**Symptoms:** Build fails immediately with dependency resolution errors.
**Root Cause:** Native dependencies out of sync with JavaScript packages or invalid cache.
**Resolution:**
1. Clean build folders (`rm -rf ios/Pods`, `./gradlew clean`).
2. Re-install dependencies (`pod install`, `npm install`).
3. Verify JDK and Ruby versions match environment requirements.
**Prevention:** Use standardized scripts in `scripts/` for environment setup; commit lockfiles.

### Issue: Metro Bundler Connection Errors
**Symptoms:** App launches but cannot load the JS bundle.
**Root Cause:** Port conflicts or device not on the same network as the host.
**Resolution:**
1. Check if port 8081 is in use.
2. Ensure device and host are on the same Wi-Fi.
3. Run `adb reverse tcp:8081 tcp:8081` (Android).
**Prevention:** Use wired connections for debugging where possible.

## Hand-off Notes
Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work. Ensure any changes to native permission strings (Info.plist/AndroidManifest.xml) are highlighted for review.

## Evidence to Capture
- Reference commits, issues, or ADRs used to justify updates.
- Screenshots or video recordings of UI changes on simulators/devices.
- Command output or logs that informed recommendations (e.g., build logs).
- Performance metrics (startup time, memory usage) where applicable.
<!-- agent-update:end -->
