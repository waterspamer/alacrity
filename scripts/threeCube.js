let scene, camera, renderer, cube, trueCube, material, clock, uniforms;


const point1 = (0,0,0);

const point2 = (1,0,0);

async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке шейдера: ${url}`);
    }
    return await response.text();
  }


async function init() {
    // Создание сцены
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);
    clock = new THREE.Clock(true);
    // Создание и настройка камеры
    //camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.001, 10000);
    camera = new THREE.PerspectiveCamera(35, 1, 0.001, 10000);
    camera.position.z = 2;
        // Загрузка текстуры
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('sources/models/cubeTex.png');
    uniforms = {
        uTime: {value: 0},
        uTexture: { value: texture },
        uMouseX: { value: 1 }, // Начальное положение курсора мыши (0.5 - центр)
        viewDirection: {value : new THREE.Vector3(0,0,-1)},
        fresnelBias: { value: 1.2 },
        fresnelScale: { value: 3.2 },
        fresnelPower: { value: 1.0 },
        normality: {value: 0.0}
    }



// Создание материала с шейдером
 material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: await loadShader('sources/shaders/cubeVertex.glsl'),
    fragmentShader: await loadShader('sources/shaders/cubeFragment.glsl')
});




    // Настройка рендерера
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(512, 512);
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.id = 'canvasMain';
    
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
    renderer.domElement.addEventListener('click', animateCubeOnClick);
    // Запуск цикла рендеринга
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    uniforms.uTime.value = clock.getElapsedTime();
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

    //material.uniforms.viewDirection.value = new THREE.Vector3(1 - mouseX/window.innerWidth, 0, mouseX/window.innerWidth);

    //material.uniforms.uMouseX.value = event.clientX / window.innerWidth;
    // Перемещение куба в соответствии с координатами мыши
    //cube.position.x = mouseX * 5; // Умножаем, чтобы увеличить диапазон движения
    //cube.position.y = mouseY * 5;
}

var canClickCube = true;

function animateCubeOnClick(){

    if (!canClickCube) return;
    canClickCube = false;
    setTimeout(()=>canClickCube = true, 800);
    setTimeout(()=>{
    gsap.fromTo(material.uniforms.normality, {
        value: 0.0
    },
    {
        value: 1.0,
        duration: .3
    });
    }, 200);

    setTimeout(()=>{
        gsap.fromTo(material.uniforms.normality, {
            value: 1.0
        },
        {
            value: 0.0,
            duration: .3
        });
    }, 500);

    gsap.fromTo(trueCube.rotation, {
        z: 0 // конечное значение
    },
    {
        z:-.5,
        duration: .2,
        ease: "ease"
    });
    setTimeout(()=>{gsap.fromTo(trueCube.rotation, {
        z: 0-.5// конечное значение
    },
    {
        z:Math.PI * 2 + .1,
        duration: .5,
        ease: "ease"
    })}, 200);
    setTimeout(()=>{gsap.fromTo(trueCube.rotation, {
        z:Math.PI * 2 + .1// конечное значение
    },
    {
        z:Math.PI * 2,
        duration: .2,
        ease: "ease"
    })}, 700);


}

let firstScrollEvent = false;
let secondScrollEvent = true;


let scrolled = false;
let codeAppeared = false;

$(document).ready(function(){
    $(window).scroll(function() {
        var windowBottom = $(this).scrollTop() + $(this).innerHeight();
        $(".target-div").each(function() {

            
            function clamp(num, min, max) {
                return num <= min 
                  ? min 
                  : num >= max 
                    ? max 
                    : num
              }

            /* Проверяем, находится ли данный div в области видимости */
            var objectBottom = $(this).offset().top + $(this).outerHeight();
            if (objectBottom < windowBottom + window.innerHeight/1.33){
                $(".color-cont").first(function(){
                    this.style.width ="10%";
                    this.style.left = "90%";
                    //this.style.height = `${clamp((this).scrollTop()* 1000, 10, 100)}%`;
            });
            }
            else{
                $(".color-cont").first(function(){
                    this.style.width ="100%";
                    this.style.left = "0%";
                    this.style.height = "10%";
                });
            }

            if (objectBottom < windowBottom + window.innerHeight/2 && !codeAppeared){
                codeAppeared = true;
                updateElementWithCode();
            }

            /* Если пользователь доскроллил до div, постепенно меняем цвет текста на белый */
            if (objectBottom < windowBottom + window.innerHeight/2 ) { // Если элемент полностью видим
                document.getElementById('canvasMain').style.transform = `translate(${-50-Math.sin(((objectBottom - windowBottom - window.innerHeight/2)/300))*45}%, ${-50}%)`;
                //cube.position.x = -(objectBottom - windowBottom - window.innerHeight/2) /200;
                //cube.rotation.y = (objectBottom - windowBottom - window.innerHeight/2) /1000;
                cube.rotation.y = Math.sin(((objectBottom - windowBottom - window.innerHeight/2)/300));
                //cube.scale.set(Math.abs(Math.sin(((objectBottom - windowBottom - window.innerHeight/2)/300)))+ .5,
                //Math.abs(Math.sin(((objectBottom - windowBottom - window.innerHeight/2)/300)))+ .5,
                //Math.abs(Math.sin(((objectBottom - windowBottom - window.innerHeight/2)/300)))+ .5)
                $(this).css('color', 'black');
                
                if (!scrolled){
                    animateCubeOnClick();
                    gsap.fromTo(material.uniforms.uMouseX, {
                        value: 1 // конечное значение
                    },
                    {
                        value:0,
                        duration: 0.2,
                        ease: "linear"
                    });

                scrolled = true;
            }

                //animateToWhite(1000);
            }        
            
            else { // Если элемент не полностью видим
                $(this).css('color', 'transparent');
                
                if (scrolled){ 
                    gsap.fromTo(material.uniforms.uMouseX, {
                        value: 0 // конечное значение
                    },
                    {
                        value:1,
                        duration: 0.2,
                        ease: "linear"
                    });
                    cube.rotation.y = 0;
                    document.getElementById('canvasMain').style.transform = `translate(-50%, -50%)`;
                    scrolled = false;
                }
                
            }
        });
    }).scroll(); // Вызываем событие scroll при загрузке страницы
});
















init();