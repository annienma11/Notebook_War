import * as THREE from 'three';

export class BulletSystem {
    constructor(scene) {
        this.scene = scene;
        this.bullets = [];
    }

    createBullet(startPos, direction, speed = 100) {
        // Create small bullet sphere
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });
        const bullet = new THREE.Mesh(geometry, material);
        bullet.position.copy(startPos);
        
        // Create bullet trail
        const trailGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 4);
        const trailMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.6
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.rotation.x = Math.PI / 2;
        trail.position.z = -0.1;
        bullet.add(trail);
        
        this.scene.add(bullet);
        
        const bulletData = {
            mesh: bullet,
            velocity: direction.clone().normalize().multiplyScalar(speed),
            lifetime: 2.0,
            age: 0
        };
        
        this.bullets.push(bulletData);
        return bulletData;
    }

    update(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.age += deltaTime;
            
            // Move bullet
            bullet.mesh.position.add(
                bullet.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Point bullet in direction of travel
            bullet.mesh.lookAt(
                bullet.mesh.position.clone().add(bullet.velocity)
            );
            
            // Remove old bullets
            if (bullet.age > bullet.lifetime) {
                this.scene.remove(bullet.mesh);
                bullet.mesh.geometry.dispose();
                bullet.mesh.material.dispose();
                this.bullets.splice(i, 1);
            }
        }
    }

    removeBullet(bulletData) {
        const index = this.bullets.indexOf(bulletData);
        if (index > -1) {
            this.scene.remove(bulletData.mesh);
            bulletData.mesh.geometry.dispose();
            bulletData.mesh.material.dispose();
            this.bullets.splice(index, 1);
        }
    }
}
