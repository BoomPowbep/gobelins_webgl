import * as THREE from 'three';
import DeviceOrientationControls from 'three-device-orientation';
import OrbitControls from 'orbit-controls-es6';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';

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
        this._controls = new DeviceOrientationControls(camera);
    }

    initMapControls(camera, rendererDom) {
        this._controls = new MapControls(camera, rendererDom);

        this._controls.enableDamping = true;
        this._controls.enableRotate = false;
        this._controls.enableKeys = false;
        this._controls.enableZoom = false;
        // this._controls.minDistance = 5;
        // this._controls.maxDistance = 10;

        camera.zoom = 1.5;
        camera.updateProjectionMatrix();
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
