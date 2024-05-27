let webScene, webCamera, webRenderer, webMaterial;

let standScene, standCamera, standRenderer, standMaterial;

let cameraScene, cameraCamera, cameraRenderer, cameraMaterial;

let texture;





function initModels(){
    init('canvas1', 'sources/models/web.fbx', new THREE.MeshPhongMaterial({ color: 0x999698, shininess: 100, side: THREE.DoubleSide }));
    init('canvas2', 'sources/models/stand.fbx',new THREE.MeshPhongMaterial({ color: 0x999698, shininess: 100, side: THREE.DoubleSide }));
    init('canvas3', 'sources/models/camera.fbx', new THREE.MeshPhongMaterial({ color: 0x999698, shininess: 100, side: THREE.DoubleSide }));
}


function init(canvasId, modelPath, material) {
    const canvas = document.getElementById(canvasId);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true , alpha: true});
    renderer.setSize(300, 300);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.001, 10000);
    camera.position.z = 2;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 200, 100);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
    
   

    // Загрузка модели
    const loader = new THREE.FBXLoader();
    loader.load(modelPath, function (fbx) {
        fbx.traverse(function (child) {
            if (child.isMesh) {
                //child.position.set(new THREE.Vector3(0,0,0));
                console.log(child.position);
                child.scale.set(.1, .1, .1);
                child.material = material; // Применяем материал к каждому mesh в модели
            }
        });
        scene.add(fbx);
    }, undefined, function (error) {
        console.error(error);
    });

    const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
}

initModels();