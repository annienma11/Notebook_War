import { WeaponBase } from './WeaponBase.js';
import * as THREE from 'three';

export class Rifle extends WeaponBase {
    createWeaponModel() {
        this.weaponGroup = new THREE.Group();
        
        // Rifle body
        const bodyGeometry = new THREE.BoxGeometry(0.12, 0.18, 0.6);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.4,
            metalness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.weaponGroup.add(body);

        // Long barrel
        const barrelGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8);
        const barrelMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.2,
            metalness: 0.9
        });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0, 0.06, -0.5);
        this.weaponGroup.add(barrel);

        // Stock
        const stockGeometry = new THREE.BoxGeometry(0.1, 0.12, 0.25);
        const stockMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a3a3a,
            roughness: 0.7,
            metalness: 0.3
        });
        const stock = new THREE.Mesh(stockGeometry, stockMaterial);
        stock.position.set(0, 0, 0.35);
        this.weaponGroup.add(stock);

        // Magazine
        const magGeometry = new THREE.BoxGeometry(0.08, 0.25, 0.1);
        const magMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.6,
            metalness: 0.5
        });
        const magazine = new THREE.Mesh(magGeometry, magMaterial);
        magazine.position.set(0, -0.18, 0);
        this.weaponGroup.add(magazine);

        // Scope
        const scopeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8);
        const scopeMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.8
        });
        const scope = new THREE.Mesh(scopeGeometry, scopeMaterial);
        scope.rotation.z = Math.PI / 2;
        scope.position.set(0, 0.12, -0.1);
        this.weaponGroup.add(scope);

        this.weaponGroup.position.set(0.3, -0.3, -0.5);
        this.camera.add(this.weaponGroup);
    }
}
