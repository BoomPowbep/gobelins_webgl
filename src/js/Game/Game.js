import * as THREE from 'three';
import Stats from 'stats-js';

import {Model} from './ModelManager/ModelManager';
import RaycasterManager from "./RaycasterManager/RaycasterManager";
import DebugLogs from "./Debug/DebugLogs";

import DATA from "../models/data";

import {Scenery} from "./SceneryManager/SceneryManager";

import GameBrain from './GameManager/GameManager';
import AudioManager from "../models/audio/audio-manager";
import Pickup from "../models/ui/pickup/pickup";

import gsap from "gsap";
import {toRad} from "./Util/Helpers";
import TIMELINES from "../models/timeline/timeline-configs";


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

        // Clock used to update controls
        this._clock = new THREE.Clock();

        // Position of mouse
        this._mouse = new THREE.Vector2();

        // Create all instances
        GameBrain.init({debugMode: this._debugMode});

        // Init debug elements
        if (this._debugMode) {
            // Init Stats.js
            this.stats = new Stats();
            this.stats.showPanel(0); // 0 = print fps
            document.body.appendChild(this.stats.dom);

            this._debuglogs = new DebugLogs();
        }

        // Init racaster
        this._raycasterManager = new RaycasterManager(this._debugMode);


        let cover = document.getElementById("cover");

        document.addEventListener("sound_ready", (e) => {
            //When sounds are ready, we can build our data manager

            DATA.setupManagers();

            //DATA.ui_manager.get("notes").show();

            //Debug pickup
            DATA.data_manager.get("instagram", "post-1").pickedUp();
            Pickup.show("Vous avez ramassé 1 lettre manquante. Encore 10.", "letter-1");

            if (this._debugMode) {


                Object.entries(DATA.ui_manager.ui_list).forEach(value => GameBrain.gui.add({
                    add: () => {
                        DATA.ui_manager.get(value[0]).show()
                    }
                }, 'add').name('ui:' + value[0]));

                Object.entries(DATA.conclusion_manager.list).forEach(value => GameBrain.gui.add({
                    add: () => {
                        DATA.conclusion_manager.show(value[1].id)
                    }
                }, 'add').name('conc:' + value[1].id));


                const sceneriesIdentifiers = [
                    "ColleusesScenery",
                    "StreetScenery",
                    "BistroScenery",
                    "MapScenery",
                ];

                sceneriesIdentifiers.forEach((identifier) => {
                    GameBrain.gui.add({
                        tp: () => {
                            GameBrain.sceneryManager.startSceneryTransition(identifier);
                        }
                    }, 'tp').name('to ' + identifier);
                });
            }
        });

        // On user click, start game
        cover.addEventListener("click", () => {
            AudioManager.init();
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

            // FIXME put elsewhere
            document.querySelector("button[data-close-pickup]").addEventListener('click', () => {
                document.getElementById("pickup").classList.remove("active");
            });
        });


        window.addEventListener('touchend', this.onTouchEnd.bind(this)); // Get normalized position of mouse & do raycasr
    }

    /**
     * Creates the three scene & creates essentials.
     */
    init() {

        // Create sceneries
        this.initSceneries();

        /* -- Load first scenery -- */
        GameBrain.sceneryManager.loadScenery("StreetScenery");

        console.log("SCENE", GameBrain.sceneManager.scene);

        // Start loop!
        this._loop();
    }

    /**
     * List all elements in different sceneries
     */
    initSceneries() {

        // FIXME faire un système de chargement des éléments depuis du json avec une boucle !!

        let ready = 0;

        // -- SCENERIES

        // -- Scenery 2 - Rue
        let geometries = [
            GameBrain.geometryManager.createColorSkybox(0x000000, 1500, "StreetSkybox"), // Skybox
        ];

        const streetScaleFactor = 1;

        let models = [
            new Model({
                identifier: 'StreetEnvironment',
                path: 'models/FBX/Street.fbx',
                initialScaleFactor: streetScaleFactor
            }),
        ];

        let lights = [
            // GameBrain.lightingManager.createSpotLight({
            //     identifier: "StreetSpotLight",
            //     position: {x: 50, y: 150, z: -1000},
            //     intensity: 3
            // })
        ];

        GameBrain.sceneryManager.addScenery(
            new Scenery({
                    identifier: "StreetScenery",
                    basePosition: {x: 0, y: 0, z: 0},
                    geometries: geometries,
                    models: models,
                    lights: lights,
                    cameraPosition: {x: 0, y: 200, z: 0},
                    fog: false,
                    onLoadDone: () => {
                        // TIMELINES.begin.play();
                        ready++;
                        GameBrain.sceneryManager.loadScenery("ColleusesScenery");
                        checkElementsReady();
                    }
                }
            )
        );

        // -- Scenery 3 - Colleuses
        geometries = [
            GameBrain.geometryManager.createColorSkybox(0x000000, 1500, "ColleusesSkybox"), // Skybox

            // Letters
            GameBrain.geometryManager.createBasicShape({
                identifier: "letter-1",
                position: {x: 0, y: 15, z: -80},
                size: {x: 30, y: 30, z: 30},
                color: 0x28BDF5,
            }),
            GameBrain.geometryManager.createBasicShape({
                identifier: "letter-2",
                position: {x: 0, y: 15, z: 80},
                size: {x: 30, y: 30, z: 30},
                color: 0x28BDC5,
            }),
            GameBrain.geometryManager.createBasicShape({
                identifier: "letter-3",
                position: {x: -80, y: 15, z: 0},
                size: {x: 30, y: 30, z: 30},
                color: 0x28FDF5,
            }),
            GameBrain.geometryManager.createBasicShape({
                identifier: "letter-4",
                position: {x: 80, y: 15, z: 0},
                size: {x: 30, y: 30, z: 30},
                color: 0x2FFFF5,
            }),
        ];

        models = [
            new Model({
                identifier: 'ColleusesEnvironment',
                path: 'models/colleuses.glb',
                initialScaleFactor: 1,
                initialRotation: {
                    x: 0,
                    y: toRad(90),
                    z: 0
                }
            }),
        ];

        lights = [
            // GameBrain.lightingManager.createSpotLight({
            //     identifier: "ColleusesSpotLight",
            //     position: {x: 50, y: 150, z: -1000},
            //     intensity: 3
            // })
        ];

        GameBrain.sceneryManager.addScenery(
            new Scenery({
                    identifier: "ColleusesScenery",
                    basePosition: {x: 0, y: 3000, z: 0},
                    geometries: geometries,
                    models: models,
                    lights: lights,
                    cameraPosition: {x: 0, y: -25, z: 0},
                    fog: true,
                    onLoadDone: () => {
                        ready++;
                        GameBrain.sceneryManager.loadScenery("MapScenery");
                        checkElementsReady();
                    }
                }
            )
        );

        // -- Scenery 3 - Map
        geometries = [
            GameBrain.geometryManager.createColorSkybox(0x000000, 1500, "MapSkybox"), // Skybox

            GameBrain.geometryManager.createBasicShape({
                identifier: "map-interest-1",
                position: {x: -12, y: 1, z: 0},
                color: 0xF033FF,
            }),

            GameBrain.geometryManager.createBasicShape({
                identifier: "map-interest-2",
                position: {x: -3, y: 1, z: 8},
                color: 0xF033FF,
            }),

            GameBrain.geometryManager.createBasicShape({
                identifier: "map-interest-3",
                position: {x: -30, y: 1, z: -21},
                color: 0xF033FF,
            }),

            GameBrain.geometryManager.createBasicShape({
                identifier: "map-interest-final",
                position: {x: -6, y: 1, z: -21},
                color: 0xFF0000,
            }),
        ];

        models = [
            new Model({identifier: 'MapEnvironment', path: 'models/map.glb', initialScaleFactor: .005}),
        ];

        lights = [
            // GameBrain.lightingManager.createSpotLight({
            //     identifier: "MapSpotLight",
            //     angle: 0,
            //     distance: 500,
            // })
        ];

        GameBrain.sceneryManager.addScenery(
            new Scenery({
                    identifier: "MapScenery",
                    basePosition: {x: 3000, y: 0, z: 0},
                    geometries: geometries,
                    models: models,
                    lights: lights,
                    cameraPosition: {x: 50, y: 40, z: 50},
                    cameraLimits: {minX: 2970, maxX: 3000, minZ: -30, maxZ: 0},
                    fog: false,
                    orbitControls: false,
                    onLoadDone: () => {
                        ready++;
                        GameBrain.sceneryManager.loadScenery("BistroScenery");
                        checkElementsReady();
                    },
                    onSceneActive: (scene) => {
                        //show the final pointer on map only if everything is picked-up
                        let item = GameBrain.geometryManager.getGeometryReferenceByIdentifier("map-interest-final");
                        item.visible = DATA.data_manager.letters.hasPickupAll();

                        let item_interest2 = GameBrain.geometryManager.getGeometryReferenceByIdentifier("map-interest-2");
                        item_interest2.visible = DATA.data_manager.letters.hasPickupAllInScene(1);

                        let item_interest3 = GameBrain.geometryManager.getGeometryReferenceByIdentifier("map-interest-3");
                        item_interest3.visible = DATA.data_manager.letters.hasPickupAllInScene(2);
                    }
                }
            )
        );

        // -- Scenery 4 - Bistro
        geometries = [
            GameBrain.geometryManager.createColorSkybox(0x28BDF5, 1500, "BistroSkybox"), // Skybox
        ];

        models = [
            new Model({identifier: 'BistroEnvironment', path: 'models/bar.glb', initialScaleFactor: 1}),
        ];

        lights = [
            // GameBrain.lightingManager.createSpotLight({
            //     identifier: "BistroSpotLight",
            //     angle: 0,
            //     distance: 500,
            // })
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
                        ready++;
                        DATA.data_manager.get("instagram", "post-1").pickedUp();
                        checkElementsReady();
                    }
                }
            )
        );

        function checkElementsReady() {
            if (ready === 4) {
                GameBrain.sceneryManager.setActiveScenery("MapScenery");
                gsap.to("#loading", {
                    duration: 0,
                    autoAlpha: 0
                });
            }
        }
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

        // Get the element identifier
        const touchedElementIdentifier = this._raycasterManager.getTouchedElementIdentifier(
            GameBrain.sceneManager.scene,
            this._mouse, GameBrain.cameraManager.camera
        );
        this._debugMode && this._debuglogs.addLog("RayCast -> " + touchedElementIdentifier);
        this._debugMode && console.log(touchedElementIdentifier);

        // Process data
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
            if (letter != null) {
                letter.pickedUp();
                AudioManager.play("paper");
                Pickup.show("Vous avez ramassé 1 lettre manquante. Encore 10.", identifier)

                // Delete object from scene
                GameBrain.sceneManager.scene.remove(GameBrain.geometryManager.getGeometryReferenceByIdentifier(identifier));
            }
        }

        // Map
        switch (identifier) {
            case "map-interest-1":
                GameBrain.sceneryManager.setActiveScenery("ColleusesScenery");
                break;
            case "map-interest-2":
                GameBrain.sceneryManager.setActiveScenery("StreetScenery");
                break;
            case "map-interest-3":
                GameBrain.sceneryManager.setActiveScenery("BistroScenery");
                break;
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
