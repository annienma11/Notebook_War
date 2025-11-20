# Supabase Development Rules for Blue vs Red: Notebook War 3D

## 1. Supabase Project‑Wide Principles  
1. **Plan Before Coding**  
   - Map out your data models, entities, relationships, and sensitive fields (e.g. user profile, inventory, progress) before writing code.  
   - Think in terms of multitenancy (if needed) and how data should be isolated.  
2. **Least Privilege Principle**  
   - Grant minimal permissions/roles for each part of the system. Don’t give broad access where it isn’t needed.  
   - Never expose the Supabase `service_role` key in client‑side builds. It must remain only in trusted server-side or Edge Function environments.  
3. **Database as Source of Truth**  
   - Enforce data integrity with database-level constraints: NOT NULL, UNIQUE, foreign keys. Don’t rely purely on application logic.  
   - Use defaults, checks, and Postgres constraints to guarantee data validity.  
4. **Environment Parity**  
   - Mirror production settings, RLS policies, extensions, and migrations in local and staging environments. Avoid large discrepancies between environments.  
   - Test locally with representative data so you can catch issues early.  
5. **Version Control & Migrations**  
   - Use a schema migration tool (Supabase CLI or a third‑party migration framework) and store all migrations in version control. :contentReference[oaicite:0]{index=0}  
   - Automate your migration and Edge Function deployment via CI/CD; don’t rely on manual dashboard changes for production. :contentReference[oaicite:1]{index=1}  
6. **Monitoring & Audit**  
   - Enable Postgres logs, slow-query tracking, and metrics for latency.  
   - Audit sensitive operations and schema changes (who changed what, when).  
7. **Shared Responsibility Model**  
   - You are responsible for your data and access control. Supabase gives you access, but you must enforce proper security and use. :contentReference[oaicite:2]{index=2}  

---

## 2. Authentication & Key Management  
1. **Use Supabase Auth**  
   - Leverage Supabase Auth (email + magic link or OAuth) for user management.  
2. **Handle Keys Securely**  
   - Do **not** place service_role keys in client code. Store them securely in server-side or Edge Functions. :contentReference[oaicite:3]{index=3}  
3. **Token Strategy**  
   - Use short-lived tokens and refresh tokens when applicable. Revoke tokens that are unused.  
4. **Role & Claims**  
   - Use JWT custom claims or role claims (`tenant_id`, `role`) to distinguish user scopes and permissions; don’t rely on client logic for security.  
   - Validate claims on the server and in your Edge Functions to enforce data isolation.

---

## 3. Row‑Level Security (RLS) — Mandatory for Production  
1. **Enable RLS**  
   - Turn on Row-Level Security (`ALTER TABLE … ENABLE ROW LEVEL SECURITY;`) for any table with user data.  
2. **Explicit Policies**  
   - Define explicit RLS policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Avoid default-deny gaps.  
3. **Use Auth Context**  
   - Write policies that reference `auth.uid()` for user-based access. Use `auth.jwt()` claims (like `tenant_id`) in policies for multi-tenant logic.  
4. **Policy Efficiency**  
   - Keep policy expressions performant. Index frequently-used policy columns (e.g., `user_id`, `tenant_id`).  
5. **Test Thoroughly**  
   - Simulate multiple user roles and sessions to verify policies work as expected, including edge cases with the service_role key.

---

## 4. Multi‑Tenancy & Authorization (if Applicable)  
1. **Isolate Data**  
   - Use a `tenant_id` or `organization_id` in your tables. Enforce it with RLS so each user only sees their tenant’s data.  
2. **Secure Inserts**  
   - Don’t trust clients to set `tenant_id` on inserts. Use `WITH CHECK` in your RLS policy to validate that the newly inserted row’s tenant matches the JWT claim.  
3. **Helper Functions**  
   - For complex authorization logic, use `SECURITY DEFINER` helper functions in SQL to encapsulate checks. Limit execution rights and expose only safe APIs.

---

## 5. Schema Design & Constraints  
1. **Use Appropriate Types**  
   - Use `UUID` for IDs, `timestamp with time zone` for date/time.  
2. **Normalized Schema**  
   - Normalize your data where possible. Denormalize only when performance requires it — document those decisions.  
3. **Database Constraints**  
   - Enforce `NOT NULL`, `UNIQUE`, `CHECK` constraints at the DB level.  
4. **Defaults & Triggers**  
   - Use meaningful default values. Use triggers sparingly (and only when justified).

---

## 6. Indexing & Performance  
1. **Index Critical Fields**  
   - Add indexes on columns used in `WHERE`, `JOIN`, and RLS policies (`user_id`, `tenant_id`). :contentReference[oaicite:4]{index=4}  
2. **Use Partial Indexes**  
   - Use partial indexes for common queries (e.g., only active users) to optimize storage and performance.  
3. **Query Monitoring**  
   - Run `EXPLAIN ANALYZE` on heavy queries to understand and optimize them.  
4. **Optimize Policies**  
   - Keep RLS and policy SQL simple; avoid overly complex subqueries or functions in `USING`.

---

## 7. Migrations & Schema Management  
1. **Migrations in Version Control**  
   - Store all SQL migrations in Git. Use Supabase’s migration tooling or a compatible tool. :contentReference[oaicite:5]{index=5}  
2. **CI/CD for Migrations**  
   - Apply migrations automatically via CI/CD to staging first, then after validation, promote to production. :contentReference[oaicite:6]{index=6}  
3. **Non-Destructive Migrations**  
   - Whenever possible: create new columns → backfill → switch reads/writes → drop old columns later. This avoids breaking live services.  
4. **Testing Migrations**  
   - Test migrations in a staging database that mirrors production in size and policy setup. :contentReference[oaicite:7]{index=7}  

---

## 8. Secrets & Environment Management  
1. **Environment Variables**  
   - Use environment variables for all sensitive keys and configuration (CLI, Edge Functions, production credentials). :contentReference[oaicite:8]{index=8}  
2. **Rotate Secrets Regularly**  
   - Periodically rotate keys such as service_role, JWT secrets, and API credentials.  
3. **Edge Function Security**  
   - Use Supabase Edge Functions for operations that require privileged access (service_role, third-party secrets).  
   - Validate and sanitize all input before performing database operations.

---

## 9. Edge Functions & Business Logic  
1. **Use Edge Functions for Sensitive Tasks**  
   - Any operation requiring service_role or elevated privileges should happen in Edge Functions.  
2. **Modular & Secure**  
   - Break logic into small, testable functions. Use shared utility modules for common code.  
3. **Input Validation**  
   - Validate user input rigorously in Edge Functions. Use safe SQL parameterization.  
4. **Background Work**  
   - Offload long-running or non-blocking tasks with `EdgeRuntime.waitUntil` where appropriate.  

---

## 10. Realtime / Notifications  
1. **Secure Channels**  
   - Use private realtime topics and enforce access via RLS or JWT claims.  
2. **Granular Topics**  
   - Scope realtime broadcasts to entity-level (e.g., `game_room:123`) rather than broad global topics.  
3. **Subscribe Logic**  
   - Clients should subscribe/unsubscribe intelligently; avoid memory leaks or ghost subscriptions.

---

## 11. Storage & File Handling  
1. **Secure Buckets**  
   - Use Supabase Storage buckets with RLS-like policies on stored objects.  
2. **User Prefixes**  
   - Organize files by `user_id` or `tenant_id` prefix to enforce folder-level security.  
3. **Signed URLs**  
   - Use time-limited signed URLs for uploads/downloads to limit access.

---

## 12. Backups & Disaster Recovery  
1. **Regular Backups**  
   - Perform periodic exports or snapshots of the database.  
2. **Test Restores**  
   - Regularly test your restore procedures on a staging environment to validate backup integrity.  
3. **Schema Versioning**  
   - Keep a history of the schema (SQL or migration files) under version control.

---

## 13. Logging, Auditing & Observability  
1. **Enable Logging**  
   - Turn on Postgres logging for slow queries, errors, and policy violations.  
2. **Audit Tables / Triggers**  
   - Optionally use triggers or audit tables to record who changed what and when.  
3. **Alerting**  
   - Set up alerts for high error rates, long-running queries, or unusual access patterns.

---

## 14. Testing & QA for Supabase  
1. **RLS Testing**  
   - Use testing tools that support RLS (e.g., `supabase-test`) to verify policies under different JWT contexts. :contentReference[oaicite:9]{index=9}  
2. **Integration Tests**  
   - Run integration tests against a staging DB that reflects production RLS and schema.  
3. **Edge Function Tests**  
   - Write unit or integration tests for Edge Functions to validate business logic, input handling, and permissions.

---

## 15. Cost & Resource Management  
1. **Monitor Usage**  
   - Track Supabase usage costs (DB size, read/write volume, storage).  
2. **Index Wisely**  
   - Each index adds storage/write cost — only index columns that are used often.  
3. **Partitioning**  
   - For very large tables, consider table partitioning (by time or tenant) if needed for performance.

---

## 16. Common Pitfalls & Mitigations  
1. **Leaked Service Role Key**  
   - Always store service_role key on the server. Rotate and audit usage.  
2. **Misconfigured RLS**  
   - Test with different roles and contexts. Use helper functions if logic is complex.  
3. **Unversioned Schema Changes**  
   - Never rely solely on the dashboard — use migrations and CI/CD.  
4. **Lack of Backups**  
   - Without backups, schema or data corruption is irreversible. Implement regular backup and restore tests.  

---

## 17. Pre‑Launch Checklist  
- ✅ RLS enabled and policies verified  
- ✅ Secrets stored safely (no service_role in client)  
- ✅ Migrations fully version-controlled and tested via CI/CD  
- ✅ Monitoring, logging, and alerting setup  
- ✅ Backup and restore process validated  
- ✅ Integration tests for Edge Functions  
- ✅ Realtime channels secured  

