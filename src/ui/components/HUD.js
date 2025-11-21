export class HUD {
    constructor() {
        this.createCODStyleHUD();
    }

    createCODStyleHUD() {
        // Remove old HUD
        const oldHud = document.getElementById('hud');
        if (oldHud) oldHud.remove();

        // Create new COD-style HUD
        const hudHTML = `
            <div id="cod-hud">
                <!-- Top left - Mini map placeholder -->
                <div class="minimap">
                    <div class="minimap-border"></div>
                    <div class="minimap-content">MAP</div>
                </div>

                <!-- Top center - Objective -->
                <div class="objective">
                    <div class="objective-title">OBJECTIVE</div>
                    <div class="objective-text">Eliminate All Enemies</div>
                </div>

                <!-- Top right - Score/Kills -->
                <div class="score-panel">
                    <div class="kills">
                        <span class="label">KILLS</span>
                        <span class="value" id="kills">0</span>
                    </div>
                    <div class="deaths">
                        <span class="label">DEATHS</span>
                        <span class="value" id="deaths">0</span>
                    </div>
                </div>

                <!-- Bottom left - Health and Armor -->
                <div class="health-panel">
                    <div class="health-bar-container">
                        <div class="health-bar" id="health-bar"></div>
                        <div class="health-text">
                            <span id="health-value">100</span>
                            <span class="health-icon">❤</span>
                        </div>
                    </div>
                    <div class="armor-bar-container">
                        <div class="armor-bar" id="armor-bar"></div>
                        <div class="armor-text">
                            <span id="armor-value">0</span>
                            <span class="armor-icon">🛡</span>
                        </div>
                    </div>
                </div>

                <!-- Bottom center - Ammo counter -->
                <div class="ammo-panel">
                    <div class="ammo-current" id="ammo-current">12</div>
                    <div class="ammo-divider">/</div>
                    <div class="ammo-reserve" id="ammo-reserve">120</div>
                    <div class="weapon-name" id="weapon-name">PISTOL</div>
                </div>

                <!-- Bottom right - Weapon slots -->
                <div class="weapon-slots">
                    <div class="weapon-slot active" data-slot="1">
                        <span class="slot-number">1</span>
                        <span class="slot-name">PISTOL</span>
                    </div>
                    <div class="weapon-slot" data-slot="2">
                        <span class="slot-number">2</span>
                        <span class="slot-name">SMG</span>
                    </div>
                    <div class="weapon-slot" data-slot="3">
                        <span class="slot-number">3</span>
                        <span class="slot-name">RIFLE</span>
                    </div>
                </div>

                <!-- Center - Hit marker -->
                <div class="hitmarker" id="hitmarker"></div>

                <!-- Damage indicator -->
                <div class="damage-indicator" id="damage-indicator"></div>

                <!-- Kill feed -->
                <div class="killfeed" id="killfeed"></div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', hudHTML);
        this.addCODStyles();
    }

    addCODStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #cod-hud {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                font-family: 'Rajdhani', 'Roboto Condensed', sans-serif;
                color: #fff;
                z-index: 1000;
            }

            /* Minimap */
            .minimap {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 150px;
                height: 150px;
                background: rgba(0, 0, 0, 0.7);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 5px;
            }
            .minimap-content {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                font-size: 24px;
                font-weight: bold;
                color: rgba(255, 255, 255, 0.5);
            }

            /* Objective */
            .objective {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 30px;
                border-radius: 5px;
                border: 2px solid rgba(255, 200, 0, 0.5);
            }
            .objective-title {
                font-size: 12px;
                color: #ffc800;
                font-weight: bold;
                letter-spacing: 2px;
            }
            .objective-text {
                font-size: 16px;
                margin-top: 5px;
            }

            /* Score Panel */
            .score-panel {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.7);
                padding: 15px 20px;
                border-radius: 5px;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            .kills, .deaths {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
            }
            .kills .label, .deaths .label {
                font-size: 12px;
                color: #aaa;
                margin-right: 15px;
            }
            .kills .value {
                font-size: 20px;
                font-weight: bold;
                color: #00ff00;
            }
            .deaths .value {
                font-size: 20px;
                font-weight: bold;
                color: #ff0000;
            }

            /* Health Panel */
            .health-panel {
                position: absolute;
                bottom: 30px;
                left: 30px;
                width: 250px;
            }
            .health-bar-container, .armor-bar-container {
                position: relative;
                height: 30px;
                background: rgba(0, 0, 0, 0.7);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 5px;
                margin: 10px 0;
                overflow: hidden;
            }
            .health-bar {
                height: 100%;
                width: 100%;
                background: linear-gradient(90deg, #ff0000, #ff6666);
                transition: width 0.3s ease;
            }
            .armor-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #0066ff, #66aaff);
                transition: width 0.3s ease;
            }
            .health-text, .armor-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 18px;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                gap: 5px;
            }

            /* Ammo Panel */
            .ammo-panel {
                position: absolute;
                bottom: 30px;
                right: 30px;
                text-align: right;
                background: rgba(0, 0, 0, 0.7);
                padding: 15px 25px;
                border-radius: 5px;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            .ammo-current {
                display: inline-block;
                font-size: 48px;
                font-weight: bold;
                color: #fff;
            }
            .ammo-divider {
                display: inline-block;
                font-size: 32px;
                color: #888;
                margin: 0 5px;
            }
            .ammo-reserve {
                display: inline-block;
                font-size: 24px;
                color: #aaa;
            }
            .weapon-name {
                font-size: 14px;
                color: #ffc800;
                margin-top: 5px;
                letter-spacing: 2px;
                font-weight: bold;
            }

            /* Weapon Slots */
            .weapon-slots {
                position: absolute;
                bottom: 120px;
                right: 30px;
            }
            .weapon-slot {
                background: rgba(0, 0, 0, 0.5);
                padding: 8px 15px;
                margin: 5px 0;
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.2s;
            }
            .weapon-slot.active {
                background: rgba(255, 200, 0, 0.3);
                border-color: #ffc800;
            }
            .slot-number {
                font-size: 16px;
                font-weight: bold;
                color: #ffc800;
            }
            .slot-name {
                font-size: 12px;
                color: #fff;
            }

            /* Hitmarker */
            .hitmarker {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                opacity: 0;
                transition: opacity 0.1s;
            }
            .hitmarker.show {
                opacity: 1;
            }
            .hitmarker::before,
            .hitmarker::after {
                content: '';
                position: absolute;
                background: #fff;
            }
            .hitmarker::before {
                width: 20px;
                height: 2px;
                top: 19px;
                left: 0;
                transform: rotate(45deg);
            }
            .hitmarker::after {
                width: 20px;
                height: 2px;
                top: 19px;
                right: 0;
                transform: rotate(-45deg);
            }

            /* Damage Indicator */
            .damage-indicator {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                opacity: 0;
                background: radial-gradient(circle, transparent 30%, rgba(255, 0, 0, 0.3) 100%);
                transition: opacity 0.3s;
            }
            .damage-indicator.show {
                opacity: 1;
            }

            /* Killfeed */
            .killfeed {
                position: absolute;
                top: 200px;
                right: 20px;
                width: 300px;
            }
            .kill-message {
                background: rgba(0, 0, 0, 0.7);
                padding: 8px 12px;
                margin: 5px 0;
                border-left: 3px solid #00ff00;
                border-radius: 3px;
                font-size: 14px;
                animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    updateHealth(current, max) {
        const percent = (current / max) * 100;
        document.getElementById('health-bar').style.width = percent + '%';
        document.getElementById('health-value').textContent = Math.round(current);
    }

    updateArmor(current, max) {
        const percent = (current / max) * 100;
        document.getElementById('armor-bar').style.width = percent + '%';
        document.getElementById('armor-value').textContent = Math.round(current);
    }

    updateAmmo(current, reserve) {
        document.getElementById('ammo-current').textContent = current;
        document.getElementById('ammo-reserve').textContent = reserve;
    }

    updateWeapon(name) {
        document.getElementById('weapon-name').textContent = name.toUpperCase();
    }

    showHitmarker() {
        const hitmarker = document.getElementById('hitmarker');
        hitmarker.classList.add('show');
        setTimeout(() => hitmarker.classList.remove('show'), 100);
    }

    showDamage() {
        const indicator = document.getElementById('damage-indicator');
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 300);
    }

    addKillFeed(message) {
        const killfeed = document.getElementById('killfeed');
        const killMsg = document.createElement('div');
        killMsg.className = 'kill-message';
        killMsg.textContent = message;
        killfeed.insertBefore(killMsg, killfeed.firstChild);
        
        setTimeout(() => killMsg.remove(), 5000);
    }

    updateKills(kills) {
        document.getElementById('kills').textContent = kills;
    }

    updateDeaths(deaths) {
        document.getElementById('deaths').textContent = deaths;
    }
}
