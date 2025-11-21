import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class EnemyAI {
    constructor(scene, world, position, materials, particleSystem) {
        this.scene = scene;
        this.world = world;
        this.materials = materials;
        this.particles = particleSystem;
        
        this.health = 100;
        this.maxHealth = 100;
        this.state = 'patrol'; // patrol, chase, attack, retreat
        this.speed = 3;
        this.detectionRange = 15;
        this.attackRange = 10;
        
        this.createModel(position);
        this.setupPhysics(position);
        this.patrolPoints = this.generatePatrolPoints(position);
        this.currentPatrolIndex = 0;
    }

    createModel(position) {
        this.group = new THREE.Group();
        
        // Body (brighter red)
        const bodyGeometry = new THREE.BoxGeometry(0.6, 1.4, 0.4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff3333,
            roughness: 0.7,
            metalness: 0.3,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.7;
        body.castShadow = true;
        this.group.add(body);
        
        // Head (brighter)
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.6;
        head.castShadow = true;
        this.group.add(head);
        
        // Arms (brighter)
        const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15);
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(-0.4, 0.7, 0);
        leftArm.castShadow = true;
        this.group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(0.4, 0.7, 0);
        rightArm.castShadow = true;
        this.group.add(rightArm);
        
        // Legs (brighter)
        const legGeometry = new THREE.BoxGeometry(0.2, 0.7, 0.2);
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(-0.15, 0, 0);
        leftLeg.castShadow = true;
        this.group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(0.15, 0, 0);
        rightLeg.castShadow = true;
        this.group.add(rightLeg);
        
        // Weapon (simple rifle - more visible)
        const weaponGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.6);
        const weaponMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.3
        });
        const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weapon.position.set(0.3, 0.8, -0.3);
        weapon.rotation.y = -Math.PI / 4;
        this.group.add(weapon);
        
        // Outline (thicker and more visible)
        const edges = new THREE.EdgesGeometry(bodyGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x000000,
            linewidth: 3
        });
        const line = new THREE.LineSegments(edges, lineMaterial);
        body.add(line);
        
        // Add glow effect (brighter)
        const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.4
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 1.6;
        this.group.add(glow);
        
        // Add name tag above head
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 128, 32);
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ENEMY', 64, 22);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = 2.5;
        sprite.scale.set(1, 0.25, 1);
        this.group.add(sprite);
        
        this.group.position.copy(position);
        this.group.userData.enemy = this;
        this.scene.add(this.group);
        
        console.log('Enemy model created at:', position);
        
        // Health bar
        this.createHealthBar();
    }

    createHealthBar() {
        const barWidth = 0.8;
        const barHeight = 0.1;
        
        // Background
        const bgGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
        const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.healthBarBg = new THREE.Mesh(bgGeometry, bgMaterial);
        this.healthBarBg.position.set(0, 2.2, 0);
        this.group.add(this.healthBarBg);
        
        // Health fill
        const fillGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
        const fillMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.healthBarFill = new THREE.Mesh(fillGeometry, fillMaterial);
        this.healthBarFill.position.set(0, 2.2, 0.01);
        this.group.add(this.healthBarFill);
    }

    setupPhysics(position) {
        const shape = new CANNON.Box(new CANNON.Vec3(0.3, 0.9, 0.2));
        this.body = new CANNON.Body({
            mass: 70,
            shape: shape,
            position: new CANNON.Vec3(position.x, position.y + 0.9, position.z),
            linearDamping: 0.9,
            fixedRotation: true
        });
        this.world.addBody(this.body);
    }

    generatePatrolPoints(center) {
        const points = [];
        const radius = 5;
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 * i) / 4;
            points.push(new THREE.Vector3(
                center.x + Math.cos(angle) * radius,
                center.y,
                center.z + Math.sin(angle) * radius
            ));
        }
        return points;
    }

    update(deltaTime, playerPosition) {
        if (!this.body || !this.group) return;
        
        const distanceToPlayer = this.group.position.distanceTo(playerPosition);
        
        // State machine
        if (distanceToPlayer < this.attackRange) {
            this.state = 'attack';
        } else if (distanceToPlayer < this.detectionRange) {
            this.state = 'chase';
        } else if (this.health < this.maxHealth * 0.3) {
            this.state = 'retreat';
        } else {
            this.state = 'patrol';
        }
        
        // Execute state behavior
        switch(this.state) {
            case 'patrol':
                this.patrol(deltaTime);
                break;
            case 'chase':
                this.chase(playerPosition, deltaTime);
                break;
            case 'attack':
                this.attack(playerPosition, deltaTime);
                break;
            case 'retreat':
                this.retreat(playerPosition, deltaTime);
                break;
        }
        
        // Update position from physics
        this.group.position.set(
            this.body.position.x,
            this.body.position.y - 0.9,
            this.body.position.z
        );
        
        // Make health bar face camera
        if (this.healthBarBg) {
            this.healthBarBg.lookAt(playerPosition);
            this.healthBarFill.lookAt(playerPosition);
        }
    }

    patrol(deltaTime) {
        const target = this.patrolPoints[this.currentPatrolIndex];
        const direction = new THREE.Vector3().subVectors(target, this.group.position);
        direction.y = 0;
        
        if (direction.length() < 0.5) {
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        } else {
            direction.normalize();
            this.body.velocity.x = direction.x * this.speed * 0.5;
            this.body.velocity.z = direction.z * this.speed * 0.5;
            
            // Rotate to face direction
            const angle = Math.atan2(direction.x, direction.z);
            this.group.rotation.y = angle;
        }
    }

    chase(playerPosition, deltaTime) {
        const direction = new THREE.Vector3().subVectors(playerPosition, this.group.position);
        direction.y = 0;
        direction.normalize();
        
        this.body.velocity.x = direction.x * this.speed;
        this.body.velocity.z = direction.z * this.speed;
        
        const angle = Math.atan2(direction.x, direction.z);
        this.group.rotation.y = angle;
    }

    attack(playerPosition, deltaTime) {
        // Stop moving and face player
        this.body.velocity.x = 0;
        this.body.velocity.z = 0;
        
        const direction = new THREE.Vector3().subVectors(playerPosition, this.group.position);
        direction.y = 0;
        const angle = Math.atan2(direction.x, direction.z);
        this.group.rotation.y = angle;
        
        // Shoot at player (simplified)
        if (Math.random() < 0.02) { // 2% chance per frame
            this.shoot(playerPosition);
        }
    }

    retreat(playerPosition, deltaTime) {
        const direction = new THREE.Vector3().subVectors(this.group.position, playerPosition);
        direction.y = 0;
        direction.normalize();
        
        this.body.velocity.x = direction.x * this.speed * 0.7;
        this.body.velocity.z = direction.z * this.speed * 0.7;
        
        const angle = Math.atan2(direction.x, direction.z);
        this.group.rotation.y = angle;
    }

    shoot(target) {
        const muzzlePos = this.group.position.clone();
        muzzlePos.y += 1.2;
        
        this.particles.createMuzzleFlash(muzzlePos, new THREE.Vector3(0, 0, -1));
        console.log('Enemy fired!');
    }

    takeDamage(damage, hitPoint) {
        this.health -= damage;
        
        if (hitPoint) {
            this.particles.createBloodEffect(hitPoint);
        }
        
        // Update health bar
        const healthPercent = this.health / this.maxHealth;
        this.healthBarFill.scale.x = healthPercent;
        this.healthBarFill.position.x = -(0.8 * (1 - healthPercent)) / 2;
        
        // Flash effect
        this.group.children.forEach(child => {
            if (child.material && child.material.color) {
                const originalColor = child.material.color.clone();
                child.material.color.set(0xff6666);
                setTimeout(() => {
                    child.material.color.copy(originalColor);
                }, 100);
            }
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.scene.remove(this.group);
        this.world.removeBody(this.body);
        
        // Notify game of kill
        if (window.game && window.game.hud) {
            window.game.kills++;
            window.game.hud.updateKills(window.game.kills);
            window.game.hud.addKillFeed('You eliminated an enemy');
        }
        
        console.log('Enemy killed!');
    }
}
