import { WeaponBase } from './WeaponBase.js';

export class SMG extends WeaponBase {
    constructor(scene, camera, inputManager, weaponData, particleSystem) {
        super(scene, camera, inputManager, weaponData, particleSystem);
        this.weaponModel.weaponType = 'smg';
    }
}
