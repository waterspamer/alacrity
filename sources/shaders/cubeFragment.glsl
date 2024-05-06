

    uniform sampler2D uTexture;
    uniform float uMouseX;
    uniform vec3 viewDirection;
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    // Простая функция шума (можно заменить на более сложную реализацию)
    float noise(vec2 p){
        return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453);
    }


    
    void main() {

        float fresnel = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(vNormal), normalize(viewDirection)), fresnelPower);

        vec4 color = texture2D(uTexture, vUv);
        float n = noise(vUv * 0.1); // Умножаем vUv, чтобы сделать шум мельче
        float mixAmount = smoothstep(0.0, 1.0, uMouseX) * n;
        color.rgb = mix((color *  fresnel).rgb, 1.0 - (color *  fresnel).rgb, uMouseX);
        gl_FragColor = color;
    }