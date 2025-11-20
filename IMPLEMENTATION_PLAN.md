# Blue vs Red: Notebook War 3D — 5 Milestone Implementation Plan

## **Milestone 1: Foundation & Core Systems** (Weeks 1-3)
**Goal:** Establish project architecture, core mechanics, and development infrastructure

### Deliverables:
- **Unity Project Setup**
  - Create folder structure: `/Scripts`, `/Scenes`, `/Prefabs`, `/Materials`, `/Textures`, `/Audio`, `/VFX`
  - Configure URP (Universal Render Pipeline) for black-and-white sketch aesthetic
  - Set up Git repository with `.gitignore` for Unity
  - Create dev/staging/production branches

- **Core Player Systems**
  - Player controller: WASD movement, sprint, jump, crouch
  - Camera system: First-person view with smooth rotation
  - Input abstraction layer (support PC keyboard/mouse)
  - Player stats: Health, Armor, Stamina (ScriptableObject-based)

- **Basic Combat Foundation**
  - Weapon base class architecture
  - Implement Pistol (first weapon)
  - Raycast-based shooting system
  - Basic damage system

- **Development Infrastructure**
  - Unity Test Framework setup
  - Object pooling system (for bullets, particles)
  - Custom Update Manager (to avoid excessive Update() calls)
  - Performance profiling baseline

### Success Criteria:
✅ Player can move, jump, sprint, and shoot pistol  
✅ Object pooling functional for bullets  
✅ Git workflow established with proper branching  
✅ Performance baseline documented (target: 60 FPS PC, 30 FPS mobile)

---

## **Milestone 2: Combat Systems & First Playable Level** (Weeks 4-6)
**Goal:** Complete weapon systems, basic AI, and Stage 1 (Apartment Complex)

### Deliverables:
- **Weapon Systems**
  - Complete all 6 weapons: Pistol, SMG, Rifle, Shotgun, Sniper, Grenade
  - Weapon switching system (hotkeys 1-6)
  - Reload mechanics, ADS (Aim Down Sights)
  - Weapon stats via ScriptableObjects
  - Ammo management system

- **Enemy AI Foundation**
  - Red Stickman base class
  - AI states: Patrol, Investigate, Engage, Retreat
  - NavMesh-based pathfinding
  - Basic grunt enemy type
  - Enemy health and damage system

- **Pickups System**
  - Ammo, Medkit, Armor pickups
  - Pickup spawning and collection logic
  - Inventory management (basic)

- **Stage 1: Apartment Complex**
  - Blockout geometry (3-4 floors)
  - Enemy spawn points and patrol routes
  - Objective: Clear all enemies floor-by-floor
  - Checkpoint system

- **UI/HUD**
  - Health, Armor, Ammo display
  - Weapon indicator
  - Crosshair
  - Objective text

### Success Criteria:
✅ All 6 weapons functional with proper feel  
✅ AI enemies patrol, detect, and engage player  
✅ Stage 1 playable from start to finish  
✅ HUD displays all critical information  
✅ Object pooling for enemies and pickups

---

## **Milestone 3: Advanced AI, Levels 2-5 & Polish** (Weeks 7-10)
**Goal:** Expand AI behaviors, build mid-game levels, add environmental interactions

### Deliverables:
- **Advanced AI**
  - Shooter enemy type (ranged combat)
  - Elite enemy type (flanking behavior)
  - AI cover system
  - Mid-boss AI (Stage 3)
  - Dynamic difficulty adjustment (optional)

- **Player Movement Expansion**
  - Slide mechanic
  - Vault/climb system
  - Interaction system (doors, ladders, objects)

- **Boost System**
  - Speed Boost pickup
  - Damage Boost pickup
  - Temporary effect system

- **Levels 2-5**
  - **Stage 2:** Hotel Lobby (multi-floor, elevators, hostage objective)
  - **Stage 3:** Rooftop/Pool (mid-boss, snipers, verticality)
  - **Stage 4:** Factory (conveyor belts, destructible crates)
  - **Stage 5:** Sewers (low-light, tight spaces, ambush)

- **Environmental Systems**
  - Destructible objects
  - Interactive doors/elevators
  - Simple physics interactions

- **Audio Foundation**
  - Weapon SFX (ink-burst sounds)
  - Footstep SFX (pen-scratch)
  - Ambient audio per level

### Success Criteria:
✅ AI exhibits flanking and cover behaviors  
✅ Stages 2-5 fully playable with unique mechanics  
✅ Player can slide, vault, and interact with environment  
✅ Audio enhances immersion  
✅ Performance maintained across all levels

---

## **Milestone 4: Late-Game Content, Supabase Backend & Mobile** (Weeks 11-14)
**Goal:** Complete all 10 stages, integrate cloud backend, add mobile support

### Deliverables:
- **Levels 6-10**
  - **Stage 6:** Parking Garage (multi-level, cover combat)
  - **Stage 7:** City Streets (open combat, mixed enemies)
  - **Stage 8:** Tower Boss (phased boss fight)
  - **Stage 9:** Jungle Part 1 (stealth, natural cover)
  - **Stage 10:** Jungle Part 2 (final boss, climax)

- **Boss AI**
  - Tower Boss (Stage 8): Phased combat, minion spawns
  - Final Boss (Stage 10): Multi-phase, varied attacks

- **Supabase Backend Integration**
  - Database schema: Users, PlayerProgress, Inventory, Leaderboard
  - RLS policies for all tables
  - Authentication system (email/OAuth)
  - Save/Load system (progress, inventory, stats)
  - Leaderboard system
  - Edge Functions for sensitive operations

- **Mobile Support**
  - Touch input system (dual-stick controls)
  - Mobile UI layout (larger buttons, optimized HUD)
  - Performance optimization for mobile (LOD, occlusion culling)
  - Touch-friendly weapon selection

- **Progression System**
  - Weapon unlock system
  - Achievement tracking
  - Player stats tracking (kills, deaths, completion time)

### Success Criteria:
✅ All 10 stages complete and balanced  
✅ Boss fights challenging and engaging  
✅ Supabase backend fully functional with RLS  
✅ Mobile build runs at 30+ FPS on mid-range devices  
✅ Save/load works reliably across sessions

---

## **Milestone 5: Polish, Testing & Launch Preparation** (Weeks 15-18)
**Goal:** Final polish, comprehensive testing, optimization, and launch readiness

### Deliverables:
- **Visual Polish**
  - Sketch-style VFX (muzzle flash, bullet impacts, explosions)
  - Post-processing effects (outline shaders, sketch filters)
  - Particle effects for all weapons
  - Death animations and ragdolls
  - UI/UX polish and animations

- **Audio Completion**
  - Complete weapon SFX library
  - Ambient soundscapes for all levels
  - Music tracks (minimal electronic/sketch-ambient)
  - UI sound effects

- **Optimization Pass**
  - Unity Profiler analysis on all levels
  - Texture atlasing and compression
  - Light baking for static geometry
  - Occlusion culling setup
  - Memory optimization (target: <2GB RAM mobile)
  - Draw call reduction (batching)

- **Testing & QA**
  - Automated tests for core systems
  - Full playthrough testing (all 10 stages)
  - Balance tuning (enemy difficulty, pickup frequency)
  - Bug fixing sprint
  - Device testing (PC + 5+ mobile devices)
  - Performance validation

- **Menus & Meta Systems**
  - Main menu, pause menu, settings
  - Level select screen
  - Leaderboard UI
  - Credits screen
  - Tutorial/onboarding (Stage 1 intro)

- **CI/CD Pipeline**
  - Automated build system for PC/Android/iOS
  - Staging environment testing
  - Version tagging and release management

- **Documentation**
  - Player-facing: Controls guide, tips
  - Developer-facing: Architecture docs, API docs
  - Supabase schema documentation

- **Launch Preparation**
  - Store listings (Steam, Google Play, App Store)
  - Marketing materials (screenshots, trailer)
  - Beta testing program
  - Crash reporting integration (Unity Cloud Diagnostics)
  - Analytics integration

### Success Criteria:
✅ Game runs smoothly on all target platforms  
✅ All 10 stages balanced and bug-free  
✅ Visual and audio polish complete  
✅ Zero critical bugs, minimal known issues  
✅ Store listings approved and ready  
✅ CI/CD pipeline functional  
✅ Beta test feedback incorporated

---

## **Risk Mitigation Strategy**

| Risk | Mitigation |
|------|------------|
| Performance issues on mobile | Profile early (Milestone 1), use object pooling, LOD, occlusion culling |
| AI too weak/strong | Adjustable parameters via ScriptableObjects, extensive playtesting |
| Scope creep | Strict MVP focus, defer advanced features to post-launch |
| Supabase backend errors | Comprehensive RLS testing, staging environment, regular backups |
| Cross-platform input issues | Abstract input layer from Milestone 1, test on devices regularly |

---

## **Post-Launch Roadmap** (Optional)
- Additional levels/stages
- New weapon types
- Multiplayer mode (co-op or PvP)
- Cosmetic customization
- Seasonal events
- Community-created content support

---

## **Current Status**
- **Active Milestone:** Milestone 1 - Foundation & Core Systems
- **Start Date:** [Current Date]
- **Target Completion:** Week 3
