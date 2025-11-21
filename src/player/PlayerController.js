import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class PlayerController {
    constructor(scene, world, inputManager, stats) {
        this.scene = scene;
        this.world = world;
        this.input = inputManager;
        this.stats = stats;

        this.health = stats.maxHealth;
        this.armor = 0;
        this.stamina = stats.maxStamina;

        this.setupCamera();
        this.setupPhysics();
        
        this.velocity = new THREE.Vector3();
        this.canJump = false;
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 0);
    }

    setupPhysics() {
        const shape = new CANNON.Sphere(0.5);
        this.body = new CANNON.Body({
            mass: 80,
            shape: shape,
            position: new CANNON.Vec3(0, 2, 0),
            linearDamping: 0.9
        });
        this.world.addBody(this.body);

        this.body.addEventListener('collide', (e) => {
            const contact = e.contact;
            if (contact.bi === this.body || contact.bj === this.body) {
                this.canJump = true;
            }
        });
    }

    update(deltaTime) {
        this.handleMovement(deltaTime);
        this.handleRotation(deltaTime);
        this.handleStamina(deltaTime);
        this.updateCameraPosition();
    }

    handleMovement(deltaTime) {
        const moveInput = this.input.getMovementInput();
        
        let speed = this.stats.walkSpeed;
        if (this.input.isSprinting() && this.stamina > 0) {
            speed = this.stats.sprintSpeed;
        } else if (this.input.isCrouching()) {
            speed = this.stats.crouchSpeed;
        }

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.camera.quaternion);
        right.y = 0;
        right.normalize();

        const moveDir = new THREE.Vector3();
        moveDir.addScaledVector(forward, -moveInput.z);
        moveDir.addScaledVector(right, moveInput.x);
        moveDir.normalize();

        this.body.velocity.x = moveDir.x * speed;
        this.body.velocity.z = moveDir.z * speed;

        if (this.input.isJumping() && this.canJump) {
            this.body.velocity.y = this.stats.jumpForce;
            this.canJump = false;
        }
    }

    handleRotation(deltaTime) {
        const lookInput = this.input.getLookInput();
        
        // Rotate body left/right
        this.body.quaternion.setFromEuler(new CANNON.Euler(0, this.camera.rotation.y - lookInput.x * this.stats.mouseSensitivity, 0));
        this.camera.rotation.y -= lookInput.x * this.stats.mouseSensitivity;
        
        // Rotate camera up/down
        this.camera.rotation.x -= lookInput.y * this.stats.mouseSensitivity;
        this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
    }

    handleStamina(deltaTime) {
        if (this.input.isSprinting() && this.canJump) {
            this.stamina -= this.stats.sprintStaminaCost * deltaTime;
        } else {
            this.stamina += this.stats.staminaRegenRate * deltaTime;
        }
        this.stamina = Math.max(0, Math.min(this.stats.maxStamina, this.stamina));
    }

    updateCameraPosition() {
        this.camera.position.copy(this.body.position);
        this.camera.position.y += 0.6;
    }

    takeDamage(damage) {
        if (this.armor > 0) {
            const armorDamage = Math.min(damage * 0.5, this.armor);
            this.armor -= armorDamage;
            damage -= armorDamage;
        }
        this.health -= damage;
        this.health = Math.max(0, this.health);
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log('Player died!');
    }

    getCamera() {
        return this.camera;
    }
}
