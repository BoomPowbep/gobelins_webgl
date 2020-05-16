import * as THREE from 'three';
import SceneManager from "../SceneManager/SceneManager";
import CameraManager from "../CameraManager/CameraManager";
import {ModelManager} from "../ModelManager/ModelManager";
import ControlsManager from "../ControlsManager/ControlsManager";
import GeometryManager from "../GeometryManager/GeometryManager";
import LightingManager from "../LightingManager/LightingManager";
import {SceneryManager} from "../SceneryManager/SceneryManager";

import * as dat from "dat.gui";
import Listening from "../../models/listening/listening";
import AudioManager from "../../models/audio/audio-manager";

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

            // Scenery-specific attributes
            this.bistroListening = false;
            this.bistroListened = false;
            this.bistroListenTimer = null;
            this.bistroCircleAnimationTick = null;

            this.listenings = [
                new Listening("bistro", 12000, "vocal_1", "BistroConversationGauge", "BistroConversationSprite", () => {
                        TIMELINES.postListenBistro.play();
                        let vocal = DATA.data_manager.get("record", "vocal-1");
                        vocal.pickedUp();
                    }, () => {
                        TIMELINES.preListenBistro.play();
                    }
                ),
                new Listening("colleuse", 20000, "vocal_2", "ColleuseConversationGauge", "ColleuseConversationSprite", () => {
                        TIMELINES.postListenColleuse.play();
                        let vocal = DATA.data_manager.get("record", "vocal-2");
                        vocal.pickedUp();
                    }, () => {
                        TIMELINES.preListenColleuse.play();
                    }
                ),
                new Listening("police", 20000, "vocal_3", "PoliceConversationGauge", "PoliceConversationSprite", () => {
                        TIMELINES.postListenPolice.play();
                        let vocal = DATA.data_manager.get("record", "vocal-3");
                        vocal.pickedUp();
                    }, () => {
                        TIMELINES.preListenPolice.play();
                    }
                )
            ];

            this.mixers = [];

            this.mapSprites = {};

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
        });

        /* -- Init Three components -- */
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        /* -- Set default controls -- */
        GameBrain.controlsManager.initDeviceOrientation(GameBrain.cameraManager.camera);


        let loader =  new THREE.TextureLoader();
        this.mapSprites = {
            red:   loader.load(`textures/pins/red.png`),
            here:  loader.load(`textures/pins/user.png`),
            green:   loader.load(`textures/pins/green.png`),
            vocal:   loader.load(`textures/vocal_icon.png`),
            vocal_listened:   loader.load(`textures/vocal_icon_green.png`),
        };
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