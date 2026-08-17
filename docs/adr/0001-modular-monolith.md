# ADR 0001: Modular monolith with synchronous Gmail delivery

- Status: Accepted
- Date: 2026-08-17

## Context

easymail needs tenant isolation, dashboard authentication, key rotation, SMTP credential protection, and a small public API without operating several deployable services.

## Decision

Use one Next.js application with feature-owned email domain, application, and infrastructure modules. Better Auth owns identity, organizations, and API keys. Email delivery is synchronous for the first release and bounded by SMTP timeouts. Delivery intent and outcome are persisted with an optional workspace-scoped idempotency key.

## Consequences

The first version is simple to deploy and trace. Slow Gmail responses consume a request slot, so a durable queue/outbox should replace synchronous delivery when volume or retry requirements justify it. The public `/api/v1` contract can remain stable through that change.
