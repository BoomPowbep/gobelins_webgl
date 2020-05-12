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
import {getRandomInt, toRad} from "./Util/Helpers";
import TIMELINES from "../models/timeline/timeline-configs";
import Notification from "../models/ui/mobile/notification";
import SlideContent from "../models/ui/slide-content";
import SCENE_EVENTS_VARS from "../models/scene-events-vars";
import VARS from "../models/vars";
import UserHand from "./UserHand";
import ControlsManager from "./ControlsManager/ControlsManager";
import Rewind from "./Util/Rewind";
import {gui} from "dat.gui";
import THREEx from "../threex.volumetricspotlightmaterial";


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
            /*this.stats = new Stats();
            this.stats.showPanel(0); // 0 = print fps*/
            //document.body.appendChild(this.stats.dom);

            this._debuglogs = new DebugLogs();
        }

        // Init racaster
        this._raycasterManager = new RaycasterManager(this._debugMode);


        let cover = document.querySelector("#cover button");

        let share = document.querySelectorAll(".share");
        share.forEach(value => {
            value.addEventListener('click', function (e) {
                if (navigator.share) {
                    navigator.share({
                        title: 'MURDHER',
                        text: 'Un crime a eu lieu... Résous l\'enquête !',
                        url: 'https://murdher.debalme.dev',
                    })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing', error));
                }
            })
        })

        /**
         * Evenement dispatch après avoir fermé une conclusion
         */
        document.addEventListener("close-conc", (e) => {
            switch (e.detail) {
                case "scene-1" : {
                    SlideContent.fromTo(VARS.HOURS.SCENE_1, VARS.HOURS.SCENE_2, () => {
                        SlideContent.hide();
                    }, 1500);
                    break;
                }
                case "scene-2" : {
                    SlideContent.fromTo(VARS.HOURS.SCENE_2, VARS.HOURS.SCENE_3, () => {
                        SlideContent.hide();
                    }, 1500);
                    break;
                }
                case "scene-3" : {
                    SlideContent.fromTo(VARS.HOURS.SCENE_3, VARS.HOURS.SCENE_FINAL, () => {
                        SlideContent.hide();
                    }, 1500);
                    break;
                }
            }
        });

        /**
         * Evenement dispatch après avoir ramassé une lettre
         */
        document.addEventListener("letter", (e) => {
            let letter = e.detail;
            let letters = DATA.data_manager.letters;

            AudioManager.play("paper");
            Pickup.show("letter", letter.identifier);

            if (letters.hasPickupAllInScene(letter.scene)) {
                TIMELINES.mapNotification.play();
            }
        });

        document.addEventListener("record", (e) => {
            let record = e.detail;

            AudioManager.play("paper");
            Pickup.show("record", record.identifier);
        });

        /**
         * Evenement dispatch après la fin du drag'n'drop
         */
        document.addEventListener("end-dragndrop", (e) => {
            DATA.is_gluing = false;

            TIMELINES.end.play();

            /*setTimeout(function () {
                GameBrain.controlsManager.controls.rotateAndFreeze({rotation: {x: (1.5), y:(36), z:(-44)}});
                setTimeout(function () {
                    SlideContent.fromTo(VARS.HOURS.SCENE_3, VARS.HOURS.SCENE_FINAL, () => {
                        SlideContent.hide();
                        //todo Intégrer la scène finale
                    }, 2000);
                }, 2000)
            }, 2000)*/
        });

        /**
         * Evenement dispatch quand tous les sons sont prêts
         */
        document.addEventListener("sound_ready", (e) => {
            //DATA.ui_manager.get("notes").show();

            //Debug pickup
            //DATA.data_manager.get("instagram", "post-1").pickedUp();

            if (this._debugMode) {


                /*Object.entries(DATA.ui_manager.ui_list).forEach(value => GameBrain.gui.add({
                    add: () => {
                        DATA.ui_manager.get(value[0]).show()
                    }
                }, 'add').name('ui:' + value[0]));

                Object.entries(DATA.conclusion_manager.list).forEach(value => GameBrain.gui.add({
                    add: () => {
                        DATA.conclusion_manager.show(value[1].id)
                    }
                }, 'add').name('conc:' + value[1].id));

                (DATA.data_manager.letters.items).forEach(value => GameBrain.gui.add({
                    add: () => {
                        let el = DATA.data_manager.get('letter', value.identifier);
                        el.pickedUp();
                    }
                }, 'add').name('letter:' + value.identifier));*/


                const sceneriesIdentifiers = [
                    "ColleusesScenery",
                    "StreetScenery",
                    "BistroScenery",
                    "MapScenery",
                    "ComissariatScenery"
                ];

                sceneriesIdentifiers.map((identifier) => {
                    GameBrain.gui.add({
                        tp: () => {
                            GameBrain.sceneryManager.startSceneryTransition(identifier);
                        }
                    }, 'tp').name('to ' + identifier.replace("Scenery", ""));
                });
            }
        });

        // On user click, start game
        cover.addEventListener("click", () => {
            AudioManager.init();
            cover.parentElement.remove();

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
            document.querySelector("#pickup").addEventListener('click', () => {
                document.getElementById("pickup").classList.remove("active");
            });
        });


        window.addEventListener('touchend', this.onTouchEnd.bind(this)); // Get normalized position of mouse & do raycasr
        window.addEventListener('touchstart', this.onTouchStart.bind(this)); // Get normalized position of mouse & do raycasr
    }

    /**
     * Creates the three scene & creates essentials.
     */
    init() {
        //When sounds are ready, we can build our data manager
        DATA.setupManagers();

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
            GameBrain.geometryManager.createColorSkybox(0x000000, 1500, "StreetSkybox"), // Skybox,
            GameBrain.geometryManager.createBasicSprite({
                identifier: "button",
                texture: "textures/button.png",
                facingCamera: false,
                size: {x: 4, y: 2, z: 0.1},
                rotation: {x: toRad(0), y: toRad(-90), z: toRad(0)},
                position: {x: 120, y: 65, z: 270}
            })
        ];

        let models = [
            new Model({
                identifier: 'StreetEnvironment',
                path: 'models/FBX/Street.fbx',
                initialScaleFactor: 1
            }),
            new Model({
                identifier: 'letter-1',
                path: 'models/FBX/Boulette_Red.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: 120,
                    y: 50,
                    z: 260
                }
            })
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
                    cameraPosition: {x: 100, y: 70, z: 260},
                    fog: true,
                    onLoadDone: () => {
                        ready++;
                        UserHand.createElements();
                        GameBrain.sceneryManager.loadScenery("ColleusesScenery");
                        checkElementsReady();
                    },
                    onSceneActive: (scene) => {
                        let item = GameBrain.geometryManager.getGeometryReferenceByIdentifier("button");
                        item.visible = DATA.data_manager.letters.hasPickupAll();
                        scene.add(GameBrain.cameraManager.camera);

                        SCENE_EVENTS_VARS.end();
                    }
                }
            )
        );

        // -- Scenery 3 - Colleuses
        geometries = [
            GameBrain.geometryManager.createColorSkybox(0x000000, 1500, "ColleusesSkybox"), // Skybox
        ];

        models = [
            new Model({
                identifier: 'ColleusesEnvironment',
                path: 'models/FBX/Colleuses.fbx',
                initialScaleFactor: 1,
                initialRotation: {
                    x: 0,
                    y: toRad(90),
                    z: 0
                }
            }),
            new Model({
                identifier: 'letter-4',
                path: 'models/FBX/Boulette.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: 38,
                    y: 21,
                    z: 27
                }
            }),
            new Model({
                identifier: 'letter-5',
                path: 'models/FBX/Boulette.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: 38,
                    y: 21,
                    z: 27
                }
            }),
        ];

        lights = [
            GameBrain.lightingManager.createSpotLight({
                identifier: "ColleusesSpotLight-0",
                position: {x: 80, y: 35, z: -480},
                target: {x: 78, y: 0, z: -480},
                intensity: 10,
                angle: .4,
                distance: 210
            }),

            GameBrain.lightingManager.createSpotLight({
                identifier: "ColleusesSpotLight-1",
                position: {x: 80, y: 35, z: -195},
                target: {x: 78, y: 0, z: -195},
                intensity: 10,
                angle: .4,
                distance: 210
            }),

            GameBrain.lightingManager.createSpotLight({
                identifier: "ColleusesSpotLight-2",
                position: {x: 80, y: 35, z: 0},
                target: {x: 78, y: 0, z: 0},
                intensity: 10,
                angle: .4,
                distance: 210
            }),

            GameBrain.lightingManager.createSpotLight({
                identifier: "ColleusesSpotLight-3",
                position: {x: 80, y: 35, z: 195},
                target: {x: 78, y: 0, z: 195},
                intensity: 10,
                angle: .4,
                distance: 210
            }),

            GameBrain.lightingManager.createSpotLight({
                identifier: "ColleusesSpotLight-4",
                position: {x: 80, y: 35, z: 480},
                target: {x: 78, y: 0, z: 480},
                intensity: 10,
                angle: .4,
                distance: 210
            }),
        ];

        GameBrain.sceneryManager.addScenery(
            new Scenery({
                    identifier: "ColleusesScenery",
                    basePosition: {x: 0, y: 3000, z: 0},
                    geometries: geometries,
                    models: models,
                    lights: lights,
                    cameraPosition: {x: 0, y: -25, z: 40},
                    fog: true,
                    onLoadDone: () => {
                        ready++;
                        GameBrain.sceneryManager.loadScenery("MapScenery");
                        checkElementsReady();
                    },
                    onSceneActive: (scene) => {
                        SCENE_EVENTS_VARS.sceneColleuse();
                    }
                }
            )
        );

        // -- Scenery 3 - Map
        geometries = [
            GameBrain.geometryManager.createColorSkybox(0x000000, 1500, "MapSkybox"), // Skybox

            GameBrain.geometryManager.createBasicSprite({
                identifier: "map-interest-1",
                position: {x: -12, y: 2, z: 0},
                size: {x: 2, y: 2, z: 2},
                texture: GameBrain.mapSprites.here
            }),

            GameBrain.geometryManager.createBasicSprite({
                identifier: "map-interest-2",
                position: {x: -3, y: 1, z: 8},
                size: {x: 2, y: 2, z: 2},
                texture: GameBrain.mapSprites.here
            }),

            GameBrain.geometryManager.createBasicSprite({
                identifier: "map-interest-3",
                position: {x: -30, y: 1, z: -21},
                size: {x: 2, y: 2, z: 2},
                texture: GameBrain.mapSprites.here
            }),

            GameBrain.geometryManager.createBasicSprite({
                identifier: "map-interest-final",
                position: {x: -6, y: 1, z: -21},
                size: {x: 2, y: 2, z: 2},
                texture: GameBrain.mapSprites.here
            }),
        ];

        models = [
            new Model({
                identifier: 'MapEnvironment',
                path: 'models/FBX/Map.fbx',
                initialScaleFactor: .005
            }),
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
                    updateLastScenery: false,
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
                        DATA.ui_manager.active('maps');

                        let pickupAll = DATA.data_manager.letters.hasPickupAll();
                        let introductionFinish = DATA.data_manager.letters.hasPickupAllInScene(0);
                        let barFinish = DATA.data_manager.letters.hasPickupAllInScene(1);
                        let colleuseFinish = DATA.data_manager.letters.hasPickupAllInScene(2);
                        let policeFinish = DATA.data_manager.letters.hasPickupAllInScene(3);

                        let active = GameBrain.sceneryManager.getLastScenery();

                        //show the final pointer on map only if everything is picked-up
                        let item = GameBrain.geometryManager.getGeometryReferenceByIdentifier("map-interest-final");
                        let item_interest1 = GameBrain.geometryManager.getGeometryReferenceByIdentifier("map-interest-1");
                        let item_interest2 = GameBrain.geometryManager.getGeometryReferenceByIdentifier("map-interest-2");
                        let item_interest3 = GameBrain.geometryManager.getGeometryReferenceByIdentifier("map-interest-3");

                        //Affichage conditionel des pointeurs
                        item_interest1.visible = DATA.data_manager.letters.hasPickupAllInScene(0);
                        item_interest2.visible = DATA.data_manager.letters.hasPickupAllInScene(1);
                        item_interest3.visible = DATA.data_manager.letters.hasPickupAllInScene(2);

                        //Contneud des pointeurs
                        item_interest1.material.map = (active === VARS.SCENERIES.BAR) ?
                            GameBrain.mapSprites.here :
                            ((barFinish) ?
                                GameBrain.mapSprites.green :
                                GameBrain.mapSprites.red);
                        item_interest2.material.map = (active === VARS.SCENERIES.COLLEUSE) ?
                            GameBrain.mapSprites.here :
                            ((colleuseFinish) ?
                                GameBrain.mapSprites.green :
                                GameBrain.mapSprites.red);
                        item_interest3.material.map = (active === VARS.SCENERIES.POLICE) ?
                            GameBrain.mapSprites.here :
                            ((policeFinish) ?
                                GameBrain.mapSprites.green :
                                GameBrain.mapSprites.red);

                        item.material.map = (active === VARS.SCENERIES.STREET) ?
                            GameBrain.mapSprites.here :
                            ((introductionFinish && !policeFinish) ? // si il a pas fini la police on le garde vert, sinon il doit y retourner
                                GameBrain.mapSprites.green :
                                GameBrain.mapSprites.red);
                    }
                }
            )
        );

        // -- Scenery 4 - Bistro
        // Première scène de jeu
        geometries = [
            GameBrain.geometryManager.createColorSkybox(0x28BDF5, 1500, "BistroSkybox"), // Skybox

            GameBrain.geometryManager.createCircleShape({
                identifier: "BistroConversationGauge",
                radius: 1,
                position: {x: -10, y: 38, z: 1},
                rotation: {x: 0, y: toRad(90), z: 0},
                color: 0xFFFFFF
            }),
            GameBrain.geometryManager.createBasicSprite({
                identifier: "BistroConversationSprite",
                position: {x: -9.9, y: 38, z: 1},
                size: {x: 1.5, y: 1.5, z: 1},
                rotation: {x: 0, y: toRad(90), z: 0},
                facingCamera: false,
                texture: GameBrain.mapSprites.vocal
            }),
        ];

        models = [
            new Model({identifier: 'BistroEnvironment', path: 'models/FBX/Bar.fbx', initialScaleFactor: 1}),

            new Model({
                identifier: 'letter-2',
                path: 'models/FBX/Boulette.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: 38,
                    y: 21,
                    z: 27
                }
            }),
            new Model({
                identifier: 'letter-3',
                path: 'models/FBX/Boulette.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: -4,
                    y: 15,
                    z: 87
                }
            })
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
                        GameBrain.sceneryManager.loadScenery("ComissariatScenery");
                        checkElementsReady();

                        // Change windows material
                        // let sceneModel = GameBrain.modelManager.getModelReferenceByIdentifier("BistroEnvironment");
                        // if (sceneModel) {
                        //     sceneModel.children.map((child) => {
                        //         if (child.isMesh) {
                        //             if(child.name.includes("Vitre")) {
                        //                 child.material.emissive = 0x111111;
                        //                 child.material.envMap = GameBrain.cameraManager.camera.renderTarget;
                        //             }
                        //         }
                        //     });
                        // }
                    },
                    onSceneActive: (scene) => {
                        SCENE_EVENTS_VARS.sceneBistro();
                    }
                }
            )
        );

        function setupDatGUIModels() {
            let editedElement = GameBrain.modelManager.getModelReferenceByIdentifier('letter-1');
            let identifier = {model: ""};
            let elementSelector = GameBrain.gui.add(identifier, 'model', ['letter-1', 'letter-2', 'letter-3', 'letter-4', 'letter-5', 'letter-6', 'letter-7', 'letter-8', "map-interest-1", "map-interest-2", "map-interest-3", "map-interest-final"]);

            let x_element = null;
            let y_element = null;
            let z_element = null;

            function makeSliderFor(el) {
                if (x_element !== null) {
                    GameBrain.gui.remove(x_element);
                    GameBrain.gui.remove(y_element);
                    GameBrain.gui.remove(z_element);
                }

                x_element = GameBrain.gui.add(el.position, 'x', el.position.x - 100, el.position.x + 100);
                y_element = GameBrain.gui.add(el.position, 'y', el.position.y - 30, el.position.y + 30);
                z_element = GameBrain.gui.add(el.position, 'z', el.position.z - 100, el.position.z + 100);
            }

            makeSliderFor(editedElement);

            elementSelector.onChange((value) => {
                //si la réf par model existe
                let toEdit = GameBrain.modelManager.getModelReferenceByIdentifier(value);
                if (toEdit !== null) {
                    editedElement = toEdit;
                    makeSliderFor(editedElement);
                    return;
                }
                //si la réf par geometry existe
                let toEditGeometry = GameBrain.geometryManager.getGeometryReferenceByIdentifier(value);
                if (toEditGeometry !== null) {
                    editedElement = toEditGeometry;
                    makeSliderFor(editedElement);
                    return;
                }
            });
        }

        // -- Scenery 5 - Comissariat
        geometries = [
            GameBrain.geometryManager.createColorSkybox(0x000000, 2000, "ComissariatSkybox"), // Skybox
        ];

        models = [
            new Model({
                identifier: 'ComissariatEnvironment',
                path: 'models/FBX/Comissariat.fbx',
                initialScaleFactor: 1
            }),

            new Model({
                identifier: 'letter-6',
                path: 'models/FBX/Boulette.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: 5.5, y: -55, z: -62
                }
            }),
            new Model({
                identifier: 'letter-7',
                path: 'models/FBX/Boulette.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: 60, y: -15, z: 4
                }
            }),
            new Model({
                identifier: 'letter-8',
                path: 'models/FBX/Boulette.fbx',
                initialScaleFactor: 0.01,
                initialPosition: {
                    x: -96, y: -15, z: -100
                }
            }),
            new Model({
                identifier: 'Kangoo',
                path: 'models/FBX/Kangoo.fbx',
                initialScaleFactor: 4,
                initialPosition: {x: 0, y: -100000, z: 0},
                initialRotation: {x: 0, y: toRad(-90), z: 0}
            }),
        ];

        lights = [
            // GameBrain.lightingManager.createSpotLight({
            //     identifier: "ComissariatSpotLight-0",
            //     position: {x: 38, y: 41, z: 10},
            //     target: {x: 38, y: 0, z: 10},
            //     intensity: 100,
            //     angle: .03,
            //     distance: 15,
            //     radiusTop: .6,
            //     attenuationFactor: 3.0,
            // }),
        ];

        GameBrain.sceneryManager.addScenery(
            new Scenery({
                    identifier: "ComissariatScenery",
                    basePosition: {x: 0, y: 0, z: -3000},
                    geometries: geometries,
                    models: models,
                    lights: lights,
                    cameraPosition: {x: 0, y: 40, z: 0},
                    fog: false,
                    onLoadDone: (scenery) => {
                        ready++;
                        checkElementsReady();

                        let sceneModel = GameBrain.modelManager.getModelReferenceByIdentifier("ComissariatEnvironment");
                        let kangoo = GameBrain.modelManager.getModelReferenceByIdentifier("Kangoo");

                        if (sceneModel) {
                            sceneModel.children.map((child) => {
                                if (child.isMesh) {
                                    if (child.name.includes("Cone")) {
                                        child.material = new THREEx.VolumetricSpotLightMaterial();
                                        child.material.uniforms.lightColor.value.set('white');
                                        child.material.uniforms.spotPosition.value = child.position;
                                        child.material.uniforms.attenuationFactor.value = 800.0;
                                    } else if (child.name.includes("Cube")) {
                                        child.material.transparent = true;
                                        child.material.opacity = 0.3;
                                        let newKangoo = kangoo.clone();
                                        newKangoo.identifier = kangoo.identifier;
                                        newKangoo.position.x = child.position.x + scenery.basePosition.x - 75;
                                        newKangoo.position.y = child.position.y + scenery.basePosition.y;
                                        newKangoo.position.z = child.position.z + scenery.basePosition.z + 20;
                                        GameBrain.sceneManager.scene.add(newKangoo);
                                    }
                                }
                            });
                        }
                    },
                    onSceneActive: (scene) => {
                        SCENE_EVENTS_VARS.scenePolice();
                    }
                }
            )
        );

        function checkElementsReady() {
            const duration = 1;
            let total = GameBrain.sceneryManager._sceneries.length;

            if (ready === total) {
                GameBrain.sceneryManager.startSceneryTransition("StreetScenery", duration);

                gsap.to("#loading", {
                    duration: duration / 2,
                    autoAlpha: 0
                });

                setupDatGUIModels();

               // setTimeout(() => {
                    SlideContent.introduction();
                //}, 500);
            } else {
                gsap.to("#loading .progress-bar div", {
                    duration: duration / 2,
                    width: (ready / total * 150)
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
        this._debugMode && this._debuglogs.addLog("Rcast End -> " + touchedElementIdentifier);
        this._debugMode && console.log(touchedElementIdentifier);

        // Process data
        this.postEndTouchEventAction(touchedElementIdentifier, this._mouse.x, this._mouse.y);
    }


    /**
     * Touch event callback.
     * @param event
     */
    onTouchStart(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this._mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        this._mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

        // Get the element identifier
        const touchedElementIdentifier = this._raycasterManager.getTouchedElementIdentifier(
            GameBrain.sceneManager.scene,
            this._mouse, GameBrain.cameraManager.camera
        );
        this._debugMode && this._debuglogs.addLog("Rcast Start -> " + touchedElementIdentifier);
        this._debugMode && console.log(touchedElementIdentifier);

        // Process data
        this.postStartTouchEventAction(touchedElementIdentifier, this._mouse.x, this._mouse.y);
    }

    /**
     * Perform action after touch event.
     * @param identifier
     *
     * @param posX
     * @param posY
     */
    postStartTouchEventAction(identifier, posX, posY) {
        //Drag'n'Drop
        if (DATA.is_gluing) {
            DATA.drag_start_y = posY;
            DATA.drag_element = identifier;
        }

        GameBrain.listenings.forEach(value => {
            if (value.starter_geometry_id === identifier) {
                value.touchStart();
            }
        });
    }

    /**
     * Perform action after touch event.
     * @param identifier
     * @param posX
     * @param posY
     */
    postEndTouchEventAction(identifier, posX, posY) {
        //Drag'n'Drop
        if (DATA.is_gluing) {
            let delta = posY - DATA.drag_start_y;
            if (delta >= VARS.DRAG_N_DROP_DELTA) {
                //On execute une action de drag'n'drop (on recolle le papier)
                this._debugMode && this._debuglogs.addLog("Drag'n'Drop");

                if (UserHand.isDragable(DATA.drag_element)) {
                    UserHand.putOnScene(DATA.drag_element);
                }

                return;
            }
        }

        if (DATA.can_pick) {
            //if we touch a letter
            if (identifier.match(new RegExp("^(letter-)"))) {
                let letter = DATA.data_manager.get("letter", identifier);
                if (letter != null) {
                    letter.pickedUp();

                    // Delete object from scene
                    GameBrain.sceneManager.scene.remove(GameBrain.modelManager.getModelReferenceByIdentifier(identifier));
                }
            }
        }

        // Map
        switch (identifier) {
            case "map-interest-final":
                GameBrain.sceneryManager.startSceneryTransition(VARS.SCENERIES.STREET);
                break;
            case "map-interest-1":
                GameBrain.sceneryManager.startSceneryTransition(VARS.SCENERIES.BAR);
                break;
            case "map-interest-2":
                GameBrain.sceneryManager.startSceneryTransition(VARS.SCENERIES.COLLEUSE);
                break;
            case "map-interest-3":
                GameBrain.sceneryManager.startSceneryTransition(VARS.SCENERIES.POLICE);
                break;
            case "button":
                GameBrain.sceneManager.scene.remove(GameBrain.geometryManager.getGeometryReferenceByIdentifier("button"));
                DATA.is_gluing = true;
                UserHand.show();
                break;
            default:
                break;
        }

        GameBrain.listenings.forEach(value => {
            value.touchEnd();
        });
    }

    // ------------------------------------------------------------------- RENDER

    /**
     * Render loop.
     * @private
     */
    _loop() {
        requestAnimationFrame(this._loop.bind(this));

        //this._debugMode && this.stats.begin();

        GameBrain.controlsManager.controls.update(this._clock.getDelta()); // Only for device orientation controls
        GameBrain.renderer.render(GameBrain.sceneManager.scene, GameBrain.cameraManager.camera);

        //this._debugMode && this.stats.end();
    }
}
