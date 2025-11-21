import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PlayerController } from './player/PlayerController.js';
import { InputManager } from './core/InputManager.js';
import { WeaponBase } from './weapons/WeaponBase.js';
import { MaterialLibrary } from './core/MaterialLibrary.js';
import { ParticleSystem } from './core/ParticleSystem.js';
import { SkyboxManager } from './core/SkyboxManager.js';
import { EnemyAI } from './enemies/EnemyAI.js';
import { HUD } from './ui/components/HUD.js';
import { BulletSystem } from './core/BulletSystem.js';
import playerStatsData from './config/playerStats.json';
import weaponDataConfig from './config/weaponData.json';

class Game {
    constructor() {
        this.clock = new THREE.Clock();
        this.init();
    }

    init() {
        this.kills = 0;
        this.deaths = 0;
        this.enemies = [];
        
        this.setupRenderer();
        this.setupScene();
        this.setupPhysics();
        this.setupInput();
        this.setupPlayer();
        this.setupWeapon();
        this.setupLevel();
        this.setupLights();
        this.setupHUD();
        this.spawnEnemies();
        
        this.hideLoading();
        this.start();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0xe8f4f8);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.player.camera.aspect = window.innerWidth / window.innerHeight;
            this.player.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xe8f4f8, 20, 150);
        
        // Initialize material library, particle system, skybox, and bullet system
        this.materials = new MaterialLibrary();
        this.particles = new ParticleSystem(this.scene);
        this.skybox = new SkyboxManager(this.scene);
        this.bulletSystem = new BulletSystem(this.scene);
    }

    setupPhysics() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
    }

    setupInput() {
        this.input = new InputManager();
        document.body.addEventListener('click', () => {
            this.input.requestPointerLock();
        });
    }

    setupPlayer() {
        this.player = new PlayerController(
            this.scene,
            this.world,
            this.input,
            playerStatsData
        );
    }

    setupWeapon() {
        this.weapon = new WeaponBase(
            this.scene,
            this.player.getCamera(),
            this.input,
            weaponDataConfig.pistol,
            this.particles,
            this.bulletSystem
        );
    }

    setupHUD() {
        this.hud = new HUD();
        this.hud.updateHealth(this.player.health, playerStatsData.maxHealth);
        this.hud.updateArmor(this.player.armor, playerStatsData.maxArmor);
        this.hud.updateAmmo(weaponDataConfig.pistol.magazineSize, 120);
        this.hud.updateWeapon(weaponDataConfig.pistol.name);
    }

    spawnEnemies() {
        const spawnPositions = [
            new THREE.Vector3(-5, 0, -15),
            new THREE.Vector3(5, 0, -15),
            new THREE.Vector3(0, 0, -20),
            new THREE.Vector3(-8, 0, -12),
            new THREE.Vector3(8, 0, -12)
        ];

        spawnPositions.forEach(pos => {
            const enemy = new EnemyAI(this.scene, this.world, pos, this.materials, this.particles);
            this.enemies.push(enemy);
        });
    }

    setupLevel() {
        // Ground with grid texture
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const ground = new THREE.Mesh(groundGeometry, this.materials.get('ground'));
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Ground physics
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(groundBody);

        // Colorful walls with different materials
        this.createWall(0, 2, -10, 20, 4, 0.5, 'wall');
        this.createWall(-10, 2, 0, 0.5, 4, 20, 'wall');
        this.createWall(10, 2, 0, 0.5, 4, 20, 'wall');
        
        // Decorative colored boxes (smaller)
        this.createBox(-5, 0.25, -5, 0.5, 0.5, 0.5, 'accent1');
        this.createBox(5, 0.25, -5, 0.5, 0.5, 0.5, 'accent2');
        this.createBox(0, 0.25, -3, 0.5, 0.5, 0.5, 'accent3');
        
        // Cover objects
        this.createCover(-3, 1, -6, 2, 2, 0.3);
        this.createCover(3, 1, -6, 2, 2, 0.3);

    }

    createWall(x, y, z, width, height, depth, materialName = 'wall') {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const wall = new THREE.Mesh(geometry, this.materials.get(materialName));
        wall.position.set(x, y, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.scene.add(wall);

        // Physics
        const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, y, z);
        this.world.addBody(body);
    }

    createBox(x, y, z, width, height, depth, materialName) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const box = new THREE.Mesh(geometry, this.materials.get(materialName));
        box.position.set(x, y, z);
        box.castShadow = true;
        box.receiveShadow = true;
        this.scene.add(box);

        // Physics
        const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, y, z);
        this.world.addBody(body);
    }

    createCover(x, y, z, width, height, depth) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const cover = new THREE.Mesh(geometry, this.materials.get('ink'));
        cover.position.set(x, y, z);
        cover.castShadow = true;
        cover.receiveShadow = true;
        this.scene.add(cover);

        // Physics
        const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, y, z);
        this.world.addBody(body);
    }



    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        directionalLight.position.set(20, 30, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);
        
        // Hemisphere light for better ambient
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0xe8f4f8, 0.4);
        this.scene.add(hemiLight);
        
        // Point lights for accent
        const pointLight1 = new THREE.PointLight(0xff6600, 0.5, 10);
        pointLight1.position.set(-5, 2, -5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x00ff88, 0.5, 10);
        pointLight2.position.set(5, 2, -5);
        this.scene.add(pointLight2);
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('crosshair').style.display = 'block';
    }

    start() {
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        const currentTime = this.clock.getElapsedTime();

        this.world.step(1/60, deltaTime, 3);
        
        this.player.update(deltaTime);
        this.weapon.update(deltaTime, currentTime);
        this.skybox.update(deltaTime);
        this.bulletSystem.update(deltaTime);
        
        // Update enemies
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.health > 0) {
                enemy.update(deltaTime, this.player.getCamera().position);
                return true;
            }
            return false;
        });
        
        this.updateHUD();
        
        this.renderer.render(this.scene, this.player.getCamera());
    }

    updateHUD() {
        this.hud.updateHealth(this.player.health, playerStatsData.maxHealth);
        this.hud.updateArmor(this.player.armor, playerStatsData.maxArmor);
        this.hud.updateAmmo(this.weapon.currentAmmo, 120);
    }
}

// Start the game
window.game = new Game();
