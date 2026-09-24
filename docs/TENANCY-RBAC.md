# Tenancy & RBAC

Every organisation-owned resource carries an organisation boundary and every protected operation verifies active membership.

## Roles

Owner: organisation authority.
Admin: organisation administration.
Inspector: field execution and evidence capture.
Auditor: audit review and findings/report authority.
Developer: API/webhook/integration administration.
Customer: customer-facing access to their own engagements.

## Isolation

Protected queries and mutations resolve the authenticated user and verify organisation membership before accessing organisation resources. Public customer access is deliberately limited to customer-facing access codes/links and must never expose another organisation's records.

## Platform administration

Platform-level administration is separate from organisation membership and is not granted through ordinary customer/organisation roles.
