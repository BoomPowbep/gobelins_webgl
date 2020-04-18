import * as THREE from 'three';
import SceneManager from "../SceneManager/SceneManager";
import CameraManager from "../CameraManager/CameraManager";
import {ModelManager} from "../ModelManager/ModelManager";
import ControlsManager from "../ControlsManager/ControlsManager";
import GeometryManager from "../GeometryManager/GeometryManager";
import LightingManager from "../LightingManager/LightingManager";
import AudioManager from "../../models/audio/audio-manager";
import {SceneryManager} from "../SceneryManager/SceneryManager";

class GameManager {
    /**
     * Singleton constructor.
     * @returns {GameManager}
     */
    constructor() {
        if (!GameManager.instance) {

            this.debugMode = false;

            this.sceneManager = null;
            this.cameraManager = null;
            this.controlsManager = null;
            this.modelManager = null;
            this.geometryManager = null;
            this.lightingManager = null;
            this.sceneryManager = null;

            GameManager.instance = this;

            // Event listeners
            window.addEventListener('resize', this.resizeViewport.bind(this)); // Resize
        }

        return GameManager.instance;
    }

    /**
     * Init the singleton.
     * @param debugMode
     */
    init(
        {
            debugMode = false
        }
    ) {
        this.debugMode = debugMode;

        /* -- Init managers -- */
        this.sceneManager = new SceneManager(this.debugMode);
        this.cameraManager = new CameraManager(this.debugMode);
        this.controlsManager = new ControlsManager(this.debugMode);
        this.modelManager = new ModelManager(this.debugMode);
        this.geometryManager = new GeometryManager(this.debugMode);
        this.lightingManager = new LightingManager(this.debugMode);
        this.sceneryManager = new SceneryManager(this.debugMode);

        AudioManager.init();
        document.addEventListener("sound_ready", function (e) {
        });

        /* -- Init Three components -- */
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        /* -- Init Controls -- */
        this.controlsManager.initDeviceOrientation(this.cameraManager.camera);
    }

    // ----------------------------------------------------------------------- CALLBACKS

    /**
     * Window resize callback.
     */
    resizeViewport() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        this.renderer.setSize(width, height);
        this.cameraManager.camera.aspect = width / height;
        this.cameraManager.camera.updateProjectionMatrix();
    }
}

const GameBrain = new GameManager();

export default GameBrain;