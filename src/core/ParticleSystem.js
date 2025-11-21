import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    createMuzzleFlash(position, direction) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const radius = Math.random() * 0.3;
            
            positions.push(
                position.x + Math.cos(angle) * radius,
                position.y + Math.sin(angle) * radius,
                position.z
            );

            // Orange/yellow flash colors
            const color = new THREE.Color();
            color.setHSL(0.1 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.3);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);

        // Animate and remove
        let opacity = 1;
        const animate = () => {
            opacity -= 0.05;
            material.opacity = opacity;
            
            if (opacity <= 0) {
                this.scene.remove(particles);
                geometry.dispose();
                material.dispose();
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    createBulletTrail(start, end) {
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });

        const line = new THREE.Line(geometry, material);
        this.scene.add(line);

        setTimeout(() => {
            this.scene.remove(line);
            geometry.dispose();
            material.dispose();
        }, 50);
    }

    createImpactEffect(position, normal) {
        const particleCount = 15;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions.push(position.x, position.y, position.z);
            
            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            );
            velocities.push(vel);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x333333,
            transparent: true,
            opacity: 1
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);

        let time = 0;
        const animate = () => {
            time += 0.016;
            const posArray = geometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                posArray[idx] += velocities[i].x * 0.016;
                posArray[idx + 1] += velocities[i].y * 0.016 - 9.8 * time * 0.016;
                posArray[idx + 2] += velocities[i].z * 0.016;
            }

            geometry.attributes.position.needsUpdate = true;
            material.opacity -= 0.02;

            if (material.opacity <= 0 || time > 1) {
                this.scene.remove(particles);
                geometry.dispose();
                material.dispose();
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    createBloodEffect(position) {
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions.push(position.x, position.y, position.z);
            
            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                Math.random() * 3,
                (Math.random() - 0.5) * 3
            );
            velocities.push(vel);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.08,
            color: 0xff0000,
            transparent: true,
            opacity: 1
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);

        let time = 0;
        const animate = () => {
            time += 0.016;
            const posArray = geometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                posArray[idx] += velocities[i].x * 0.016;
                posArray[idx + 1] += velocities[i].y * 0.016 - 9.8 * time * 0.016;
                posArray[idx + 2] += velocities[i].z * 0.016;
            }

            geometry.attributes.position.needsUpdate = true;
            material.opacity -= 0.015;

            if (material.opacity <= 0 || time > 1.5) {
                this.scene.remove(particles);
                geometry.dispose();
                material.dispose();
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
}
