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
import SoundManager from "./SoundManager/SoundManager";
import {DebugPanel, DebugButton} from "./Debug/DebugPanel";
import {Vector3} from "three";

export default class Game {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor.
     * Inits all components ans starts the loop.
     * @param isDebugMode
     * @param highPerf
     */
    constructor(isDebugMode = true, highPerf = false) {
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
        this.soundManager = new SoundManager(this._debugMode);
        this.sceneManager = new SceneManager(this._debugMode);
        this._raycasterManager = new RaycasterManager(this._debugMode);

        let cover = document.getElementById("cover");

        cover.addEventListener("click", () => {
            cover.remove();

            // Init sound here
            this.soundManager.createGenericAudio("Birds", 'sounds/birds.mp3', true, false);
            this._debugMode && this._debuglogs.addLog("Not looping birds, for your ears to survive...");

            // On iOS13 + devices, ask for device orientation events permission
            // https://medium.com/flawless-app-stories/how-to-request-device-motion-and-orientation-permission-in-ios-13-74fc9d6cd140
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
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
     * Creates the scene & creates essentials.
     */
    init() {
        // Renderer init
        this.renderer = new THREE.WebGLRenderer({
            antialias: this._highPerf
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Basic geometries
        const geometries = [
            this.geometryManager.createBasicGroundSurface("Ground", "textures/grass_dirt.jpg"), // Ground
            this.geometryManager.createCubeSkybox("textures/sky/orange/"), // Skybox
            this.geometryManager.createBasicShape({
                identifier: "GreenCube",
                position: {x: -.5, y: .5, z: 2.5}
            }),
            this.geometryManager.createBasicShape({
                identifier: "BlueWall",
                color: 0x4287f5,
                position: {x: 0, y: 2.5, z: -11},
                size: {x: 10, y: 5, z: 1}
            }),
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
            })
        ];

        // 3D Models
        const models = [
            new Model('Fox', 'models/Fox.glb', .02),
            new Model('IceTruck', 'models/CesiumMilkTruck.glb', 1.5, {x: -5, y: 0, z: 0})
        ];

        // Lights
        this.lightingManager.createSpotLight({
            identifier: "MainSpotLight",
            intensity: 1,
            position: {x: 20, y: 20, z: 0},
            angle: .5
        });

        this.geometryManager.loadGeometries(geometries);

        this.modelManager.loadModels(models, () => {
            // Scene init
            this.sceneManager.addThings(this.geometryManager.geometries);
            this.sceneManager.addThings(this.modelManager.models);
            this.sceneManager.addThings(this.lightingManager.lights);

            // Camera init
            this.cameraManager.setPosition(0, 5, 10);
            this.cameraManager.lookAtSomething(new THREE.Vector3(0, 5, 0));

            // Controls init
            this.controlsManager.initDeviceOrientation(this.cameraManager.camera);

            // Get reference of fox and change position
            let fox = this.modelManager.getModelReferenceByIdentifier('Fox');
            fox.position.x = 2;

            // Start loop!
            this._loop();
        });
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
        this._debuglogs.addLog("RayCast -> " + touchedElementIdentifier);
        console.log(touchedElementIdentifier);
    }

    // ------------------------------------------------------------------- RENDER

    /**
     * Render loop.
     * @private
     */
    _loop() {
        requestAnimationFrame(this._loop.bind(this));

        this._debugMode && this.stats.begin();

        this.controlsManager.controls.update(this._clock.getDelta()); // Only for device orientation controls
        this.renderer.render(this.sceneManager.scene, this.cameraManager.camera);

        this._debugMode && this.stats.end();
    }
}
