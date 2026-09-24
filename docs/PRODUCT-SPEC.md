# Product Specification

## Users

Individuals can request inspections and receive reports. Organisations manage assets, teams, engagements and integrations. Inspectors execute field work. Auditors review criteria and evidence. Platform administrators govern the service. Developers consume APIs and webhooks.

## Engagement modes

Inspection, Audit and Hybrid.

## Taxonomy

The product supports the locked 20-category taxonomy plus Custom. Categories are configurable without changing workflow authority.

## Asset registry

Assets have identity, type, reference, address, status, notes and chronological history. Inspections can attach to assets.

## Evidence

Photo, video and note evidence with capture time and optional location/checksum/storage reference.

## Reports

Reports are versioned, attributable to an engagement, issuable and supersedable. Reports reference findings and evidence provenance.

## Communications

WhatsApp Business, email and SMS are connector-backed channels. Delivery state is persisted and auditable.

## Developer platform

REST API, API keys, webhooks, webhook delivery history and developer administration are first-class capabilities.

## Billing

Service pricing and platform subscription pricing are separate concerns. Payment records are immutable financial evidence; subscription state controls platform entitlements.

## Non-functional requirements

Tenant isolation, least privilege, auditable state transitions, portable domain boundaries, deterministic execution, secure secret handling and evidence integrity.
