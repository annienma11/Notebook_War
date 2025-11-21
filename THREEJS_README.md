# Blue vs Red: Notebook War 3D (Three.js Version)

## 🎮 Browser-Based 3D FPS Game

This is the **Three.js version** of Notebook War 3D, designed to run entirely in the browser without any installation!

## ✅ Why Three.js?

- ✅ **No Installation** - Runs in any modern browser
- ✅ **Perfect for Codespaces** - Develop and test instantly
- ✅ **Cross-Platform** - Works on PC, Mac, Linux, mobile
- ✅ **Easy Deployment** - Host on GitHub Pages, Netlify, Vercel
- ✅ **Instant Testing** - See changes immediately
- ✅ **Supabase Ready** - Easy backend integration

## 🚀 Quick Start

### In GitHub Codespaces (Current Setup):

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Then click "Open in Browser" when Codespaces shows the port forward notification!

### Local Development:

```bash
# Clone repository
git clone https://github.com/annienma11/Notebook_War.git
cd Notebook_War

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

## 🎮 Controls

| Action | Key |
|--------|-----|
| Move Forward | W |
| Move Backward | S |
| Move Left | A |
| Move Right | D |
| Jump | Space |
| Sprint | Shift |
| Crouch | Ctrl |
| Fire | Left Click |
| Aim | Right Click |
| Reload | R |
| Interact | E |

**Note:** Click on the game window to lock mouse cursor for FPS controls!

## 📁 Project Structure

```
notebook-war-threejs/
├── index.html              # Main HTML file
├── package.json            # Dependencies
├── src/
│   ├── main.js            # Game entry point
│   ├── core/
│   │   └── InputManager.js
│   ├── player/
│   │   └── PlayerController.js
│   ├── weapons/
│   │   └── WeaponBase.js
│   ├── utils/
│   │   └── ObjectPool.js
│   └── config/
│       ├── playerStats.json
│       └── weaponData.json
└── public/
    ├── models/
    ├── textures/
    └── audio/
```

## 🎯 Current Features (Milestone 1)

- ✅ First-person camera with mouse look
- ✅ WASD movement with physics
- ✅ Sprint and jump mechanics
- ✅ Pistol weapon with shooting
- ✅ Raycast-based hit detection
- ✅ Reload system
- ✅ HUD (health, armor, ammo)
- ✅ Crosshair
- ✅ Test level with walls and targets
- ✅ Physics simulation (Cannon.js)

## 🔧 Tech Stack

- **Three.js** - 3D rendering engine
- **Cannon-ES** - Physics engine
- **Vite** - Build tool and dev server
- **JavaScript (ES6+)** - Modern JavaScript

## 📝 Development Workflow

### 1. Code in Codespaces
```bash
# Edit files in src/
# Changes auto-reload in browser
npm run dev
```

### 2. Test Instantly
- Open forwarded port in browser
- Click to lock mouse
- Test gameplay immediately

### 3. Commit Changes
```bash
git add .
git commit -m "Add feature"
git push
```

### 4. Deploy (Optional)
```bash
# Build for production
npm run build

# Deploy to GitHub Pages, Netlify, or Vercel
```

## 🎨 Customization

### Modify Player Stats
Edit `src/config/playerStats.json`:
```json
{
  "maxHealth": 100,
  "walkSpeed": 5,
  "sprintSpeed": 8,
  ...
}
```

### Modify Weapon Data
Edit `src/config/weaponData.json`:
```json
{
  "pistol": {
    "damage": 15,
    "fireRate": 0.3,
    ...
  }
}
```

### Add New Weapons
1. Add weapon data to `weaponData.json`
2. Create weapon class extending `WeaponBase`
3. Instantiate in `main.js`

## 🚀 Next Steps (Milestone 2)

- [ ] Add all 6 weapons (SMG, Rifle, Shotgun, Sniper, Grenade)
- [ ] Implement enemy AI
- [ ] Create Stage 1: Apartment Complex
- [ ] Add weapon switching
- [ ] Implement pickup system
- [ ] Add sound effects
- [ ] Create particle effects

## 🐛 Troubleshooting

### Game won't start?
- Check browser console for errors
- Ensure `npm install` completed successfully
- Try `npm run dev` again

### Mouse not locking?
- Click on the game window
- Some browsers require user interaction first

### Performance issues?
- Close other browser tabs
- Reduce render distance in code
- Disable shadows if needed

## 📚 Resources

- **Three.js Docs:** https://threejs.org/docs/
- **Cannon-ES Docs:** https://pmndrs.github.io/cannon-es/
- **Vite Docs:** https://vitejs.dev/

## 🎉 Advantages Over Unity

1. **No Installation** - Start coding immediately
2. **Instant Testing** - See changes in real-time
3. **Easy Deployment** - One command to deploy
4. **Cross-Platform** - Works everywhere
5. **Lightweight** - No heavy editor needed
6. **Web-Native** - Perfect for browser games
7. **Free Hosting** - GitHub Pages, Netlify, Vercel

## 📊 Performance

- **Target:** 60 FPS on desktop, 30 FPS on mobile
- **Optimization:** Object pooling, LOD, frustum culling
- **Physics:** Cannon.js for realistic movement

---

**Ready to play? Run `npm run dev` and start shooting! 🎮**
