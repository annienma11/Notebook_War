Figma-Ready GDD — Blue vs Red: Notebook War 3D

Frame 1: Executive Summary

Title: Blue vs Red: Notebook War 3D

Genre: 3D FPS

Platforms: PC / Mobile

Art Style: Black-and-white notebook sketch

Core Gameplay: Navigate sketch-world levels, fight Red Stickmen, collect weapons and boosts, progress through 10 stages

Frame 2: Game Concept

Protagonist: Blue Stickman

Antagonists: Red Stickmen

USPs: Sketch-style visuals, evolving AI, interactive environments, weapon progression, Supabase cloud saves

Frame 3: Gameplay & Mechanics

Core Loop: Enter → Navigate → Combat → Collect → Complete → Save/Upgrade

Controls:

PC: WASD + Shift + Space + Ctrl + E + Weapon Hotkeys

Mobile: Dual-stick + Touch Buttons

Weapons & Combat: Pistol, SMG, Rifle, Shotgun, Sniper, Grenade

Pickups: Health, Armor, Speed/Damage Boost, Ammo

Player Stats: Health, Armor, Stamina

Frame 3.1: Enemy AI

Behaviors: Patrol, Investigate, Engage, Flank, Retreat, Boss

Types: Grunt, Shooter, Elite, Boss

Frame 3.2: Levels & Objectives (Table format for Figma)

Stage	Environment	Objective	Feature
1	Apartment Complex	Clear building	Intro combat, pistol/SMG
2	Hotel Lobby	Secure hostages	Multi-floor verticality
3	Rooftop / Pool	Mid-boss	Snipers, jump mechanics
4	Factory	Destroy supply lines	Conveyor belts, destructibles
5	Sewers	Survive ambush	Low-light, shotguns
6	Parking Garage	Clear squad	Multi-level, cover combat
7	City Streets	Break blockade	Mixed combat, speed boost
8	Tower Boss	Defeat tower boss	Phased fight, grenades
9	Jungle 1	Infiltrate camp	Stealth, natural cover
10	Jungle 2	Final battle	Boss waves, climax combat

Frame 4: Level Design Principles

Landmarks for navigation

Mix indoor/outdoor spaces

Optional exploration paths

Prototype → Test → Polish

Frame 5: UI / UX

HUD: Health, Armor, Ammo, Weapon, Objective

Menus: Main, Pause, Settings, Inventory

Accessibility: Scalable UI, touch-friendly

Frame 6: Audio

Footsteps: Pen-scratch

Weapons: Gunfire = ink-burst, Reload = pen-click

Ambient: Doors, elevators, jungle wind

Music: Minimal electronic / sketch-ambient

Frame 7: Technical Design

Unity (URP) engine

Object pooling for bullets, particles, enemies

Scene streaming or additive scenes

Supabase backend: Auth, Database, Realtime optional

Data Schema: Users, Player Progress, Inventory, Leaderboard

Optimization: LOD, occlusion culling, light baking

Frame 8: Progression & Replayability

Unlock weapons, boosts, achievements

Difficulty modes: Normal / Hard

Optional monetization: one-time purchase, cosmetic IAP

Frame 9: Risks & Mitigation

Performance: Pooling, low-poly assets

AI balance: Adjustable parameters, playtesting

Backend: Validation, backups

Scope creep: MVP first

Frame 10: Milestones / Roadmap

Prototype: 1–2 stages, core mechanics

Full development: all 10 levels, AI, pickups, UI

Backend integration: Supabase save/load

Polish: VFX, audio, shaders, performance

QA: Playtesting, balancing, bug fixes

Release: PC & mobile

Post-launch: Updates

Frame 11: Team Roles

Game Designer, Unity Developer, Artist, UI/UX Designer, Sound Designer, Backend Engineer, QA Tester

Frame 12: Success Metrics

Retention, Level Completion Rate, Session Duration, Player Death Rate, Backend Reliability, Performance Metrics

✅ How to Use in Figma:

Copy each "Frame" section into a separate Figma Frame.

Use text blocks for bullets and tables.

Use collapsible frames for Levels, Weapons, or AI Behaviors for easy navigation.

Optional: Add icons for weapons, boosts, enemies, and level environments to visually enhance the GDD.