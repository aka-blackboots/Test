// TODO change reference of library
import { IFCLoader } from "web-ifc-three/IFCLoader";

import { Raycaster, Vector2 } from "three"
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";

export class IfcManager {
    constructor(scene, ifcModels, camera) {
        this.scene = scene;
        this.ifcModels = ifcModels
        this.ifcLoader = new IFCLoader();
        this.threeCanvas = document.getElementById('three-canvas');
        this.mouse = new Vector2()
        this.rayCaster = new Raycaster(0,0)
        this.camera = camera

        this.onPick = this.onPick.bind(this)

        this.setupIfcLoader().then()
        this.setupFileOpenReader()
    }

    setupFileOpenReader() {
        // const input = document.getElementById('file-input');
        // input.addEventListener(
        //     'change',
        //     (changed) => {
        //         const ifcURL = URL.createObjectURL(changed.target.files[0]);
        //         this.ifcLoader.load(ifcURL,
        //             (ifcModel) => {
        //                 this.ifcModels.push(ifcModel)
        //                 this.scene.add(ifcModel)
        //             },
        //             null,
        //             null);
        //     },
        //     false,
        // );

        const input = document.getElementById('file-input');
        input.addEventListener(
            'change',
            (changed) => {
                const ifcURL = URL.createObjectURL(changed.target.files[0]);
                this.ifcLoader.load(ifcURL, (ifcModel) => this.scene.add(ifcModel));
            },
            false,
        );
    }

    async setupIfcLoader() {
        // Wasm {OK}
        await this.ifcLoader.ifcManager.setWasmPath("static/common/");

        // Multithreading
        await this.ifcLoader.ifcManager.useWebWorkers(true, '../static/common/IFCWorker.js')

        // Picking
        this.ifcLoader.ifcManager.setupThreeMeshBVH(computeBoundsTree, disposeBoundsTree, acceleratedRaycast);

        // Get the canvas
        this.threeCanvas.ondblclick = this.onPick
    }

    onPick(event) {
        // const found = this.testOmar(event)[0];

        console.log('1')
        // Computes the position of the mouse on the screen
        const bounds = this.threeCanvas.getBoundingClientRect();

        console.log('2')
        const x1 = event.clientX - bounds.left;
        const x2 = bounds.right - bounds.left;
        this.mouse.x = (x1 / x2) * 2 - 1;

        console.log('3')
        const y1 = event.clientY - bounds.top;
        const y2 = bounds.bottom - bounds.top;
        this.mouse.y = -(y1 / y2) * 2 + 1;

        // Places it on the camera pointing to the mouse
        console.log('4')
        console.log('Camera:: ', this.camera)
        this.rayCaster.setFromCamera(this.mouse, this.camera);
        console.log('5')
        // Casts a ray
        const found = this.rayCaster.intersectObjects(this.ifcModels);
        console.log('6')



        console.log("7:: ", found)
        if (found) {
            const index = found.faceIndex;
            const geometry = found.object.geometry;
            const ifc = this.ifcLoader.ifcManager;
            const id = ifc.getExpressId(geometry, index);
            console.log(id);
        }
    }
}