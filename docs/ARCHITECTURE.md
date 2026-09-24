# Architecture

## Authority model

1. Deterministic core: state transitions, validation, permissions, tenancy, billing, evidence, findings and reporting.
2. RealtimeKit: live audio/video/screen-share/session infrastructure only.
3. Connectors: external communications and integrations.
4. AI: interpretation, extraction, summarisation and recommendations only.
5. MCP: optional interoperability surface; never required for core execution.

## Runtime

Experience -> Communication -> API/Connectors/MCP -> Deterministic Core -> Assets/Inspections/Audits -> Evidence/Findings -> Reports -> Billing/Analytics/Security/Audit -> Database.

## Platform boundaries

- Macaly: application construction, UI, preview and rapid iteration.
- Cloudflare: DNS, edge, security, APIs, storage/queues/workflows as adopted in production.
- RealtimeKit: realtime inspection sessions.
- Convex: current Macaly application backend and transactional data layer; keep domain boundaries portable.

## Folders over agents

The implementation is organised around explicit domains and workflows. No autonomous agent is the business control plane.
