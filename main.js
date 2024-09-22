import * as THREE from 'three';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

class Site {
    constructor({ dom }) {
        this.container = dom;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.time = 0;
        this.images = [...document.querySelectorAll('.images img')];
        this.material;
        this.imagesStore = [];
        this.uStartIndex = 0;
        this.uEndIndex = 1;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000
        );

        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        this.addImages();
        this.setPosition();
        this.render();
    }

    setPosition() {
        this.imagesStore.forEach((img) => {
            const bounds = img.img.getBoundingClientRect();
            img.mesh.position.y = -bounds.top + this.height / 2 - bounds.height / 2;
            img.mesh.position.x = bounds.left - this.width / 2 + bounds.width / 2;
        });
    }

    addImages() {
        const textureLoader = new THREE.TextureLoader();
        const textures = [];

        // Load textures and ensure they are fully loaded before using them
        this.images.forEach((img, index) => {
            textureLoader.load(img.src, (texture) => {
                textures[index] = texture;
                if (textures.length === this.images.length) {
                    this.createMaterial(textures);
                }
            });
        });
    }

    createMaterial(textures) {
        const uniforms = {
            uImage: { value: textures[2] }, // Use the third image as an example
            uTime: { value: 0 },
        };

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: uniforms,
            transparent: true,
        });

        this.images.forEach((img, index) => {
            const bounds = img.getBoundingClientRect();
            const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height);
            const mesh = new THREE.Mesh(geometry, this.material.clone());
            mesh.material.uniforms.uImage.value = textures[index];
            this.scene.add(mesh);
            this.imagesStore.push({
                img: img,
                mesh: mesh,
                left: bounds.left,
                top: bounds.top,
                width: bounds.width,
                height: bounds.height,
            });
        });

        console.log(this.imagesStore); // Debugging: Check if images are added correctly
    }

    render() {
        this.time++;
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Site({
    dom: document.querySelector('.canvas')
});