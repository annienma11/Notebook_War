Full Game Plan — Blue vs Red: Notebook War 3D
1. Game Vision & Concept

Genre: 3D First‑Person Shooter (FPS)

Art Style: Black-and-white notebook sketch world — white paper surfaces, black ink outlines, minimal but stylized.

Protagonist: Blue Stickman.

Antagonists: Red Stickmen factions.

Core Gameplay Loop: The player fights through 10 stages, defeating red stickmen, collecting weapons and boosts, and completing objectives. Player progression unlocks new weapons, abilities, and stronger enemies.

2. Major Features & Systems

These systems persist across game and grow in complexity as you progress:

Movement: Walk, sprint, jump, crouch, slide, vault (or climb)

Combat / Weapons: Multiple weapons (pistol, SMG, rifle, shotgun, sniper, grenades) — pick up, switch, reload

Pickups: Ammo, medkits, armor, speed boost, damage boost

Player Stats: Health, Stamina, Armor

AI / Enemies: Patrol, detect, engage, flank, retreat, bosses

Interactive Environment: Doors, ladders, destructible objects / simple physics

HUD / UI: Health bar, armor bar, ammo, current weapon, objective display

Progression System: Unlock weapons / boosts, track player stats, save progress

Difficulty Dynamics: Increase challenge via enemy variety, density, and behavior as stages go on

Checkpoint or Save System: Between major sections or at key points

Multiplatform Controls: Keyboard / mouse (PC), touch (mobile)

Performance Optimizations: Object pooling, low‑poly models, efficient shaders

Backend / Cloud Systems: Use Supabase for storing player progress, inventory, and leaderboards

3. Stage-by-Stage Breakdown (Game Stages 1–10)

Here are 10 planned stages (levels) with objectives, challenges, and feature progression. Each stage introduces something new (mechanic, enemy type, environment).

Stage	Environment / Theme	Key Objective(s)	Notable Features / Challenges
Stage 1	Apartment Complex	Clear building, eliminate floor-by-floor red stickmen	Introduces basic combat, pick‑ups, close-quarters fights, simple AI patrols, pick up first pistol + SMG
Stage 2	Hotel Lobby & Rooms	Secure hostages, clear floors	Multiple floors, elevators, tighter corridors, first appearance of “shooter” AI, medkits become more important
Stage 3	Rooftop & Pool Area (Hotel)	Defeat a mid-boss, escape via rooftop	Elevated areas, sniper enemies, jump/vault mechanics, first grenade pickup
Stage 4	Industrial Sketch Factory	Destroy red stickmen supply lines	Conveyor belts, crates, destructible boxes, clusters of enemies, armor pickup becomes available
Stage 5	Underground Tunnel / Sewers	Navigate tunnel, hold off enemy ambush	Low-light, tighter spaces, flare / lighting mechanics, stamina-heavy movement, shotguns shine here
Stage 6	Parking Garage	Clear parked “sketch cars,” take out reinforced enemy squad	Cover-based combat, multi-level ramp, elite enemies, heavier AI with better tactics
Stage 7	City Street (Notebook City)	Fight through a red stickmen blockade	Open area + cover, mixed enemy types, damage-boost pickup, more dynamic combat, mobile‐style combat pacing
Stage 8	Hotel / Tower Rooftop (Boss)	Fight major boss, destroy communications or power equipment	Big boss encounter, scripted phases, combination of snipers + melee red stickmen, grenade usage encouraged
Stage 9	Jungle Sketchfield, Part 1	Traverse jungle terrain, find enemy camp	Trees, bushes, natural cover, AI snipers, hidden patrol paths, speed boost pickups, stealth-like combat segments
Stage 10	Jungle Sketchfield, Part 2 / Final Battle	Infiltrate enemy warlord base, defeat boss	Final boss, waves of enemies, mixed combat (melee + ranged), high-stakes pickups, full use of weapons and boosts, cinematic finish / escape sequence
4. Player Progression & Difficulty Curve

Weapon Unlocks: As the player progresses, more powerful weapons unlock (or become available as pickups).

Health & Boost Availability: Early stages have more medkits / pickups; mid game reduces frequency to increase tension, late game gives high-value but limited items.

Enemy Complexity:

Early stages: simple patrol AI

Middle: shooters + elite AI that flank

Later: elite + boss behaviors, coordinated attacks

Checkpoint or Save System: Use intermediate checkpoints / save whenever a major objective is completed.

Adaptive Challenge (Optional): Introduce dynamic difficulty balancing (DDA) — tune enemy health, spawn rate, or item frequency based on player performance. Dynamic difficulty balancing helps maintain challenge without frustration. 
Wikipedia

5. Level Design Principles

Use landmarks / visual cues (weenies) to guide the player’s navigation. 
Cubix

Vary space: mix tight, claustrophobic indoor areas (hotel, sewers) with open routes (streets, jungle) to evoke different emotional pacing. 
Cubix

Include clear critical paths in levels, but allow for optional detours or “exploration” paths for pickups or hidden challenges.

Design for iterative improvement: build a prototype of each level, playtest, gather feedback, and refine. 
DataCalculus
+1

6. Technical & Production Plan

Prototype Phase

Build minimal playable version for first 2-3 stages.

Implement core systems: movement, shooting, pickups, simple enemy AI, health system.

Core Gameplay Phase

Build out all 10 stages (blockout geometry, then polish).

Expand AI, weapons, pick-ups, interactions, VFX.

Integrate backend (Supabase) for save system & player progress.

Polish & Optimization

Profile performance on target devices (PC + mobile).

Optimize assets, pool objects, bake / lighten lighting.

Add shaders, UI polish, sound design, and visual effects.

Testing & Iteration

Conduct internal playtests per stage.

Adjust difficulty, checkpoint placement, pickups.

Fix bugs, improve AI behavior, improve level flow.

Backend Setup

Set up Supabase database to store progress, inventory, player stats.

Write API / sync logic in Unity.

Create system for storing and retrieving level completions, items collected, player score / rank.

Release & Deployment

Build for PC and mobile.

Set up CI / CD pipeline for builds.

Plan a soft launch (beta) for early feedback, then full release.

7. Risk & Mitigation

Risk: Performance issues on mobile

Mitigation: Use object pooling, low-poly models, limit particle effects, profile early

Risk: AI too weak or too strong

Mitigation: Use adjustable AI parameters per level, playtest, tune spawn behavior

Risk: Backend errors or data loss

Mitigation: Use Supabase with proper schema design, backups, and strong validation

Risk: Scope creep

Mitigation: Prioritize must-have features, use MVP mindset, regularly review the GDD

8. Milestones / Timeline (Example)

Month 1: Prototype core mechanics + first 2 levels

Month 2–3: Build all level blockouts, weapon systems, basic AI

Month 4: Integrate Supabase backend, implement save / load, inventory

Month 5: VFX, polish, sound design

Month 6: Playtesting, balancing, bug fixing

Month 7: Beta build → feedback → final tweaks → launch

9. Team & Roles (if relevant)

Lead Developer / Programmer — Handles core systems, Unity architecture

Level Designer — Designs layouts, objectives, enemy placements

Artist — Designs stickman models, environment props, VFX

Sound / Audio Engineer — Creates SFX for weapons, movement, UI

Backend Engineer — Implements Supabase schemas, API, save logic

QA / Tester — Playtests, reports bugs, helps balance difficulty

10. Success Metrics & KPIs

Player Retention: % of players who complete more than 3 levels

Average Session Time

Completion Rate: How many players finish each stage

Player Death Rate (or failure rate) per stage

Backend Metrics: Save / load success rate, error rate

Performance Metrics: Average FPS on target devices