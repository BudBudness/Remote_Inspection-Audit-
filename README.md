# Remote Inspection & Audit

Remote Inspection & Audit is a multi-tenant inspection, audit and evidence platform for customers, organisations, inspectors and auditors.

## Architecture

GitHub is the canonical source/version-control system. Macaly is the rapid application construction and preview environment. Cloudflare is the production platform boundary. Cloudflare RealtimeKit is the realtime/live-inspection layer. Deterministic application workflows own business authority. AI may interpret and analyse but never authorise or execute business actions. MCP is optional interoperability only.

## Core flow

Customer/Organisation -> Request -> Assignment -> Inspection/Audit/Hybrid execution -> RealtimeKit session when live -> Evidence -> Findings -> Report -> Communication -> Audit trail.

## Product surfaces

Customer, Organisation, Inspector, Auditor, Platform Admin and Developer.

## Platform capabilities

Multi-organisation tenancy, RBAC, asset registry/history, inspections, audits, hybrid engagements, evidence, findings, reports, payments/billing, notifications, WhatsApp/email/SMS connectors, REST API, webhooks, developer mode, analytics, SEO/public discovery and optional MCP interoperability.

## Commercial baseline

Service tiers: Free / UGX 25,000 / UGX 50,000. Business, Developer and Enterprise platform plans are separate from service pricing.

## Current implementation

The Macaly application contains the deployed working inspection vertical, Convex backend, Cloudflare RealtimeKit integration and participant presets. This repository is the canonical specification and engineering home for the platform.
