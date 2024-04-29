let scene, camera, renderer, cube;

function init() {
    // Создание сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Создание и настройка камеры
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Настройка рендерера
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Создание геометрии куба
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

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

    // Перемещение куба в соответствии с координатами мыши
    cube.position.x = mouseX * 5; // Умножаем, чтобы увеличить диапазон движения
    cube.position.y = mouseY * 5;
}

init();