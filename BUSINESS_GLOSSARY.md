# EduGoma Business Glossary

This glossary keeps the project terminology clear and shared across the team.

## Core terms

- Tenant: Technical boundary for multi-tenancy. Each tenant isolates its own users, roles, modules, and data.
- School: The business unit represented by a tenant. In most cases, one tenant = one school.
- User: A person using the platform within a tenant.
- Admin: A user with administrative control over a tenant or platform-level operations.
- Director: School management leader.
- Secretary: School administrative assistant.
- Supervisor: Staff responsible for monitoring or discipline support.
- Teacher: Staff responsible for teaching and assessment.
- Accountant: Staff responsible for finance and payment records.
- Parent: A guardian associated with a student.
- Student: A learner enrolled in the school.
- Role: A reusable permission group assigned to a user.
- Permission: Concrete action allowed or denied in the system.
- Module: A business feature or capability that can be enabled for a tenant.
- Audit Log: Historical record of important actions and events.
- Validation: The approval process for a new school registration.
- Status: Current lifecycle state of a tenant or application record.

## Status values

- Pending: Waiting for approval or verification.
- Active: Approved and usable.
- Rejected: Declined by admin.
- Suspended: Temporarily disabled.

## Naming convention

- Keep the technical model name as `Tenant` in code and database.
- Use `School` in business-facing documentation and product discussions.
- Use `Institution` only when you want a broader wording than `School`.
