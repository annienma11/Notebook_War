export class GameHUD {
    constructor() {
        this.createHUD();
    }

    createHUD() {
        // Create HUD container
        this.hudContainer = document.createElement('div');
        this.hudContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            font-family: 'Courier New', monospace;
            color: white;
        `;
        document.body.appendChild(this.hudContainer);

        // Health bar
        this.healthBar = this.createBar('Health', 20, 20, 0x00ff00);
        
        // Armor bar
        this.armorBar = this.createBar('Armor', 20, 60, 0x0088ff);
        
        // Ammo display
        this.ammoDisplay = document.createElement('div');
        this.ammoDisplay.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 24px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        `;
        this.hudContainer.appendChild(this.ammoDisplay);

        // Weapon display
        this.weaponDisplay = document.createElement('div');
        this.weaponDisplay.style.cssText = `
            position: absolute;
            bottom: 60px;
            right: 20px;
            font-size: 18px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        `;
        this.hudContainer.appendChild(this.weaponDisplay);

        // Crosshair
        this.crosshair = document.createElement('div');
        this.crosshair.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid white;
            border-radius: 50%;
            pointer-events: none;
        `;
        this.hudContainer.appendChild(this.crosshair);

        // Objective display
        this.objectiveDisplay = document.createElement('div');
        this.objectiveDisplay.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        `;
        this.hudContainer.appendChild(this.objectiveDisplay);
    }

    createBar(label, x, y, color) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
        `;

        const labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = `
            font-size: 14px;
            margin-bottom: 5px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        `;

        const barBg = document.createElement('div');
        barBg.style.cssText = `
            width: 200px;
            height: 20px;
            background: rgba(0,0,0,0.5);
            border: 2px solid white;
        `;

        const barFill = document.createElement('div');
        barFill.style.cssText = `
            width: 100%;
            height: 100%;
            background: #${color.toString(16).padStart(6, '0')};
            transition: width 0.3s;
        `;

        barBg.appendChild(barFill);
        container.appendChild(labelEl);
        container.appendChild(barBg);
        this.hudContainer.appendChild(container);

        return { container, fill: barFill };
    }

    updateHealth(current, max) {
        const percentage = (current / max) * 100;
        this.healthBar.fill.style.width = `${percentage}%`;
    }

    updateArmor(current, max) {
        const percentage = (current / max) * 100;
        this.armorBar.fill.style.width = `${percentage}%`;
    }

    updateAmmo(current, max) {
        this.ammoDisplay.textContent = `${current}/${max}`;
    }

    updateWeapon(weaponName) {
        this.weaponDisplay.textContent = weaponName.toUpperCase();
    }

    updateObjective(text) {
        this.objectiveDisplay.textContent = text;
    }

    showDamage() {
        this.hudContainer.style.background = 'rgba(255, 0, 0, 0.3)';
        setTimeout(() => {
            this.hudContainer.style.background = 'transparent';
        }, 200);
    }
}