import * as THREE from 'three';
import SceneManager from "../SceneManager/SceneManager";
import CameraManager from "../CameraManager/CameraManager";
import {ModelManager} from "../ModelManager/ModelManager";
import ControlsManager from "../ControlsManager/ControlsManager";
import GeometryManager from "../GeometryManager/GeometryManager";
import LightingManager from "../LightingManager/LightingManager";
import AudioManager from "../../models/audio/audio-manager";
import {SceneryManager} from "../SceneryManager/SceneryManager";

import DataManager from "../../models/data/data-manager";
import UiManager from "../../models/ui/ui-manager";
import UiNotes from "../../models/ui/ui-notes";
import UiMaps from "../../models/ui/ui-maps";
import UiSettings from "../../models/ui/ui-settings";
import UiInstagram from "../../models/ui/ui-instagram";
import * as dat from "dat.gui";

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

        if(this.debugMode) {
            this.gui = new dat.GUI();
            this.gui.close();
        }

        /* -- Init managers -- */
        this.sceneManager = new SceneManager(this.debugMode);
        this.cameraManager = new CameraManager(this.debugMode);
        this.controlsManager = new ControlsManager(this.debugMode);
        this.modelManager = new ModelManager(this.debugMode);
        this.geometryManager = new GeometryManager(this.debugMode);
        this.lightingManager = new LightingManager(this.debugMode);
        this.sceneryManager = new SceneryManager(this.debugMode);

        document.addEventListener("sound_ready", function (e) {
            //When sounds are ready, we can build our data manager
            DATA.data_manager = new DataManager();
            DATA.ui_manager = new UiManager();
            DATA.ui_manager.registerUi("notes", new UiNotes());
            DATA.ui_manager.registerUi("maps", new UiMaps());
            DATA.ui_manager.registerUi("settings", new UiSettings());
            DATA.ui_manager.registerUi("instagram", new UiInstagram());
            //DATA.ui_manager.get("notes").show();

            //Debug pickup
            DATA.data_manager.get("instagram", "post-1").pickedUp();

            this.debugMode && Object.entries(DATA.ui_manager.ui_list).forEach(value =>  GameBrain.gui.add({add: () => {   DATA.ui_manager.get(value[0]).show()  }},'add').name('ui:' + value[0]));
        });

        /* -- Init Three components -- */
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        /* -- Set default controls -- */
        GameBrain.controlsManager.initDeviceOrientation(GameBrain.cameraManager.camera);
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