let scene, camera, renderer, cube, material;

function init() {
    // Создание сцены
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);

    // Создание и настройка камеры
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;


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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    // Создание геометрии куба
    const geometry = new THREE.BoxGeometry();
    //const material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    const loader = new THREE.FBXLoader();
    loader.load('sources/models/LOGOCube.fbx', function(fbx) {
        fbx.traverse(function(child) {
            if (child.isMesh) {
                child.material = material; // Применяем шейдерный материал к каждому mesh в модели
            }
        });
        cube.add(fbx);
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    // Перевод координат мыши в нормализованные значения от -1 до 1
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

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

                    gsap.fromTo(cube.rotation, {
                        y: 0 // конечное значение
                    },
                    {
                        y:-windowBottom/objectBottom,
                        duration: 0.5,
                        ease: "linear"
                    });

                    gsap.fromTo(cube.position, {
                        x: 0 // конечное значение
                    },
                    {
                        x:windowBottom/objectBottom,
                        duration: 0.5,
                        ease: "linear"
                    });



                    /*
                


                


                gsap.fromTo(cube.position, {
                    x: 0 // конечное значение
                },
                {
                    x:1,
                    duration: 0.5,
                    ease: "linear"
                }); */




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

                    gsap.fromTo(cube.rotation, {
                        y: -windowBottom/objectBottom // конечное значение
                    },
                    {
                        y:0,
                        duration: 0.5,
                        ease: "linear"
                    });

                    gsap.fromTo(cube.position, {
                        x: windowBottom/objectBottom // конечное значение
                    },
                    {
                        x:0,
                        duration: 0.5,
                        ease: "linear"
                    });


                    /*
                    


                    gsap.fromTo(cube.rotation, {
                        y: -1 // конечное значение
                    },
                    {
                        y:0,
                        duration: 0.5,
                        ease: "linear"
                    });

                    gsap.fromTo(cube.position, {
                        x: 1 // конечное значение
                    },
                    {
                        x:0,
                        duration: 0.5,
                        ease: "linear"
                    }); */


                    scrolled = false;
                }
                
            }
        });
    }).scroll(); // Вызываем событие scroll при загрузке страницы
});



init();