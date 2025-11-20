# Quick Start Guide - Blue vs Red: Notebook War 3D

## 🚀 Get Started in 5 Minutes

### Step 1: Open Unity
```
Unity Hub → New Project → 3D (URP) → Name: "Notebook_War"
```

### Step 2: Copy Files
```bash
# Copy Assets folder to your Unity project
cp -r Assets /path/to/Unity/Notebook_War/
```

### Step 3: Create Player Stats Asset
```
Right-click in Assets/Data/
→ Create → NotebookWar → Player Stats
→ Name: "PlayerStats_Default"
```

### Step 4: Create Pistol Data Asset
```
Right-click in Assets/Data/Weapons/
→ Create → NotebookWar → Weapon Data
→ Name: "Pistol_Data"
→ Set: Damage=15, FireRate=0.3, MagazineSize=12
```

### Step 5: Build Player Prefab
```
1. Create GameObject "Player"
2. Add: Character Controller, Player Controller script
3. Add child "Camera" with Camera component
4. Add child "WeaponHolder" → child "FirePoint"
5. Assign references in Player Controller inspector
6. Save as Prefab
```

### Step 6: Create Test Scene
```
1. New Scene → Save as "TestScene"
2. Add Player prefab at (0, 2, 0)
3. Add Plane for ground (scale 10x10)
4. Add Directional Light
5. Save
```

### Step 7: Play!
```
Press Play → Test controls:
- WASD: Move
- Mouse: Look
- Space: Jump
- Shift: Sprint
- Ctrl: Crouch
```

## 📚 Documentation

- **Full Setup:** See `SETUP_INSTRUCTIONS.md`
- **Architecture:** See `ARCHITECTURE.md`
- **Progress:** See `MILESTONE_1_PROGRESS.md`
- **Roadmap:** See `IMPLEMENTATION_PLAN.md`

## 🎮 Controls

| Action | Key |
|--------|-----|
| Move | WASD |
| Look | Mouse |
| Jump | Space |
| Sprint | Shift |
| Crouch | Ctrl |
| Fire | Left Click |
| Reload | R |
| Interact | E |
| Weapon 1-6 | 1-6 Keys |

## 🔧 Troubleshooting

**Player falls through ground?**
→ Add Collider to ground plane

**Camera not moving?**
→ Check Camera Transform is assigned in inspector

**Scripts won't compile?**
→ Reimport all (Right-click Assets → Reimport All)

## 📞 Need Help?

1. Check `SETUP_INSTRUCTIONS.md` for detailed steps
2. Review `ARCHITECTURE.md` for system design
3. See `MILESTONE_1_PROGRESS.md` for current status

## ✅ Checklist

- [ ] Unity 2022 LTS installed
- [ ] URP package installed
- [ ] Assets folder copied
- [ ] PlayerStats asset created
- [ ] Pistol data asset created
- [ ] Player prefab built
- [ ] Test scene created
- [ ] Game tested and working

## 🎯 What's Next?

After setup works:
1. Review all documentation
2. Test performance with Profiler
3. Initialize Git repository
4. Start Milestone 2 tasks

---

**Ready to build an awesome game! 🎮**
