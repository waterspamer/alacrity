let scene, camera, renderer, cube, trueCube, material;


const point1 = (0,0,0);

const point2 = (1,0,0);



function init() {
    // Создание сцены
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);

    // Создание и настройка камеры
    //camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.001, 10000);
    camera = new THREE.PerspectiveCamera(35, 1, 0.001, 10000);
    camera.position.z = 2;


    // Загрузка текстуры
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('sources/models/cubeTex.png');

// Создание материала с шейдером
 material = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: texture },
        uMouseX: { value: 0 } // Начальное положение курсора мыши (0.5 - центр)
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uMouseX;
    varying vec2 vUv;
    
    // Простая функция шума (можно заменить на более сложную реализацию)
    float noise(vec2 p){
        return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453);
    }
    
    void main() {
        vec4 color = texture2D(uTexture, vUv);
        float n = noise(vUv * 0.1); // Умножаем vUv, чтобы сделать шум мельче
        float mixAmount = smoothstep(0.0, 1.0, uMouseX) * n;
        color.rgb = mix(color.rgb, 1.0 - color.rgb, uMouseX);
        gl_FragColor = color;
    }
    `
});





    












    // Настройка рендерера
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(512, 512);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    // Создание геометрии куба
    const geometry = new THREE.BoxGeometry();
    const trMat = new THREE.MeshNormalMaterial();
    trMat.transparent = true;
    trMat.opacity = 0;
    //const material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, trMat);
    scene.add(cube);
    material.side = THREE.DoubleSide;

    const loader = new THREE.FBXLoader();
    loader.load('sources/models/cube.fbx', function(fbx) {
        fbx.traverse(function(child) {
            if (child.isMesh) {
                child.scale.set(.2,.2,.2);
                console.log(child);
                child.material = material; // Применяем шейдерный материал к каждому mesh в модели
            }
        });

        trueCube = fbx;
        cube.add(trueCube);
    }, undefined, function(error) {
        console.error(error);
    });




    //cube.add(fbx);
    // Обработка изменения размера окна
    window.addEventListener('resize', onWindowResize, false);

    // Обновление позиции куба при движении мыши
    document.addEventListener('mousemove', onMouseMove, false);

    // Запуск цикла рендеринга
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    // Перевод координат мыши в нормализованные значения от -1 до 1
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    trueCube.rotation.x = -mouseY * 0.2;
    trueCube.rotation.y = mouseX * 0.2;

    trueCube.position.x = -mouseX * 0.01;
    trueCube.position.y = -mouseY * 0.01;

    //material.uniforms.uMouseX.value = event.clientX / window.innerWidth;
    // Перемещение куба в соответствии с координатами мыши
    //cube.position.x = mouseX * 5; // Умножаем, чтобы увеличить диапазон движения
    //cube.position.y = mouseY * 5;
}






let scrolled = false;


$(document).ready(function(){
    $(window).scroll(function() {
        var windowBottom = $(this).scrollTop() + $(this).innerHeight();
        $(".target-div").each(function() {
            /* Проверяем, находится ли данный div в области видимости */
            var objectBottom = $(this).offset().top + $(this).outerHeight();
            

            if (objectBottom < windowBottom + window.innerHeight/2 ){

                renderer.domElement.style.transform = `translate(${-50-(objectBottom - windowBottom - window.innerHeight/2)/10}%, ${-50}%)`;
                //cube.position.x = -(objectBottom - windowBottom - window.innerHeight/2) /200;
                cube.rotation.y = (objectBottom - windowBottom - window.innerHeight/2) /1000;
            }
            //cube.position.x =  ;
            
            
            


            /* Если пользователь доскроллил до div, постепенно меняем цвет текста на белый */
            if (objectBottom < windowBottom + window.innerHeight/2) { // Если элемент полностью видим
                $(this).css('color', 'white');
                
                if (!scrolled){
                    gsap.fromTo(material.uniforms.uMouseX, {
                        value: 0 // конечное значение
                    },
                    {
                        value:1,
                        duration: 0.2,
                        ease: "linear"
                    });

                scrolled = true;
            }
                //animateToWhite(1000);
            } else { // Если элемент не полностью видим
                $(this).css('color', 'transparent');
                
                if (scrolled){ 
                    gsap.fromTo(material.uniforms.uMouseX, {
                        value: 1 // конечное значение
                    },
                    {
                        value:0,
                        duration: 0.2,
                        ease: "linear"
                    });
                    renderer.domElement.style.transform = `translate(-50%, -50%)`;
                    scrolled = false;
                }
                
            }
        });
    }).scroll(); // Вызываем событие scroll при загрузке страницы
});



init();