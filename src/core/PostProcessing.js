import * as THREE from 'three';

export class PostProcessing {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        
        this.setupPostProcessing();
    }

    setupPostProcessing() {
        // Outline effect for sketch style
        this.outlinePass = {
            enabled: true,
            thickness: 2,
            color: 0x000000
        };

        // Vignette effect
        this.vignettePass = {
            enabled: true,
            intensity: 0.3
        };

        // Create render targets
        this.renderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        );
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.renderTarget.setSize(width, height);
    }
}
