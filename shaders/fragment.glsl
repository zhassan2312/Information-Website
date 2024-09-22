precision mediump float;

uniform sampler2D uImage;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(uImage, vUv);
}