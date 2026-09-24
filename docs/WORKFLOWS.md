# Deterministic Workflows

## Inspection

requested -> payment_pending -> paid -> assigned -> en_route -> arrived -> live -> completed

Cancellation is explicit and audited.

## Audit

request -> scope -> assignment -> evidence collection -> criteria review -> findings -> report -> issuance.

## Hybrid

Combines inspection execution and audit review while retaining one engagement identity and separate evidence/finding/report provenance.

## Live

Inspection -> authorise realtime session -> create RealtimeKit meeting -> issue role-specific participant token -> live session -> capture evidence/findings -> close session -> report.

## Evidence

Evidence carries capture metadata, timestamp, optional geolocation, checksum and storage reference. Findings reference evidence where applicable.

## Auditability

State transitions, assignment, payment, evidence, findings, report issuance and integration events are recorded as audit events.
