# Migration from Unity to Three.js

## Why Three.js?
- ✅ Runs entirely in browser
- ✅ Perfect for Codespaces development
- ✅ No installation needed
- ✅ Instant testing and deployment
- ✅ Cross-platform by default
- ✅ Easy to integrate with Supabase
- ✅ Can use GitHub Pages for hosting

## Architecture Mapping

### Unity → Three.js Equivalents

| Unity | Three.js |
|-------|----------|
| GameObject | THREE.Object3D / THREE.Mesh |
| Transform | position, rotation, scale |
| MonoBehaviour | ES6 Classes |
| Update() | requestAnimationFrame loop |
| ScriptableObject | JSON config files |
| Prefab | Object factories/classes |
| Scene | THREE.Scene |
| Camera | THREE.PerspectiveCamera |
| Rigidbody | Cannon.js / Ammo.js physics |
| CharacterController | Custom controller + physics |
| Raycast | THREE.Raycaster |

## Project Structure

```
notebook-war-threejs/
├── index.html
├── src/
│   ├── main.js
│   ├── core/
│   │   ├── Game.js
│   │   ├── SceneManager.js
│   │   └── InputManager.js
│   ├── player/
│   │   ├── PlayerController.js
│   │   └── PlayerStats.js
│   ├── weapons/
│   │   ├── WeaponBase.js
│   │   └── Pistol.js
│   ├── enemies/
│   │   └── EnemyBase.js
│   ├── utils/
│   │   ├── ObjectPool.js
│   │   └── UpdateManager.js
│   └── config/
│       ├── playerStats.json
│       └── weaponData.json
├── assets/
│   ├── models/
│   ├── textures/
│   └── audio/
└── package.json
```

## Next Steps

1. Initialize Three.js project
2. Port core systems
3. Create player controller
4. Implement weapons
5. Add enemies and AI
6. Build all 10 levels
