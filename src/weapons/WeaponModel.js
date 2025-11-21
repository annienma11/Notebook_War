import * as THREE from 'three';

export class WeaponModel {
    constructor(scene, camera, weaponType = 'pistol') {
        this.scene = scene;
        this.camera = camera;
        this.weaponType = weaponType;
        
        this.createWeaponModel();
    }

    createWeaponModel() {
        this.weaponGroup = new THREE.Group();
        
        switch(this.weaponType) {
            case 'pistol':
                this.createPistol();
                break;
            case 'smg':
                this.createSMG();
                break;
            default:
                this.createPistol();
        }
        
        // Position weapon in front of camera
        this.weaponGroup.position.set(0.15, -0.15, -0.4);
        this.camera.add(this.weaponGroup);
    }

    createPistol() {
        // Pistol body
        const bodyGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.25);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0, 0);
        this.weaponGroup.add(body);

        // Barrel
        const barrelGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
        const barrelMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.2,
            metalness: 0.9
        });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0, 0.04, -0.2);
        this.weaponGroup.add(barrel);

        // Grip
        const gripGeometry = new THREE.BoxGeometry(0.06, 0.15, 0.08);
        const gripMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.8,
            metalness: 0.2
        });
        const grip = new THREE.Mesh(gripGeometry, gripMaterial);
        grip.position.set(0, -0.1, 0.05);
        this.weaponGroup.add(grip);

        // Slide (top part)
        const slideGeometry = new THREE.BoxGeometry(0.07, 0.04, 0.22);
        const slideMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a3a3a,
            roughness: 0.4,
            metalness: 0.7
        });
        const slide = new THREE.Mesh(slideGeometry, slideMaterial);
        slide.position.set(0, 0.08, -0.02);
        this.weaponGroup.add(slide);

        // Sight
        const sightGeometry = new THREE.BoxGeometry(0.01, 0.02, 0.01);
        const sightMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        const sight = new THREE.Mesh(sightGeometry, sightMaterial);
        sight.position.set(0, 0.11, -0.08);
        this.weaponGroup.add(sight);

        // Add outline edges
        const edges = new THREE.EdgesGeometry(bodyGeometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
        );
        body.add(line);
    }

    createSMG() {
        // SMG body (longer and bulkier)
        const bodyGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.4,
            metalness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.weaponGroup.add(body);

        // Barrel
        const barrelGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
        const barrelMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.2,
            metalness: 0.9
        });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0, 0.05, -0.3);
        this.weaponGroup.add(barrel);

        // Magazine
        const magGeometry = new THREE.BoxGeometry(0.06, 0.2, 0.08);
        const magMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.6,
            metalness: 0.5
        });
        const magazine = new THREE.Mesh(magGeometry, magMaterial);
        magazine.position.set(0, -0.15, 0);
        this.weaponGroup.add(magazine);

        // Stock
        const stockGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.15);
        const stockMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a3a3a,
            roughness: 0.7,
            metalness: 0.3
        });
        const stock = new THREE.Mesh(stockGeometry, stockMaterial);
        stock.position.set(0, 0, 0.25);
        this.weaponGroup.add(stock);
    }

    playFireAnimation() {
        // Recoil animation
        const originalZ = this.weaponGroup.position.z;
        this.weaponGroup.position.z += 0.05;
        
        setTimeout(() => {
            this.weaponGroup.position.z = originalZ;
        }, 50);

        // Muzzle flash
        this.createMuzzleFlash();
    }

    createMuzzleFlash() {
        // Small flash at barrel
        const flashGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 1
        });
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        flash.position.set(0, 0.04, -0.35);
        this.weaponGroup.add(flash);

        // Animate and remove quickly
        let opacity = 1;
        const animate = () => {
            opacity -= 0.2;
            flashMaterial.opacity = opacity;

            if (opacity <= 0) {
                this.weaponGroup.remove(flash);
                flashGeometry.dispose();
                flashMaterial.dispose();
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    playReloadAnimation() {
        // Simple reload animation - weapon dips down
        const originalY = this.weaponGroup.position.y;
        
        // Down
        const downInterval = setInterval(() => {
            this.weaponGroup.position.y -= 0.02;
            if (this.weaponGroup.position.y <= originalY - 0.2) {
                clearInterval(downInterval);
                
                // Up
                const upInterval = setInterval(() => {
                    this.weaponGroup.position.y += 0.02;
                    if (this.weaponGroup.position.y >= originalY) {
                        this.weaponGroup.position.y = originalY;
                        clearInterval(upInterval);
                    }
                }, 16);
            }
        }, 16);
    }

    remove() {
        this.camera.remove(this.weaponGroup);
    }
}
