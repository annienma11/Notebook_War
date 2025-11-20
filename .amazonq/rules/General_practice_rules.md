Here are some **development‑rules** in a `.md` style that you can give to your coding agent (AI or human) to follow. These are structured as **general rules**, then specific rules for **Unity**, then for **Supabase**. I've researched best practices online to make these solid and production-ready.

```markdown
# Development Rules for Blue vs Red: Notebook War 3D

## 1. General Best Practices  
1. **Code Quality & Maintainability**  
   - Use version control (e.g. Git) rigorously. All changes must be tracked, code reviews applied, and branches used for features/bug fixes. :contentReference[oaicite:0]{index=0}  
   - Follow clean coding standards: consistent naming, single-responsibility classes/modules, and low coupling.  
   - Write modular, reusable, and testable code. Include unit tests, integration tests, and continuous testing in the development pipeline. :contentReference[oaicite:1]{index=1}  
2. **Continuous Integration & Deployment (CI/CD)**  
   - Automate build and test processes with CI tools to ensure every commit can be built and tested.  
   - Use a continuous delivery or deployment workflow so features can be released safely and reliably. :contentReference[oaicite:2]{index=2}  
   - Ensure your deployment pipeline includes automated testing, static code analysis, and build validation to reduce risk and improve quality.  
3. **Performance & Optimization**  
   - Profile the game early and often. Use performance tools (Unity Profiler, etc.) to catch bottlenecks.  
   - Use object pooling, avoid excessive allocations in update loops, and favor efficient data structures.  
   - Optimize assets (models, textures, audio) for size and runtime performance.  
4. **Documentation & Collaboration**  
   - Maintain a README, architecture docs, and code comments. Every major system should have a design document.  
   - Use issue tracking and project boards to manage tasks, bugs, and feature requests.  
   - Enforce code reviews and pair programming where possible to share knowledge and maintain quality.  
5. **Security & Data Integrity**  
   - Never store sensitive data (API keys, secrets) in the client. Use secure server-side systems or environment variables.  
   - Validate all user inputs, both on client and server, to prevent injection attacks and misuse.  
   - Monitor logs, set up error tracking, and have rollback/recovery strategies.

---

## 2. Unity‑Specific Rules  
1. **Architecture & Project Organization**  
   - Structure the project clearly: separate folders for Scripts, Scenes, Prefabs, Materials, Textures, Audio, VFX, etc.  
   - Use ScriptableObjects or similar data-driven design for configurations (weapons, AI parameters, game settings).  
   - Use Unity’s Input System (or a well-abstracted input layer) so controls are decoupled from gameplay logic and can support both PC and mobile.  
2. **Performance in Unity**  
   - Use Unity’s built-in profiler to identify expensive operations (e.g., physics, rendering) and optimize them.  
   - Implement object pooling for bullets, UI, and any frequently instantiated game objects.  
   - Use level / scene streaming (or additive scenes) to keep memory usage in check.  
   - Use efficient shaders (e.g., URP) and mobile‑friendly effects.  
3. **Testing & Quality Assurance**  
   - Write automated tests for game logic, if possible (e.g., using Unity Test Framework).  
   - Perform regular playtesting to validate mechanics, input responsiveness, and game balance.  
   - Use staging builds before production builds — test on target devices (mobile, PC) under real-world conditions.  
4. **Versioning & Release Management**  
   - Keep project versions in sync with Git (or your VCS). Tag stable releases.  
   - Maintain separate branches/environments for development, testing, and production builds.  
   - Use continuous deployment (CD) for builds if possible, automating the build pipeline for different platforms.

---

## 3. Supabase & Postgres Rules  
1. **Security & Access Control**  
   - **Enable Row‑Level Security (RLS)** on all tables that store user-specific or sensitive data. :contentReference[oaicite:3]{index=3}  
   - Define clear RLS policies using `auth.uid()` (or other claims) to restrict read/write access. :contentReference[oaicite:4]{index=4}  
   - Avoid overly complex business logic in RLS policies — keep RLS for authorization, but enforce business logic in Edge Functions or backend code. :contentReference[oaicite:5]{index=5}  
   - Never expose the Supabase **service_role key** in client-side code. Use it only in trusted server-side environments. :contentReference[oaicite:6]{index=6}  
2. **Edge Functions & Business Logic**  
   - Use Supabase Edge Functions (Deno / TypeScript) to run sensitive or privileged operations (e.g., saving progress, validating inventory changes). :contentReference[oaicite:7]{index=7}  
   - In Edge Functions, authenticate users (via JWT) before performing operations, to maintain RLS context. :contentReference[oaicite:8]{index=8}  
   - Use environment variables or secrets storage for keys and credentials in Edge Functions.  
3. **Schema Design & Data Modeling**  
   - Design normalized schemas to avoid redundancy; denormalize only when necessary for performance. :contentReference[oaicite:9]{index=9}  
   - Use indexes on frequently queried fields to improve query performance. :contentReference[oaicite:10]{index=10}  
   - Write migration scripts for schema changes and store them under version control.  
4. **Data Policy & Backups**  
   - Regularly back up your database. Supabase provides backup strategies; use them. :contentReference[oaicite:11]{index=11}  
   - Monitor query performance, RLS policy execution time, and slow queries. Use Postgres tools and Supabase logs. :contentReference[oaicite:12]{index=12}  
   - Document your RLS policies and database schema so other developers understand access rules.  
5. **Shared Responsibility & Config**  
   - Recognize the **shared responsibility model**: while Supabase manages infrastructure, you’re responsible for data security, RLS, access, and backups. :contentReference[oaicite:13]{index=13}  
   - Use Supabase CLI or dashboard to manage production vs. staging environments.  
   - Implement rate limiting, input validation, and secure API usage to avoid exposing sensitive operations via Edge Functions or public APIs. :contentReference[oaicite:14]{index=14}  

```

If you like, I can convert these into **linting rules or automated checks** for your code‑generation agent (or devs), so every PR is validated against these standards. Do you want me to do that?
