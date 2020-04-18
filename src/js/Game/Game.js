import * as THREE from 'three';
import Stats from 'stats-js';
import * as dat from 'dat.gui';

import {Model} from './ModelManager/ModelManager';
import RaycasterManager from "./RaycasterManager/RaycasterManager";
import DebugLogs from "./Debug/DebugLogs";
import {DebugPanel, DebugButton} from "./Debug/DebugPanel";
import {Vector3} from "three";
import AudioManager from "../models/audio/audio-manager";
import {Scenery} from "./SceneryManager/SceneryManager";

import GameBrain from './GameManager/GameManager';

export default class Game {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor.
     * Inits all components ans starts the loop.
     * @param debugMode
     */
    constructor(debugMode = true) {
        console.log('🎮 Game constructor');

        this._debugMode = debugMode;

        this._clock = new THREE.Clock();

        this._mouse = new THREE.Vector2();

        if (this._debugMode) {
            // Init Stats.js
            this.stats = new Stats();
            this.stats.showPanel(0); // 0 = print fps
            document.body.appendChild(this.stats.dom);

            this.gui = new dat.GUI();

            this._debuglogs = new DebugLogs();
            this._debugPanel = new DebugPanel();

            // Init debug buttons
            let debugButtonsArray = [
                new DebugButton("To Map", () => {
                    console.log("To map!");

                    this.controlsManager.controls.dispose();

                    // Switch camera
                    this.cameraManager.setCameraMode(false);

                    // Set new camera position
                    this.cameraManager.setPosition(10, 20, 110);

                    // Set map controls
                    this.controlsManager.initMapControls(this.cameraManager.camera, this.renderer.domElement);
                    this.controlsManager.controls.target = new Vector3(0, -.5, 90); // TODO create targetTo(obj) in ControlsManager

                }),
                new DebugButton("To Start", () => {
                    console.log("To start!");

                    this.controlsManager.controls.dispose();

                    // Switch camera
                    this.cameraManager.setCameraMode(true);

                    // Set new camera position
                    this.cameraManager.setPosition(0, 5, 10);

                    // Set device orientation controls
                    this.controlsManager.initDeviceOrientation(this.cameraManager.camera);
                }),
            ];
            this._debugPanel.addButtons(debugButtonsArray);
        }

        GameBrain.init({debugMode: this._debugMode});

        this._raycasterManager = new RaycasterManager(this._debugMode);

        let cover = document.getElementById("cover");

        cover.addEventListener("click", () => {
            cover.remove();

            //Setup audio list here
            // AudioManager.play("birds");

            // On iOS13 + devices, ask for device orientation events permission
            // https://medium.com/flawless-app-stories/how-to-request-device-motion-and-orientation-permission-in-ios-13-74fc9d6cd140
            if (window.DeviceOrientationEvent !== undefined && typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS 13+
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            this.init();
                        } else {
                            console.error("Device Orientation Event permission rejected by user: ", response);
                        }
                    })
                    .catch(console.error)
            } else {
                // Not iOS 13+
                this.init();
            }
        });


        window.addEventListener('touchend', this.onTouchEnd.bind(this)); // Get normalized position of mouse & do raycasr
    }

    /**
     * Creates the three scene & creates essentials.
     */
    init() {

        this.initSceneries();

        GameBrain.sceneryManager.loadScenery("ColleusesScenery");

        setTimeout(() => {

            GameBrain.sceneryManager.loadScenery("BistroScenery");

        }, 10000);

        // Start loop!
        this._loop();
    }

    /**
     * List all elements in different sceneries
     */
    initSceneries() {

        // -- SCENERIES

        // -- Scenery 3 - Colleuses
        let geometries = [
            GameBrain.geometryManager.createColorSkybox(0x000000, 1500), // Skybox
        ];

        let models = [
            new Model('ColleusesStreet', 'models/colleuses.glb', 1, {x: 0, y: 0, z: 0}),
        ];

        let lights = [
            GameBrain.lightingManager.createSpotLight({
                identifier: "StreetSpotLight",
                angle: 0,
                distance: 500,
            })
        ];

        GameBrain.sceneryManager.addScenery(
            new Scenery({
                    identifier: "ColleusesScenery",
                    geometries: geometries,
                    models: models,
                    lights: lights,
                    cameraPosition: {x: 0, y: 40, z: 0},
                    fog: true,
                    onLoadDone: () => {
                        GameBrain.sceneryManager.setActiveScenery("ColleusesScenery");
                    }
                }
            )
        );

    }

    // ------------------------------------------------------------------- CALLBACKS


    /**
     * Touch event callback.
     * @param event
     */
    onTouchEnd(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this._mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

        const touchedElementIdentifier = this._raycasterManager.getTouchedElementIdentifier(
            GameBrain.sceneManager.scene,
            this._mouse, GameBrain.cameraManager.camera
        );
        this._debugMode && this._debuglogs.addLog("RayCast -> " + touchedElementIdentifier);
        this._debugMode && console.log(touchedElementIdentifier);
        this.postTouchEventAction(touchedElementIdentifier);
    }

    /**
     * Perform action after touch event.
     * @param identifier
     */
    postTouchEventAction(identifier) {
        switch (identifier) {
            case "IceTruck":
                AudioManager.play("horn");
            default:
                break;
        }
    }

    // ------------------------------------------------------------------- RENDER

    /**
     * Render loop.
     * @private
     */
    _loop() {
        requestAnimationFrame(this._loop.bind(this));

        this._debugMode && this.stats.begin();

        GameBrain.controlsManager.controls.update(this._clock.getDelta()); // Only for device orientation controls
        GameBrain.renderer.render(GameBrain.sceneManager.scene, GameBrain.cameraManager.camera);

        this._debugMode && this.stats.end();
    }
}
