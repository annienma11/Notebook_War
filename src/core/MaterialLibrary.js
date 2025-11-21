import * as THREE from 'three';

export class MaterialLibrary {
    constructor() {
        this.materials = {};
        this.createMaterials();
    }

    createMaterials() {
        // Notebook paper texture (procedural)
        this.materials.paper = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.1,
            map: this.createPaperTexture()
        });

        // Blue stickman material (player team)
        this.materials.blueStickman = new THREE.MeshStandardMaterial({
            color: 0x0066ff,
            roughness: 0.7,
            metalness: 0.3,
            emissive: 0x0033aa,
            emissiveIntensity: 0.2
        });

        // Red stickman material (enemy team)
        this.materials.redStickman = new THREE.MeshStandardMaterial({
            color: 0xff0033,
            roughness: 0.7,
            metalness: 0.3,
            emissive: 0xaa0000,
            emissiveIntensity: 0.2
        });

        // Ink/pen material (black outlines)
        this.materials.ink = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.8,
            metalness: 0.1
        });

        // Sketch lines material
        this.materials.sketchLines = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 2
        });

        // Ground with grid pattern
        this.materials.ground = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.9,
            metalness: 0.0,
            map: this.createGridTexture()
        });

        // Wall materials with notebook lines
        this.materials.wall = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.85,
            metalness: 0.0,
            map: this.createLinedPaperTexture()
        });

        // Colorful accent materials
        this.materials.accent1 = new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            roughness: 0.6,
            metalness: 0.4,
            emissive: 0xff8800,
            emissiveIntensity: 0.1
        });

        this.materials.accent2 = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            roughness: 0.6,
            metalness: 0.4,
            emissive: 0x00cc66,
            emissiveIntensity: 0.1
        });

        this.materials.accent3 = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            roughness: 0.6,
            metalness: 0.4,
            emissive: 0xcc00cc,
            emissiveIntensity: 0.1
        });

        // Weapon material (metallic)
        this.materials.weapon = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.8
        });

        // Glass/transparent material
        this.materials.glass = new THREE.MeshPhysicalMaterial({
            color: 0xaaccff,
            roughness: 0.1,
            metalness: 0.0,
            transmission: 0.9,
            thickness: 0.5
        });
    }

    createPaperTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Base paper color
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 512);

        // Add paper grain
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const gray = 240 + Math.random() * 15;
            ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
            ctx.fillRect(x, y, 1, 1);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }

    createGridTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Base color
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 512, 512);

        // Draw grid
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;

        const gridSize = 32;
        for (let i = 0; i <= 512; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(8, 8);
        return texture;
    }

    createLinedPaperTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Base paper
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 512);

        // Add paper texture
        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const gray = 245 + Math.random() * 10;
            ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
            ctx.fillRect(x, y, 1, 1);
        }

        // Draw horizontal lines
        ctx.strokeStyle = '#aaccff';
        ctx.lineWidth = 1;
        const lineSpacing = 32;
        for (let y = lineSpacing; y < 512; y += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(512, y);
            ctx.stroke();
        }

        // Red margin line
        ctx.strokeStyle = '#ff6666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(64, 0);
        ctx.lineTo(64, 512);
        ctx.stroke();

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        return texture;
    }

    get(name) {
        return this.materials[name] || this.materials.paper;
    }
}
