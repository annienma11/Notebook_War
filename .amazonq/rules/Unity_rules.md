# Unity Development Rules for Blue vs Red: Notebook War 3D

## 1. Architecture & Code Quality  
1. **Modular Code Design**  
   - Use data-driven design: leverage **ScriptableObjects** for configuration (weapon stats, AI parameters, game settings). :contentReference[oaicite:0]{index=0}  
   - Separate concerns: don’t mix gameplay logic, rendering, physics, and UI in single monolithic scripts.  
   - Use design patterns smartly: consider MVC, singletons, or custom manager systems, but avoid over‑engineering.

2. **Clean Code Practices**  
   - Use descriptive naming for variables, methods, GameObjects, and prefabs. :contentReference[oaicite:1]{index=1}  
   - Cache references (e.g., components like `Rigidbody`, `Transform`) instead of calling `GetComponent<>()` repeatedly. :contentReference[oaicite:2]{index=2}  
   - Reduce work in `Update()` / `FixedUpdate()`: only run per-frame logic when necessary; use event-driven or time-sliced updates. :contentReference[oaicite:3]{index=3}  

## 2. Performance Optimization  
1. **Profiling First**  
   - Use the **Unity Profiler** constantly to identify performance bottlenecks (CPU, GPU, memory, physics). :contentReference[oaicite:4]{index=4}  
   - For mobile targets, set a frame budget; avoid thermal throttling by giving “breathing room” in the frame rate. :contentReference[oaicite:5]{index=5}  

2. **Object Pooling**  
   - Use object pooling for frequently instantiated/destroyed objects (e.g., bullets, particle effects) to reduce garbage collection spikes. :contentReference[oaicite:6]{index=6}  
   - Pre-allocate pools during load time; dynamically expand/shrink pools only when necessary. :contentReference[oaicite:7]{index=7}  

3. **Memory Management**  
   - Minimize per-frame allocations. Use `structs` when possible, avoid frequent `new` in critical loops. :contentReference[oaicite:8]{index=8}  
   - Reduce draw calls using batching (static/dynamic), Level of Detail (LOD), occlusion culling, and texture atlasing. :contentReference[oaicite:9]{index=9}  
   - Optimize shaders: use lightweight, mobile-friendly shaders; avoid very complex fragment logic. :contentReference[oaicite:10]{index=10}  

## 3. Update & Lifecycle Management  
1. **Efficient Update Logic**  
   - Avoid placing everything in `MonoBehaviour.Update`. Instead:  
     - Use a **custom Update Manager** to register only the active objects that need per-frame logic. :contentReference[oaicite:11]{index=11}  
     - Use time-slicing: break heavy work into chunks across frames. :contentReference[oaicite:12]{index=12}  
   
2. **Coroutines & Lazy Loading**  
   - Use coroutines for non-critical tasks to avoid blocking main thread. :contentReference[oaicite:13]{index=13}  
   - Lazily load assets (spawn, texture, model) only when needed to minimize memory footprint and load times.

## 4. Testing & QA  
1. **Automated Testing**  
   - Use Unity Test Framework to write unit tests and integration tests for gameplay systems. :contentReference[oaicite:14]{index=14}  
2. **Crash Reporting & Analytics**  
   - Integrate **Unity Cloud Diagnostics** to capture runtime errors, exceptions, and crash dumps. :contentReference[oaicite:15]{index=15}  
3. **Playtesting & Profiling Builds**  
   - Run regular playtests on target devices (mobile + PC) under realistic conditions.  
   - Use staging/pre‑production builds for performance testing, bug validation, and balance tuning.

## 5. Version Control & Collaboration  
- Use Git (or similar) for source control. Commit often, use branches for features/bugs. :contentReference[oaicite:16]{index=16}  
- Maintain code reviews: ensure any merge into main or dev branch is peer-reviewed for readability, performance, and architecture.  
- Document major systems: write README, architecture docs, code comments, and update as systems evolve.

## 6. Rendering & Graphics  
- Use LOD groups for 3D models: switch to simpler meshes when objects are far away. :contentReference[oaicite:17]{index=17}  
- Bake lighting where possible; use mixed or baked lighting to reduce runtime lighting cost. :contentReference[oaicite:18]{index=18}  
- Use occlusion culling to avoid rendering objects not currently visible to the camera. :contentReference[oaicite:19]{index=19}  

## 7. Security / Build Safety  
- Avoid exposing secrets: API keys, service tokens, or backend credentials should never be embedded in client builds.  
- Validate all client‑side data / inputs before sending to backend; assume malicious clients.  
- Use runtime checks for performance: if a device is too weak, lower graphic settings or disable expensive effects.

