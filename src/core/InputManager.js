export class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, buttons: {} };
        this.locked = false;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        document.addEventListener('mousedown', (e) => {
            this.mouse.buttons[e.button] = true;
        });

        document.addEventListener('mouseup', (e) => {
            this.mouse.buttons[e.button] = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (this.locked) {
                this.mouse.x = e.movementX;
                this.mouse.y = e.movementY;
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.locked = document.pointerLockElement !== null;
        });
    }

    requestPointerLock() {
        document.body.requestPointerLock();
    }

    getMovementInput() {
        const x = (this.keys['KeyD'] ? 1 : 0) - (this.keys['KeyA'] ? 1 : 0);
        const z = (this.keys['KeyS'] ? 1 : 0) - (this.keys['KeyW'] ? 1 : 0);
        return { x, z };
    }

    getLookInput() {
        const input = { x: this.mouse.x, y: this.mouse.y };
        this.mouse.x = 0;
        this.mouse.y = 0;
        return input;
    }

    isJumping() { return this.keys['Space']; }
    isSprinting() { return this.keys['ShiftLeft']; }
    isCrouching() { return this.keys['ControlLeft']; }
    isFiring() { return this.mouse.buttons[0]; }
    isAiming() { return this.mouse.buttons[2]; }
    isReloading() { return this.keys['KeyR']; }
    isInteracting() { return this.keys['KeyE']; }

    getWeaponSwitch() {
        for (let i = 1; i <= 6; i++) {
            if (this.keys[`Digit${i}`]) return i;
        }
        return 0;
    }
}
