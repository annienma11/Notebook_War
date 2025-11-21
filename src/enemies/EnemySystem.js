import * as THREE from 'three';

export class EnemySystem {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.enemyGroup = new THREE.Group();
        this.scene.add(this.enemyGroup);
    }

    spawnEnemy(position, type = 'grunt') {
        const enemy = this.createEnemy(type);
        enemy.mesh.position.copy(position);
        this.enemies.push(enemy);
        this.enemyGroup.add(enemy.mesh);
        return enemy;
    }

    createEnemy(type) {
        let geometry, material, stats;

        switch(type) {
            case 'grunt':
                geometry = new THREE.CapsuleGeometry(0.3, 1.5);
                material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
                stats = { health: 50, damage: 20, speed: 2, type: 'melee' };
                break;
            case 'shooter':
                geometry = new THREE.CapsuleGeometry(0.3, 1.5);
                material = new THREE.MeshLambertMaterial({ color: 0xaa0000 });
                stats = { health: 75, damage: 15, speed: 1.5, type: 'ranged', range: 20 };
                break;
            case 'elite':
                geometry = new THREE.CapsuleGeometry(0.35, 1.6);
                material = new THREE.MeshLambertMaterial({ color: 0x880000 });
                stats = { health: 100, damage: 30, speed: 2.5, type: 'flanker' };
                break;
        }

        const mesh = new THREE.Mesh(geometry, material);
        
        return {
            mesh: mesh,
            stats: stats,
            currentHealth: stats.health,
            state: 'patrol',
            target: null,
            lastAttackTime: 0,
            patrolPoints: [],
            currentPatrolIndex: 0,
            isDead: false
        };
    }

    update(playerPosition, deltaTime) {
        this.enemies.forEach(enemy => {
            if (enemy.isDead) return;

            this.updateEnemyAI(enemy, playerPosition, deltaTime);
        });
    }

    updateEnemyAI(enemy, playerPosition, deltaTime) {
        const distance = enemy.mesh.position.distanceTo(playerPosition);
        
        switch(enemy.state) {
            case 'patrol':
                if (distance < 10) {
                    enemy.state = 'engage';
                    enemy.target = playerPosition.clone();
                }
                this.patrol(enemy, deltaTime);
                break;
                
            case 'engage':
                if (distance > 15) {
                    enemy.state = 'patrol';
                } else {
                    this.engage(enemy, playerPosition, deltaTime);
                }
                break;
        }
    }

    patrol(enemy, deltaTime) {
        // Simple back and forth patrol
        if (enemy.patrolPoints.length === 0) {
            const start = enemy.mesh.position.clone();
            enemy.patrolPoints = [
                start,
                start.clone().add(new THREE.Vector3(5, 0, 0)),
                start.clone().add(new THREE.Vector3(-5, 0, 0))
            ];
        }

        const target = enemy.patrolPoints[enemy.currentPatrolIndex];
        const direction = target.clone().sub(enemy.mesh.position).normalize();
        
        enemy.mesh.position.add(direction.multiplyScalar(enemy.stats.speed * deltaTime));
        
        if (enemy.mesh.position.distanceTo(target) < 1) {
            enemy.currentPatrolIndex = (enemy.currentPatrolIndex + 1) % enemy.patrolPoints.length;
        }
    }

    engage(enemy, playerPosition, deltaTime) {
        const direction = playerPosition.clone().sub(enemy.mesh.position).normalize();
        
        if (enemy.stats.type === 'melee') {
            // Move towards player
            enemy.mesh.position.add(direction.multiplyScalar(enemy.stats.speed * deltaTime));
        } else if (enemy.stats.type === 'ranged') {
            // Maintain distance and shoot
            const distance = enemy.mesh.position.distanceTo(playerPosition);
            if (distance > enemy.stats.range * 0.8) {
                enemy.mesh.position.add(direction.multiplyScalar(enemy.stats.speed * deltaTime));
            }
        } else if (enemy.stats.type === 'flanker') {
            // Flank around player
            const flankDirection = new THREE.Vector3(-direction.z, 0, direction.x);
            enemy.mesh.position.add(flankDirection.multiplyScalar(enemy.stats.speed * deltaTime));
        }

        // Face player
        enemy.mesh.lookAt(playerPosition);
    }

    takeDamage(enemy, damage) {
        enemy.currentHealth -= damage;
        
        if (enemy.currentHealth <= 0) {
            enemy.isDead = true;
            enemy.mesh.material.color.setHex(0x444444);
            
            setTimeout(() => {
                this.removeEnemy(enemy);
            }, 2000);
        }
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            this.enemyGroup.remove(enemy.mesh);
        }
    }

    checkCollisions(rayOrigin, rayDirection, range, damage) {
        const raycaster = new THREE.Raycaster(rayOrigin, rayDirection, 0, range);
        
        this.enemies.forEach(enemy => {
            if (enemy.isDead) return;
            
            const intersects = raycaster.intersectObject(enemy.mesh);
            if (intersects.length > 0) {
                this.takeDamage(enemy, damage);
                
                // Create hit effect
                this.createHitEffect(intersects[0].point);
            }
        });
    }

    createHitEffect(position) {
        const effectGeometry = new THREE.SphereGeometry(0.1);
        const effectMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const effect = new THREE.Mesh(effectGeometry, effectMaterial);
        
        effect.position.copy(position);
        this.scene.add(effect);

        setTimeout(() => {
            this.scene.remove(effect);
        }, 200);
    }

    getAliveEnemies() {
        return this.enemies.filter(enemy => !enemy.isDead);
    }
}