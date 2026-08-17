# Ecommerce Implementation Guide
## Purpose
Build trustworthy catalog-to-fulfillment commerce workflows.
## Philosophy
Price, inventory, payment, and order transitions are server-authoritative and auditable.
## Architecture
Separate catalog, cart, pricing, checkout, payment, order, inventory, and fulfillment modules; coordinate via idempotent commands/events.
## Required Components
Catalog/product, cart, checkout, address/shipping, payment, confirmation, order history/detail, cancellation/refund, inventory/unavailable states.
## Folder Structure
```text
features/commerce/{catalog,cart,checkout,payments,orders,fulfillment,tests}
```
## UX Expectations
Show total breakdown, currency, availability, delivery expectation, return terms, and progress; never lose cart/input on recoverable failure.
## Security Considerations
Use hosted/tokenized payment fields, verify signed webhooks, prevent price tampering, rate-limit promotions, minimize PCI scope.
## Testing Expectations
Test money rounding, tax/discount order, inventory races, duplicate payment/webhook, failed/abandoned checkout, refunds, and authorization.
## Best Practices
Snapshot purchase facts on orders and reconcile provider events.
## Rules
Never trust client totals, use floats for money, or fulfill from redirect alone.
## Examples
```text
reserve → price server-side → create idempotent payment → verified webhook → transition order → fulfill.
```
## Anti-patterns
Mutable historical prices, overselling without policy, ambiguous payment state.
## Checklist
- [ ] Money, inventory, payment, order states, recovery, security, and tests are complete.

Related: `../database.md`, `../api.md`, `../notifications.md`.
