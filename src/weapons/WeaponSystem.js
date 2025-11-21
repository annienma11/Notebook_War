import * as THREE from 'three';

export class WeaponSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.weapons = {};
        this.currentWeapon = null;
        this.weaponGroup = new THREE.Group();
        this.scene.add(this.weaponGroup);
        
        this.initializeWeapons();
    }

    initializeWeapons() {
        // Pistol
        this.weapons.pistol = this.createWeapon('pistol', {
            damage: 25,
            fireRate: 300,
            range: 50,
            magazineSize: 12,
            color: 0x444444
        });

        // SMG
        this.weapons.smg = this.createWeapon('smg', {
            damage: 15,
            fireRate: 75,
            range: 30,
            magazineSize: 30,
            color: 0x666666
        });

        // Rifle
        this.weapons.rifle = this.createWeapon('rifle', {
            damage: 30,
            fireRate: 150,
            range: 80,
            magazineSize: 25,
            color: 0x333333
        });

        this.switchToWeapon('pistol');
    }

    createWeapon(name, stats) {
        const weaponGeometry = new THREE.BoxGeometry(0.3, 0.1, 1);
        const weaponMaterial = new THREE.MeshLambertMaterial({ color: stats.color });
        const weaponMesh = new THREE.Mesh(weaponGeometry, weaponMaterial);
        
        weaponMesh.position.set(0.3, -0.2, -0.5);
        weaponMesh.visible = false;
        this.weaponGroup.add(weaponMesh);

        return {
            mesh: weaponMesh,
            stats: stats,
            currentAmmo: stats.magazineSize,
            lastFireTime: 0,
            isReloading: false
        };
    }

    switchToWeapon(weaponName) {
        if (this.currentWeapon) {
            this.currentWeapon.mesh.visible = false;
        }
        
        if (this.weapons[weaponName]) {
            this.currentWeapon = this.weapons[weaponName];
            this.currentWeapon.mesh.visible = true;
        }
    }

    fire() {
        if (!this.currentWeapon || this.currentWeapon.isReloading) return false;
        
        const now = Date.now();
        if (now - this.currentWeapon.lastFireTime < this.currentWeapon.stats.fireRate) return false;
        if (this.currentWeapon.currentAmmo <= 0) return false;

        this.currentWeapon.lastFireTime = now;
        this.currentWeapon.currentAmmo--;

        // Create muzzle flash
        this.createMuzzleFlash();
        
        // Raycast for hit detection
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        
        return {
            origin: this.camera.position.clone(),
            direction: raycaster.ray.direction.clone(),
            damage: this.currentWeapon.stats.damage,
            range: this.currentWeapon.stats.range
        };
    }

    createMuzzleFlash() {
        const flashGeometry = new THREE.SphereGeometry(0.05);
        const flashMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        
        flash.position.copy(this.currentWeapon.mesh.position);
        flash.position.z -= 0.5;
        this.weaponGroup.add(flash);

        setTimeout(() => {
            this.weaponGroup.remove(flash);
        }, 50);
    }

    reload() {
        if (!this.currentWeapon || this.currentWeapon.isReloading) return;
        
        this.currentWeapon.isReloading = true;
        setTimeout(() => {
            this.currentWeapon.currentAmmo = this.currentWeapon.stats.magazineSize;
            this.currentWeapon.isReloading = false;
        }, 1500);
    }

    getCurrentAmmo() {
        return this.currentWeapon ? this.currentWeapon.currentAmmo : 0;
    }

    getMaxAmmo() {
        return this.currentWeapon ? this.currentWeapon.stats.magazineSize : 0;
    }

    isReloading() {
        return this.currentWeapon ? this.currentWeapon.isReloading : false;
    }
}