# Unity Setup Checklist - Milestone 1

## Pre-Setup
- [ ] Unity Hub installed
- [ ] Unity 2022 LTS downloaded
- [ ] Visual Studio or Rider installed
- [ ] Git installed (optional but recommended)

## Project Creation
- [ ] Create new Unity project (3D URP template)
- [ ] Name: "Notebook_War"
- [ ] Copy Assets folder from repository
- [ ] Verify all scripts imported without errors

## Package Installation
- [ ] Universal Render Pipeline (should be pre-installed)
- [ ] Test Framework (Window → Package Manager)
- [ ] TextMeshPro (Window → Package Manager)

## Project Settings

### Graphics
- [ ] Edit → Project Settings → Graphics
- [ ] Create URP Asset: Assets → Create → Rendering → URP Asset
- [ ] Assign URP asset to Graphics settings

### Physics Layers
- [ ] Edit → Project Settings → Tags and Layers
- [ ] Layer 6: Player
- [ ] Layer 7: Enemy
- [ ] Layer 8: Projectile
- [ ] Layer 9: Ground
- [ ] Layer 10: Interactable

### Tags
- [ ] Player
- [ ] Enemy
- [ ] Weapon
- [ ] Pickup

### Physics Collision Matrix
- [ ] Edit → Project Settings → Physics
- [ ] Player collides with: Ground, Enemy, Interactable
- [ ] Enemy collides with: Ground, Player, Projectile
- [ ] Projectile collides with: Enemy, Ground

## Asset Creation

### Player Stats
- [ ] Create folder: Assets/Data
- [ ] Right-click → Create → NotebookWar → Player Stats
- [ ] Name: "PlayerStats_Default"
- [ ] Configure:
  - [ ] Max Health: 100
  - [ ] Max Armor: 100
  - [ ] Max Stamina: 100
  - [ ] Walk Speed: 5
  - [ ] Sprint Speed: 8
  - [ ] Crouch Speed: 2.5
  - [ ] Jump Force: 5
  - [ ] Stamina Regen Rate: 10
  - [ ] Sprint Stamina Cost: 20

### Weapon Data
- [ ] Create folder: Assets/Data/Weapons
- [ ] Right-click → Create → NotebookWar → Weapon Data
- [ ] Name: "Pistol_Data"
- [ ] Configure:
  - [ ] Weapon Name: "Pistol"
  - [ ] Damage: 15
  - [ ] Fire Rate: 0.3
  - [ ] Range: 100
  - [ ] Magazine Size: 12
  - [ ] Reload Time: 1.5
  - [ ] Is Automatic: false
  - [ ] Recoil: 1

## Prefab Creation

### Player Prefab
- [ ] Create empty GameObject: "Player"
- [ ] Add Character Controller component
  - [ ] Height: 2
  - [ ] Radius: 0.5
  - [ ] Center: (0, 1, 0)
- [ ] Add Player Controller script
- [ ] Assign PlayerStats_Default to Stats field
- [ ] Set Mouse Sensitivity: 2

### Camera Setup
- [ ] Create child of Player: "Camera"
- [ ] Add Camera component
- [ ] Position: (0, 0.6, 0)
- [ ] Tag: MainCamera
- [ ] Assign to Player Controller's Camera Transform field

### Weapon Holder
- [ ] Create child of Player: "WeaponHolder"
- [ ] Position: (0.3, 0.4, 0.5)
- [ ] Create child of WeaponHolder: "FirePoint"
- [ ] Position: (0, 0, 0.5)

### Weapon Prefab (Optional for now)
- [ ] Create empty GameObject: "Pistol"
- [ ] Add Pistol script
- [ ] Assign Pistol_Data to Weapon Data field
- [ ] Assign FirePoint to Fire Point field
- [ ] Set Hit Layers to include Enemy and Ground
- [ ] Save as prefab: Assets/Prefabs/Weapons/Pistol.prefab
- [ ] Add to WeaponHolder in Player prefab

### Save Player Prefab
- [ ] Drag Player to Assets/Prefabs/
- [ ] Name: "Player.prefab"

## Scene Setup

### Test Scene
- [ ] Create new scene: File → New Scene
- [ ] Save as: Assets/Scenes/TestScene.unity

### Ground
- [ ] GameObject → 3D Object → Plane
- [ ] Name: "Ground"
- [ ] Position: (0, 0, 0)
- [ ] Scale: (10, 1, 10)
- [ ] Layer: Ground

### Lighting
- [ ] GameObject → Light → Directional Light
- [ ] Rotation: (50, -30, 0)
- [ ] Intensity: 1

### Player Instance
- [ ] Drag Player prefab into scene
- [ ] Position: (0, 2, 0)

### Save Scene
- [ ] File → Save Scene
- [ ] Ctrl+S to save

## Build Settings
- [ ] File → Build Settings
- [ ] Add TestScene to build
- [ ] Platform: PC, Mac & Linux Standalone
- [ ] Architecture: x86_64

## Player Settings
- [ ] Edit → Project Settings → Player
- [ ] Company Name: [Your Name]
- [ ] Product Name: Blue vs Red Notebook War 3D
- [ ] Version: 0.1.0 (Milestone 1)

## Testing

### Initial Test
- [ ] Press Play button
- [ ] Verify no console errors
- [ ] Player should be standing on ground

### Movement Test
- [ ] WASD keys move player
- [ ] Movement is smooth
- [ ] Player doesn't fall through ground

### Camera Test
- [ ] Mouse moves camera
- [ ] Look up/down works (clamped at 90°)
- [ ] Look left/right works (360°)
- [ ] Cursor is locked

### Jump Test
- [ ] Space bar makes player jump
- [ ] Player lands back on ground
- [ ] Can't infinite jump

### Sprint Test
- [ ] Hold Shift to sprint
- [ ] Player moves faster
- [ ] Stamina decreases (check in inspector)
- [ ] Stamina regenerates when not sprinting

### Crouch Test
- [ ] Hold Ctrl to crouch
- [ ] Player moves slower
- [ ] (Visual crouch in Milestone 2)

## Performance Check
- [ ] Window → Analysis → Profiler
- [ ] Press Play
- [ ] Check CPU usage
- [ ] Check FPS (should be 60+)
- [ ] Check memory allocation
- [ ] No major GC spikes

## Git Setup (Optional)
- [ ] Open terminal in project folder
- [ ] `git init`
- [ ] `git add .`
- [ ] `git commit -m "Milestone 1 - Foundation complete"`
- [ ] `git branch dev`
- [ ] `git branch staging`

## Documentation
- [ ] Read ARCHITECTURE.md
- [ ] Review MILESTONE_1_PROGRESS.md
- [ ] Check IMPLEMENTATION_PLAN.md for next steps

## Final Verification
- [ ] All scripts compile without errors
- [ ] All assets created and assigned
- [ ] Player prefab complete and functional
- [ ] Test scene playable
- [ ] Performance meets targets (60 FPS)
- [ ] No console errors or warnings

## 🎉 Milestone 1 Complete!

If all items are checked, you're ready to proceed to Milestone 2!

---

**Next Steps:**
1. Review Milestone 2 requirements in IMPLEMENTATION_PLAN.md
2. Start implementing weapon systems
3. Begin AI enemy development
4. Create Stage 1 level blockout

**Estimated Time to Milestone 2:** 3 weeks
