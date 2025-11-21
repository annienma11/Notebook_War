import * as THREE from 'three';

export class SkyboxManager {
    constructor(scene) {
        this.scene = scene;
        this.createSkybox();
        this.createClouds();
    }

    createSkybox() {
        // Create gradient sky
        const vertexShader = `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `;

        const uniforms = {
            topColor: { value: new THREE.Color(0x0077ff) },
            bottomColor: { value: new THREE.Color(0xffffff) },
            offset: { value: 400 },
            exponent: { value: 0.6 }
        };

        const skyGeo = new THREE.SphereGeometry(500, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    }

    createClouds() {
        const cloudGroup = new THREE.Group();
        
        for (let i = 0; i < 20; i++) {
            const cloud = this.createCloud();
            cloud.position.set(
                (Math.random() - 0.5) * 200,
                20 + Math.random() * 30,
                (Math.random() - 0.5) * 200
            );
            cloudGroup.add(cloud);
        }
        
        this.scene.add(cloudGroup);
        this.cloudGroup = cloudGroup;
    }

    createCloud() {
        const cloud = new THREE.Group();
        const geometry = new THREE.SphereGeometry(1, 8, 8);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            roughness: 1
        });

        for (let i = 0; i < 5; i++) {
            const puff = new THREE.Mesh(geometry, material);
            puff.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 1,
                (Math.random() - 0.5) * 3
            );
            puff.scale.set(
                1 + Math.random() * 2,
                0.8 + Math.random() * 0.5,
                1 + Math.random() * 2
            );
            cloud.add(puff);
        }

        return cloud;
    }

    update(deltaTime) {
        if (this.cloudGroup) {
            this.cloudGroup.rotation.y += deltaTime * 0.01;
        }
    }
}
