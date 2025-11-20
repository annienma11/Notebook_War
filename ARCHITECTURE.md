# Blue vs Red: Notebook War 3D - Architecture Documentation

## System Overview

This document outlines the technical architecture and design patterns used in the game.

## Core Design Patterns

### 1. Data-Driven Design
**ScriptableObjects** are used for all configuration data to separate data from logic:
- `PlayerStats`: Health, armor, stamina, movement speeds
- `WeaponData`: Damage, fire rate, magazine size, reload time
- Future: `EnemyData`, `LevelData`, `PickupData`

**Benefits:**
- Easy balancing without code changes
- Designer-friendly workflow
- Runtime memory efficiency
- Asset reusability

### 2. Dependency Injection via Interfaces
**Input System** uses interface abstraction:
```
IInputProvider (interface)
├── KeyboardMouseInput (PC)
└── TouchInput (Mobile - Milestone 4)
```

**Benefits:**
- Platform-agnostic code
- Easy testing with mock inputs
- Runtime input switching capability

### 3. Object Pooling
**ObjectPool** manages frequently instantiated objects:
- Bullets
- Particle effects
- Enemy spawns
- UI elements

**Benefits:**
- Eliminates GC spikes
- Consistent frame times
- Reduced memory fragmentation

### 4. Custom Update Manager
**UpdateManager** centralizes update calls:
- Single Update() loop
- Registered IUpdatable objects
- Reduced MonoBehaviour overhead

**Benefits:**
- Better cache coherency
- Easier profiling
- Controlled update order

### 5. Singleton Pattern (Managers)
**GameManager** and **UpdateManager** use singleton pattern:
- Global access point
- Persistent across scenes
- Single instance guarantee

**Note:** Used sparingly to avoid anti-patterns

## System Architecture

### Player System
```
PlayerController
├── Movement (WASD, sprint, jump, crouch)
├── Rotation (mouse look)
├── Stamina Management
└── Damage/Health System

Dependencies:
- PlayerStats (ScriptableObject)
- IInputProvider (interface)
- CharacterController (Unity)
```

### Weapon System
```
WeaponBase (abstract)
├── Fire()
├── Reload()
├── CanFire()
└── OnHit()

Pistol : WeaponBase
SMG : WeaponBase (Milestone 2)
Rifle : WeaponBase (Milestone 2)
...

Dependencies:
- WeaponData (ScriptableObject)
- IInputProvider (interface)
- IDamageable (interface)
```

### Damage System
```
IDamageable (interface)
├── TakeDamage(float damage)

Implementations:
- PlayerController
- EnemyBase (Milestone 2)
- DestructibleObject (Milestone 3)
```

### Pooling System
```
ObjectPool
├── prefab (GameObject)
├── initialSize (int)
├── expandable (bool)
└── Methods:
    ├── Get(position, rotation)
    ├── Return(object)
    └── ReturnAll()

Usage:
- BulletPool
- ParticlePool
- EnemyPool (Milestone 2)
```

## Folder Structure

```
Assets/
├── Scenes/
│   ├── TestScene.unity
│   └── Stage_01_Apartment.unity (Milestone 2)
├── Scripts/
│   ├── Data/
│   │   ├── PlayerStats.cs
│   │   └── WeaponData.cs
│   ├── Input/
│   │   ├── IInputProvider.cs
│   │   └── KeyboardMouseInput.cs
│   ├── Player/
│   │   └── PlayerController.cs
│   ├── Weapons/
│   │   ├── WeaponBase.cs
│   │   └── Pistol.cs
│   ├── AI/ (Milestone 2)
│   ├── UI/ (Milestone 2)
│   ├── Pooling/
│   │   └── ObjectPool.cs
│   └── Managers/
│       ├── GameManager.cs
│       └── UpdateManager.cs
├── Prefabs/
│   ├── Player.prefab
│   └── Weapons/
│       └── Pistol.prefab
├── Materials/
├── Textures/
├── Audio/
└── VFX/
```

## Performance Considerations

### Memory Management
- **Object Pooling:** Pre-allocate frequently used objects
- **ScriptableObjects:** Share data across instances
- **Struct vs Class:** Use structs for small data types
- **Avoid Allocations:** Minimize `new` in Update loops

### CPU Optimization
- **Custom UpdateManager:** Reduce MonoBehaviour overhead
- **Cached References:** Store GetComponent results
- **Layer Masks:** Optimize raycasts and physics queries
- **Time Slicing:** Break heavy operations across frames (Milestone 3)

### GPU Optimization (Future)
- **URP:** Lightweight render pipeline
- **Batching:** Static and dynamic batching
- **LOD:** Level of detail for distant objects
- **Occlusion Culling:** Don't render hidden objects

## Code Conventions

### Naming
- **Classes:** PascalCase (PlayerController)
- **Methods:** PascalCase (TakeDamage)
- **Variables:** camelCase (currentHealth)
- **Private Fields:** camelCase with underscore (optional)
- **Constants:** UPPER_SNAKE_CASE
- **Interfaces:** IPascalCase (IInputProvider)

### Organization
- One class per file
- File name matches class name
- Group related classes in folders
- Use namespaces (NotebookWar.*)

### Comments
- XML documentation for public APIs
- Inline comments for complex logic only
- TODO comments for future work
- Avoid obvious comments

## Testing Strategy

### Unit Tests (Unity Test Framework)
- Player movement calculations
- Weapon damage calculations
- Stamina system logic
- Object pool behavior

### Integration Tests
- Player + Input system
- Weapon + Damage system
- AI + Navigation (Milestone 2)

### Performance Tests
- Frame rate benchmarks
- Memory allocation tracking
- Draw call counts
- Physics performance

## Future Architecture (Upcoming Milestones)

### Milestone 2
- **AI System:** State machine for enemy behavior
- **UI System:** HUD, health bars, ammo display
- **Audio System:** Sound manager with pooling

### Milestone 3
- **Interaction System:** Doors, ladders, pickups
- **Boost System:** Temporary effect manager
- **Environmental System:** Destructibles, physics

### Milestone 4
- **Supabase Integration:** Backend service layer
- **Save System:** Serialization and cloud sync
- **Mobile Input:** Touch controls implementation

### Milestone 5
- **VFX System:** Particle effects, post-processing
- **Menu System:** UI flow and navigation
- **Analytics:** Event tracking and telemetry

## Dependencies

### Unity Packages
- Universal Render Pipeline (URP)
- Test Framework
- TextMeshPro
- Input System (optional, using legacy for now)

### External (Future)
- Supabase Unity SDK (Milestone 4)
- DOTween (optional, for animations)

## Build Pipeline (Future)

```
Development → Staging → Production

Branches:
- dev: Active development
- staging: Pre-release testing
- main: Production releases

CI/CD:
- Automated builds on commit
- Unit test execution
- Performance regression tests
- Multi-platform builds
```

## Security Considerations

### Current
- No sensitive data in client code
- Input validation on damage system
- Layer-based collision filtering

### Future (Milestone 4)
- Supabase RLS policies
- Server-side validation
- Encrypted save data
- Anti-cheat measures

---

**Last Updated:** Milestone 1  
**Next Review:** Milestone 2 completion
