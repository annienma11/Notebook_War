import * as THREE from 'three';
import { PlayerController } from '../player/PlayerController.js';
import { WeaponSystem } from '../weapons/WeaponSystem.js';
import { EnemySystem } from '../enemies/EnemySystem.js';
import { GameHUD } from '../ui/GameHUD.js';

export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Create level
        this.createLevel();

        // Initialize systems
        this.player = new PlayerController(this.camera);
        this.weaponSystem = new WeaponSystem(this.scene, this.camera);
        this.enemySystem = new EnemySystem(this.scene);
        this.hud = new GameHUD();

        // Player stats
        this.playerHealth = 100;
        this.playerMaxHealth = 100;
        this.playerArmor = 50;
        this.playerMaxArmor = 100;

        // Spawn enemies
        this.spawnEnemies();

        // Setup controls
        this.setupControls();

        // Start game loop
        this.animate();

        // Update HUD
        this.updateHUD();
    }

    createLevel() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Walls for apartment building
        this.createWalls();
        
        // Cover objects
        this.createCover();
    }

    createWalls() {
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        // Create simple apartment structure
        for (let floor = 0; floor < 3; floor++) {
            const y = floor * 4;
            
            // Floor
            const floorGeometry = new THREE.BoxGeometry(20, 0.2, 15);
            const floorMesh = new THREE.Mesh(floorGeometry, wallMaterial);
            floorMesh.position.set(0, y, 0);
            this.scene.add(floorMesh);

            // Walls
            const wallGeometry = new THREE.BoxGeometry(0.5, 3, 15);
            
            const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
            leftWall.position.set(-10, y + 1.5, 0);
            this.scene.add(leftWall);

            const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
            rightWall.position.set(10, y + 1.5, 0);
            this.scene.add(rightWall);
        }
    }

    createCover() {
        const coverMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        
        for (let i = 0; i < 5; i++) {
            const coverGeometry = new THREE.BoxGeometry(2, 1.5, 0.5);
            const cover = new THREE.Mesh(coverGeometry, coverMaterial);
            cover.position.set(
                (Math.random() - 0.5) * 30,
                0.75,
                (Math.random() - 0.5) * 30
            );
            cover.castShadow = true;
            this.scene.add(cover);
        }
    }

    spawnEnemies() {
        // Spawn different enemy types
        this.enemySystem.spawnEnemy(new THREE.Vector3(5, 0, 5), 'grunt');
        this.enemySystem.spawnEnemy(new THREE.Vector3(-5, 0, -5), 'shooter');
        this.enemySystem.spawnEnemy(new THREE.Vector3(8, 0, -3), 'elite');
        this.enemySystem.spawnEnemy(new THREE.Vector3(-8, 4, 2), 'grunt');
        this.enemySystem.spawnEnemy(new THREE.Vector3(3, 8, -2), 'shooter');
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'Digit1':
                    this.weaponSystem.switchToWeapon('pistol');
                    break;
                case 'Digit2':
                    this.weaponSystem.switchToWeapon('smg');
                    break;
                case 'Digit3':
                    this.weaponSystem.switchToWeapon('rifle');
                    break;
                case 'KeyR':
                    this.weaponSystem.reload();
                    break;
            }
        });

        document.addEventListener('click', () => {
            const shot = this.weaponSystem.fire();
            if (shot) {
                this.enemySystem.checkCollisions(shot.origin, shot.direction, shot.range, shot.damage);
            }
        });

        // Pointer lock
        document.addEventListener('click', () => {
            document.body.requestPointerLock();
        });
    }

    updateHUD() {
        this.hud.updateHealth(this.playerHealth, this.playerMaxHealth);
        this.hud.updateArmor(this.playerArmor, this.playerMaxArmor);
        this.hud.updateAmmo(this.weaponSystem.getCurrentAmmo(), this.weaponSystem.getMaxAmmo());
        this.hud.updateWeapon(this.weaponSystem.currentWeapon ? Object.keys(this.weaponSystem.weapons).find(key => this.weaponSystem.weapons[key] === this.weaponSystem.currentWeapon) : 'none');
        
        const aliveEnemies = this.enemySystem.getAliveEnemies().length;
        this.hud.updateObjective(`Eliminate all enemies (${aliveEnemies} remaining)`);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = 0.016; // ~60fps

        // Update systems
        this.player.update(deltaTime);
        this.enemySystem.update(this.camera.position, deltaTime);

        // Update HUD
        this.updateHUD();

        // Check win condition
        if (this.enemySystem.getAliveEnemies().length === 0) {
            this.hud.updateObjective('LEVEL COMPLETE!');
        }

        this.renderer.render(this.scene, this.camera);
    }
}