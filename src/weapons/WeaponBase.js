import * as THREE from 'three';
import { WeaponModel } from './WeaponModel.js';

export class WeaponBase {
    constructor(scene, camera, inputManager, weaponData, particleSystem) {
        this.scene = scene;
        this.camera = camera;
        this.input = inputManager;
        this.data = weaponData;
        this.particles = particleSystem;

        this.currentAmmo = weaponData.magazineSize;
        this.nextFireTime = 0;
        this.isReloading = false;

        this.raycaster = new THREE.Raycaster();
        
        // Create 3D weapon model
        this.weaponModel = new WeaponModel(scene, camera, 'pistol');
    }

    update(deltaTime, currentTime) {
        if (this.isReloading) return;

        if (this.input.isReloading() && this.currentAmmo < this.data.magazineSize) {
            this.startReload();
            return;
        }

        if (this.canFire(currentTime)) {
            if (this.data.isAutomatic && this.input.isFiring()) {
                this.fire(currentTime);
            } else if (!this.data.isAutomatic && this.input.isFiring()) {
                this.fire(currentTime);
            }
        }
    }

    canFire(currentTime) {
        return this.currentAmmo > 0 && currentTime >= this.nextFireTime && !this.isReloading;
    }

    fire(currentTime) {
        this.currentAmmo--;
        this.nextFireTime = currentTime + this.data.fireRate;

        // Play weapon animation
        this.weaponModel.playFireAnimation();

        // Create muzzle flash particle
        const muzzlePos = this.camera.position.clone();
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        muzzlePos.add(forward.multiplyScalar(0.5));
        this.particles.createMuzzleFlash(muzzlePos, forward);

        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const hit = intersects[0];
            
            // Create bullet trail
            this.particles.createBulletTrail(muzzlePos, hit.point);
            
            this.onHit(hit);
        }

        this.updateHUD();
        console.log(`${this.data.name} fired! Ammo: ${this.currentAmmo}/${this.data.magazineSize}`);
    }

    onHit(hit) {
        // Create impact particles
        this.particles.createImpactEffect(hit.point, hit.normal);
        
        // Check if hit an enemy
        let hitEnemy = false;
        if (hit.object.parent && hit.object.parent.userData && hit.object.parent.userData.enemy) {
            hit.object.parent.userData.enemy.takeDamage(this.data.damage, hit.point);
            hitEnemy = true;
        }
        
        // Show hitmarker if hit enemy
        if (hitEnemy && window.game && window.game.hud) {
            window.game.hud.showHitmarker();
        }
        
        // Create impact decal
        const impactGeometry = new THREE.CircleGeometry(0.08, 8);
        const impactMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.6
        });
        const impact = new THREE.Mesh(impactGeometry, impactMaterial);
        impact.position.copy(hit.point);
        impact.position.add(hit.normal.multiplyScalar(0.01));
        impact.lookAt(hit.point.clone().add(hit.normal));
        this.scene.add(impact);
        
        setTimeout(() => {
            this.scene.remove(impact);
            impactGeometry.dispose();
            impactMaterial.dispose();
        }, 1000);
    }

    startReload() {
        this.isReloading = true;
        this.weaponModel.playReloadAnimation();
        console.log(`Reloading ${this.data.name}...`);
        setTimeout(() => this.finishReload(), this.data.reloadTime * 1000);
    }

    finishReload() {
        this.currentAmmo = this.data.magazineSize;
        this.isReloading = false;
        this.updateHUD();
        console.log(`${this.data.name} reloaded!`);
    }

    updateHUD() {
        document.getElementById('ammo').textContent = this.currentAmmo;
        document.getElementById('ammo-max').textContent = this.data.magazineSize;
        document.getElementById('weapon').textContent = this.data.name;
    }
}
