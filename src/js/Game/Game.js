import * as THREE from 'three';
import Stats from 'stats-js';

import {Model} from './ModelManager/ModelManager';
import RaycasterManager from "./RaycasterManager/RaycasterManager";
import DebugLogs from "./Debug/DebugLogs";
import {DebugPanel, DebugButton} from "./Debug/DebugPanel";
import {Vector3} from "three";

import DATA from "../models/data";

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

        GameBrain.init({debugMode: this._debugMode});

        if (this._debugMode) {
            // Init Stats.js
            this.stats = new Stats();
            this.stats.showPanel(0); // 0 = print fps
            document.body.appendChild(this.stats.dom);

            this._debuglogs = new DebugLogs();
            this._debugPanel = new DebugPanel();


            // Init debug buttons
            let debugButtonsArray = [
                new DebugButton("To Map", () => {
                    console.log("To map!");

                    GameBrain.controlsManager.controls.dispose();

                    // Switch camera
                    GameBrain.cameraManager.setCameraMode(false);

                    // Set new camera position
                    GameBrain.cameraManager.setPosition(10, 20, 110);

                    // Set map controls
                    GameBrain.controlsManager.initMapControls(this.cameraManager.camera, this.renderer.domElement);
                    GameBrain.controlsManager.controls.target = new Vector3(0, -.5, 90); // TODO create targetTo(obj) in ControlsManager

                }),
                new DebugButton("To Start", () => {
                    console.log("To start!");

                    GameBrain.controlsManager.controls.dispose();

                    // Switch camera
                    GameBrain.cameraManager.setCameraMode(true);

                    // Set new camera position
                    GameBrain.cameraManager.setPosition(0, 5, 10);

                    // Set device orientation controls
                    GameBrain.controlsManager.initDeviceOrientation(this.cameraManager.camera);
                }),
            ];
            this._debugPanel.addButtons(debugButtonsArray);
        }

        this._raycasterManager = new RaycasterManager(this._debugMode);

        let cover = document.getElementById("cover");


        document.addEventListener("sound_ready", (e) => {
            //When sounds are ready, we can build our data manager

            DATA.setupManagers();

            //DATA.ui_manager.get("notes").show();

            //Debug pickup
            DATA.data_manager.get("instagram", "post-1").pickedUp();

            this._debugMode && Object.entries(DATA.ui_manager.ui_list).forEach(value =>  GameBrain.gui.add({add: () => {   DATA.ui_manager.get(value[0]).show()  }},'add').name('ui:' + value[0]));
            this._debugMode && Object.entries(DATA.conclusion_manager.list).forEach(value =>  GameBrain.gui.add({add: () => {   DATA.conclusion_manager.show(value[1].id)  }},'add').name('conc:' + value[1].id));
        });

        cover.addEventListener("click", () => {
            cover.remove();

            //Setup audio list here
            // AudioManager.play("birds");

            this._debugMode && this._debuglogs.addLog("Not looping birds, for your ears to survive...");

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

            setTimeout(() => {

                GameBrain.sceneryManager.setActiveScenery("BistroScenery");

            }, 2000);

        }, 5000);

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
            new Model('Bistro', 'models/colleuses.glb', 1),
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

        // -- Scenery 3 - Bistro
        geometries = [
            // GameBrain.geometryManager.createColorSkybox(0x000000, 1500), // Skybox
        ];

        models = [
            new Model('BistroEnvironment', 'models/bar.glb', 1),
        ];

        lights = [
            GameBrain.lightingManager.createSpotLight({
                identifier: "BistroSpotLight",
                angle: 0,
                distance: 500,
            })
        ];

        GameBrain.sceneryManager.addScenery(
            new Scenery({
                    identifier: "BistroScenery",
                    basePosition: {x: 0, y: 0, z: 3000},
                    geometries: geometries,
                    models: models,
                    lights: lights,
                    cameraPosition: {x: 0, y: 40, z: 0},
                    fog: false,
                    onLoadDone: () => {
                        console.log("BistroScenery loading done");
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
        //if we touch a letter
        if (identifier.match(new RegExp("^(letter-)"))) {
            let letter = DATA.data_manager.get("letter", identifier);
            if (letter != null)
                letter.pickedUp();
        }

        //specific cases
        switch (identifier) {
            case "IceTruck": {
                break;
            }
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
