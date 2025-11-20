Blue vs Red: Notebook War 3D — Game Design Document (GDD)
1. Executive Summary

Title: Blue vs Red: Notebook War 3D

Genre: 3D FPS

Platforms: PC (keyboard + mouse), Mobile (touch)

Art Style: Black-and-white notebook sketch aesthetic

Core Gameplay: Navigate sketch-world levels, fight Red Stickmen, collect weapons and boosts, and progress through 10 stages.

2. Game Concept

Protagonist: Blue Stickman

Antagonists: Red Stickmen

USPs: Sketch-style visuals, evolving enemy AI, interactive environments, weapon & boost progression, Supabase-backed cloud saves

3. Gameplay & Mechanics
3.1 Core Loop

Enter level → navigate → combat → collect pickups → complete objective

Save progress and unlock upgrades

3.2 Player Controls

Movement: Walk, sprint, jump, crouch, slide, vault

PC: WASD + Shift + Space + Ctrl + E + weapon hotkeys

Mobile: Dual-stick + touch buttons

3.3 Combat & Weapons

Weapons: Pistol, SMG, Rifle, Shotgun, Sniper, Grenades

Mechanics: ADS, reload, headshots, damage variation

3.4 Pickups & Boosts

Health (medkits), Armor, Speed Boost, Damage Boost, Ammo

3.5 Player Stats

Health, Armor, Stamina

3.6 Enemy AI

Behaviors: Patrol, Investigate, Engage, Flank, Retreat, Boss

Enemy types: Grunt, Shooter, Elite, Boss

3.7 Levels & Objectives
Stage	Environment	Objective	Key Feature
1	Apartment Complex	Clear building	Intro combat, pistol/SMG
2	Hotel Lobby	Secure hostages	Multi-floor verticality
3	Rooftop / Pool	Mid-boss	Snipers, jump mechanics
4	Factory	Destroy supply lines	Conveyor belts, destructible crates
5	Sewers	Survive ambush	Low-light, shotguns
6	Parking Garage	Clear squad	Multi-level, cover-based combat
7	City Streets	Break blockade	Mixed combat, speed boost
8	Tower Boss	Defeat tower boss	Phased fight, grenades
9	Jungle 1	Infiltrate camp	Stealth, natural cover
10	Jungle 2	Final battle	Boss waves, climax combat
3.8 Progression

Unlock weapons and boosts gradually

Increase enemy difficulty, decrease pickup frequency

Checkpoints between critical points

4. Level Design Principles

Landmarks for navigation

Mix cramped indoor and open outdoor spaces

Optional exploration paths

Prototype → test → polish

5. UI & UX

HUD: Health, Armor, Ammo, Weapon, Objective

Menus: Main, Pause, Settings, Inventory

Accessibility: Scalable UI, touch-friendly buttons

6. Audio

Footsteps: Pen-scratch

Weapons: Gunfire = ink-burst, reload = pen-click

Ambient SFX: Doors, elevators, jungle wind

Music: Minimal electronic or sketch-ambient

7. Technical Design

Engine: Unity (URP)

Object pooling for bullets, enemies, particles

Scene streaming or additive scenes for large levels

Backend: Supabase (Auth, Database, Realtime optional)

Data Schema: Users, Player Progress, Inventory, Leaderboard

Performance: LOD, occlusion culling, light baking, efficient shaders

8. Progression & Replayability

Unlockables, achievements, difficulty modes

Optional monetization: One-time purchase, cosmetic IAP

9. Risks & Mitigation

Performance: object pooling, low-poly assets

AI balance: adjustable parameters, playtesting

Backend errors: validation, backups

Scope creep: MVP first, advanced features post-launch

10. Milestones

Prototype: 1–2 stages, core mechanics

Full development: All 10 levels, AI, pickups, UI

Backend integration: Supabase save/load

Polish: VFX, audio, shaders, performance

QA: Playtesting, balancing, bug fixes

Release: PC & mobile build, CI/CD setup

Post-launch: Updates, new levels or modes

11. Team Roles

Game Designer, Unity Developer, Artist, UI/UX Designer, Sound Designer, Backend Engineer, QA Tester

12. Success Metrics

Player retention

Level completion rates

Session duration

Player death/fail rate

Backend reliability

Performance metrics