import * as THREE from 'three';
import DeviceOrientationControls from 'three-device-orientation';
import OrbitControls from 'orbit-controls-es6';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GameBrain from "../GameManager/GameManager";
import {Vector3} from "three";

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

    /**
     * Setup map controls
     * @param camera
     * @param rendererDom
     */
    initMapControls(camera, rendererDom) {
        this._controls = new MapControls(camera, rendererDom);

        this._controls.enableDamping = true;
        this._controls.enableRotate = false;
        this._controls.enableKeys = false;
        this._controls.enableZoom = false;
        // this._controls.minDistance = 5;
        // this._controls.maxDistance = 10;

        camera.zoom = .05;
        camera.updateProjectionMatrix();
    }

    /**
     * For orthographic camera, this is the equivalent of camera.lookAt().
     * @param identifier
     */
    targetTo(identifier) {
        const target = GameBrain.geometryManager.getGeometryReferenceByIdentifier(identifier); // FIXME change to const target = GameBrain.modelManager.getModelReferenceByIdentifier(identifier);
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
