# Blue vs Red: Notebook War 3D - Setup Instructions

## Prerequisites

- Unity 2022 LTS or newer
- Git installed
- Visual Studio or Rider (recommended IDE)
- 8GB RAM minimum (16GB recommended)

## Initial Setup

### 1. Create Unity Project

```bash
# Open Unity Hub
# Click "New Project"
# Select "3D (URP)" template
# Name: "Notebook_War"
# Location: Choose your workspace
```

### 2. Copy Project Files

```bash
# Copy the Assets folder from this repository into your Unity project
cp -r /workspaces/Notebook_War/Assets /path/to/your/Unity/Notebook_War/
```

### 3. Install Required Packages

Open Unity Package Manager (Window > Package Manager):
- Universal Render Pipeline (URP) - Should be pre-installed
- Test Framework (for automated testing)
- TextMeshPro (for UI)

### 4. Configure Project Settings

#### Graphics Settings
1. Edit > Project Settings > Graphics
2. Set Scriptable Render Pipeline to URP asset
3. Create URP asset: Assets > Create > Rendering > URP Asset

#### Physics Settings
1. Edit > Project Settings > Physics
2. Set up collision layers:
   - Layer 6: Player
   - Layer 7: Enemy
   - Layer 8: Projectile
   - Layer 9: Ground
   - Layer 10: Interactable

#### Tags
1. Edit > Project Settings > Tags and Layers
2. Add tags:
   - Player
   - Enemy
   - Weapon
   - Pickup

### 5. Create ScriptableObject Assets

#### Player Stats
1. Right-click in Assets/Data folder
2. Create > NotebookWar > Player Stats
3. Name: "PlayerStats_Default"
4. Configure values:
   - Max Health: 100
   - Max Armor: 100
   - Max Stamina: 100
   - Walk Speed: 5
   - Sprint Speed: 8
   - Jump Force: 5

#### Pistol Weapon Data
1. Right-click in Assets/Data/Weapons folder
2. Create > NotebookWar > Weapon Data
3. Name: "Pistol_Data"
4. Configure values:
   - Weapon Name: "Pistol"
   - Damage: 15
   - Fire Rate: 0.3
   - Range: 100
   - Magazine Size: 12
   - Reload Time: 1.5
   - Is Automatic: false

### 6. Create Player Prefab

1. Create empty GameObject: "Player"
2. Add components:
   - Character Controller
   - Player Controller (script)
   - Capsule Collider (if not auto-added)
3. Create child GameObject: "Camera"
   - Add Camera component
   - Position: (0, 0.6, 0)
   - Tag: MainCamera
4. Create child GameObject: "WeaponHolder"
   - Position: (0.3, 0.4, 0.5)
   - Create child: "FirePoint"
     - Position: (0, 0, 0.5)
5. Assign references in Player Controller:
   - Stats: PlayerStats_Default
   - Camera Transform: Camera object
6. Save as prefab: Assets/Prefabs/Player.prefab

### 7. Create Test Scene

1. Create new scene: Assets/Scenes/TestScene.unity
2. Add Player prefab to scene at (0, 2, 0)
3. Create ground plane:
   - GameObject > 3D Object > Plane
   - Scale: (10, 1, 10)
   - Layer: Ground
4. Add lighting:
   - GameObject > Light > Directional Light
5. Save scene

### 8. Configure Build Settings

1. File > Build Settings
2. Add TestScene to build
3. Set platform to PC/Mac/Linux Standalone
4. Player Settings:
   - Company Name: Your name
   - Product Name: Blue vs Red Notebook War 3D
   - Default Icon: (optional)

### 9. Initialize Git Repository

```bash
cd /path/to/your/Unity/Notebook_War
git init
git add .
git commit -m "Initial commit - Milestone 1 foundation"
git branch dev
git branch staging
```

### 10. Test the Game

1. Open TestScene
2. Press Play
3. Test controls:
   - WASD: Movement
   - Mouse: Look around
   - Space: Jump
   - Shift: Sprint
   - Ctrl: Crouch
   - Left Click: Fire (when weapon added)
   - R: Reload

## Troubleshooting

### Player falls through ground
- Ensure ground has Collider component
- Check Physics layer collision matrix
- Verify Character Controller is properly configured

### Camera not rotating
- Check Camera Transform is assigned in Player Controller
- Verify mouse sensitivity is not 0
- Ensure Cursor.lockState is set to Locked

### Scripts not compiling
- Check all using statements are correct
- Verify Unity version compatibility
- Reimport all scripts (right-click Assets > Reimport All)

### Performance issues
- Open Profiler (Window > Analysis > Profiler)
- Check CPU and GPU usage
- Verify object pooling is working
- Reduce draw calls if needed

## Next Steps

After setup is complete:
1. Review MILESTONE_1_PROGRESS.md for current status
2. Test all systems thoroughly
3. Document performance baseline
4. Proceed to Milestone 2 tasks

## Support

For issues or questions:
- Check Unity documentation: https://docs.unity3d.com/
- Review development rules in .amazonq/rules/
- Consult GAMEPLAN.md and GDD.md for design reference
