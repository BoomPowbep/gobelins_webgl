import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import GameBrain from "../GameManager/GameManager";
import {Vector3} from "three";
import DeviceOrientationControls from "../../device-orientation-control";

export default class ControlsManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor.
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🕹 Controls constructor');
    };

    // ------------------------------------------------------------------- INITIALIZERS

    /**
     * Init an OrbitControls controller. Desktop & mobile.
     * @param camera
     * @param rendererDom
     */
    initOrbitControls(camera, rendererDom) {
        this._controls = new OrbitControls(camera, rendererDom);
    }

    /**
     * Inits a DeviceOrientation controller. Needs enabled gyro.
     * @param camera
     */
    initDeviceOrientation(camera) {
        this._controls = new DeviceOrientationControls(camera, {});
        setTimeout(() => {
            this._controls.rotateAndFreeze({rotation: {x: 50, y:100, z:300}});
        }, 5000)
    }

    /**
     * Setup map controls
     * @param camera
     * @param rendererDom
     * @param cameraLimits
     */
    initMapControls(camera, rendererDom,  cameraLimits = null) {
        this._controls = new MapControls(camera, rendererDom);

        this._controls.enableDamping = true;
        this._controls.enableRotate = false;
        this._controls.enableKeys = false;
        this._controls.enableZoom = false;
        this._controls.enablePan = true;
        // this._controls.minDistance = 5;
        // this._controls.maxDistance = 10;

        //Map Limit
        if(cameraLimits != null) {
            const minPan = new THREE.Vector3(cameraLimits.minX, -2, cameraLimits.minZ);
            const maxPan = new THREE.Vector3(cameraLimits.maxX, 2, cameraLimits.maxZ);
            let _v = new THREE.Vector3();

            this._controls.addEventListener('change', e => {
                _v.copy(this._controls.target);
                this._controls.target.clamp(minPan, maxPan);
                _v.sub(this._controls.target);
                camera.position.sub(_v);
            });
        }

        camera.zoom = .05;
        camera.updateProjectionMatrix();
    }

    /**
     * For orthographic camera, this is the equivalent of camera.lookAt().
     * @param identifier
     */
    targetTo(identifier) {
        const target = GameBrain.modelManager.getModelReferenceByIdentifier(identifier);
        this._controls.target = new Vector3(target.position.x, target.position.y, target.position.z);
    }

    // ------------------------------------------------------------------- GETTERS

    /**
     * Get controls.
     * @returns {OrbitControls|DeviceOrientationControls}
     */
    get controls() {
        return this._controls;
    }
}
