import * as THREE from 'three';
import Stats from 'stats-js';
import * as dat from 'dat.gui';

import CameraManager from './CameraManager/CameraManager';
import ControlsManager from './ControlsManager/ControlsManager';
import GeometryManager from './GeometryManager/GeometryManager';
import {ModelManager, Model} from './ModelManager/ModelManager';
import LightingManager from './LightingManager/LightingManager';
import SceneManager from './SceneManager/SceneManager';
import RaycasterManager from "./RaycasterManager/RaycasterManager";
import DebugLogs from "./Debug/DebugLogs";
import {DebugPanel, DebugButton} from "./Debug/DebugPanel";
import {Scene, Vector3} from "three";
import AudioManager from "../models/audio/audio-manager";
import {SceneryManager, Scenery} from "./SceneryManager/SceneryManager";

import {toRad} from './Util/Helpers';

export default class Game {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor.
     * Inits all components ans starts the loop.
     * @param isDebugMode
     * @param highPerf
     */
    constructor(isDebugMode = false, highPerf = false) {
        console.log('🎮 Game constructor');

        this._debugMode = isDebugMode;
        this._highPerf = highPerf;

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

        // Game components
        this.cameraManager = new CameraManager(this._debugMode);
        this.controlsManager = new ControlsManager(this._debugMode);
        this.geometryManager = new GeometryManager(this._debugMode);
        this.modelManager = new ModelManager(this._debugMode);
        this.lightingManager = new LightingManager(this._debugMode);
        this.sceneManager = new SceneManager(this._debugMode);
        this._raycasterManager = new RaycasterManager(this._debugMode);
        this._sceneryManager = new SceneryManager(this._debugMode);

        let cover = document.getElementById("cover");


        AudioManager.init();
        document.addEventListener("sound_ready", function (e) {
        });

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
                        if (response == 'granted') {
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

        // Event listeners
        window.addEventListener('resize', this.resizeViewport.bind(this)); // Resize
        window.addEventListener('touchend', this.onTouchEnd.bind(this)); // Get normalized position of mouse & do raycasr
    }

    /**
     * Creates the three scene & creates essentials.
     */
    init() {
        // Renderer init
        this.renderer = new THREE.WebGLRenderer({
            antialias: this._highPerf
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this._sceneryManager.lateInit(this.sceneManager, this.geometryManager, this.modelManager, this.cameraManager);

        this.initSceneries();

        this._sceneryManager.loadScenery("ColleusesScenery");

        console.log(this.sceneManager.scene);

        // Controls init
        this.controlsManager.initDeviceOrientation(this.cameraManager.camera);

        this.sceneManager.addThings(this.lightingManager.lights);

        // Start loop!
        this._loop();

        return;


        // FIXME à virer

        // Basic geometries
        const geometries = [
            // --EXAMPLES
            // this.geometryManager.createBasicGroundSurface("Ground", "textures/grass_dirt.jpg"), // Ground
            // this.geometryManager.createCubeSkybox("textures/sky/orange/"), // Skybox
            // this.geometryManager.createBasicShape({
            //     identifier: "GreenCube",
            //     position: {x: -.5, y: .5, z: 2.5}
            // }),
            // this.geometryManager.createBasicShape({
            //     identifier: "BlueWall",
            //     color: 0x4287f5,
            //     position: {x: 0, y: 2.5, z: -11},
            //     size: {x: 10, y: 5, z: 1}
            // }),

            // Map
            this.geometryManager.createBasicShape({
                identifier: "MapGround",
                color: 0xa6a6a6,
                position: {x: 0, y: -.5, z: 90},
                size: {x: 30, y: 0, z: 50}
            }),
            this.geometryManager.createBasicShape({
                identifier: "Building1",
                color: 0x4287f5,
                position: {x: 0, y: .5, z: 90}
            }),
            this.geometryManager.createBasicShape({
                identifier: "Building2",
                color: 0x4287f5,
                position: {x: -5, y: .5, z: 80},
                size: {x: 1, y: 5, z: 1}
            }),
            // this.geometryManager.createBasicShape({
            //     identifier: "MainSkyBox",
            //     color: 0xFFFFFF,
            //     position: {x: 0, y: 0, z: 0},
            //     size: {x: 100, y: 100, z: 100},
            //     doubleSided: true
            // })
        ];

        // 3D Models
        const models = [
            new Model('ColleusesScenery', 'models/colleuses.glb', 1, {x: 0, y: -20, z: 50}),
        ];

        // Lights
        this.lightingManager.createSpotLight({
            identifier: "MainSpotLight",
            intensity: 1,
            position: {x: 0, y: 20, z: 0},
            angle: 0
        });

        this.geometryManager.loadGeometries(geometries);

        this.modelManager.loadModels(models, () => {

            // Scene init
            this.sceneManager.addThings(this.geometryManager.geometries);
            this.sceneManager.addThings(this.modelManager.models);
            this.sceneManager.addThings(this.lightingManager.lights);

            // Camera init
            this.cameraManager.setPosition(0, 5, 10);
            // this.cameraManager.lookAtSomething(new THREE.Vector3(0, 5, 0));

            // Controls init
            this.controlsManager.initDeviceOrientation(this.cameraManager.camera);

            this.modelManager.getModelReferenceByIdentifier("ColleusesStreet").traverse((object) => {
                // if (object.isMesh) {
                //     object.material.polygonOffset = true;
                //     object.material.polygonOffsetFactor = -10.0;
                //     object.material.polygonOffsetUnits = -40.0;
                // }
            });
        });
    }

    /**
     * List all elements in different sceneries
     */
    initSceneries() {

        // -- SCENERIES

        // -- Scenery 3 - Colleuses
        let geometries = [
            // this.geometryManager.createCubeSkybox("textures/sky/orange/"), // Skybox
        ];

        let models = [
            new Model('ColleusesStreet', 'models/colleuses.glb', 1, {x: 0, y: 0, z: 0}),
        ];

        this._sceneryManager.addScenery(
            new Scenery({
                    identifier: "ColleusesScenery",
                    geometries: geometries,
                    models: models,
                    cameraPosition: {x: 0, y: 0, z: 10},
                    onLoadDone: () => {
                        this._sceneryManager.setActiveScenery("ColleusesScenery");
                    }
                }
            )
        );

    }

    // ------------------------------------------------------------------- CALLBACKS

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
            this.sceneManager.scene,
            this._mouse, this.cameraManager.camera
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

        // console.log(this.cameraManager.camera.position.x, this.cameraManager.camera.position.z);

        this.controlsManager.controls.update(this._clock.getDelta()); // Only for device orientation controls
        this.renderer.render(this.sceneManager.scene, this.cameraManager.camera);

        this._debugMode && this.stats.end();
    }
}
