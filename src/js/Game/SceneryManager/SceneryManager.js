import GameBrain from "../GameManager/GameManager";
import * as THREE from 'three';
import gsap from "gsap";

class Scenery {
    constructor({
                    identifier = "Default",
                    basePosition = {x: 0, y: 0, z: 0},
                    rotation = {x: 0, y: 0, z: 0},
                    geometries = [],
                    models = [],
                    lights = [],
                    cameraPosition = {x: 0, y: 0, z: 0},
                    fog = false,
                    canMove = true,
                    ambiantSoundIdentifier = "Default",
                    orbitControls = true,
                    onLoadDone = () => null
                }) {
        this.identifier = identifier;
        this.basePosition = basePosition;
        this.rotation = rotation;
        this.geometries = geometries;
        this.models = models;
        this.lights = lights;
        this.cameraPosition = cameraPosition;
        this.fog = fog;
        this.canMove = canMove;
        this.ambiantSoundIdentifier = ambiantSoundIdentifier;
        this.orbitControls = orbitControls;
        this.onLoadDone = onLoadDone;
        this.loaded = false;
    }
}

class SceneryManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor.
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🌈 SceneryManager constructor');

        this._debugMode = isDebugMode;

        this._sceneries = [];
    };

    // ------------------------------------------------------------------- MAKE

    /**
     * Add a scenery to the list.
     * @param scenery
     */
    addScenery(scenery) {
        this._sceneries.push(scenery);
    }

    /**
     * Load the scenery specified by identifier.
     * @param sceneryIdentifier
     * @param callback
     */
    loadScenery(sceneryIdentifier, callback = () => null) {
        const queued = this.getSceneryReferenceByIdentifier(sceneryIdentifier);
        if (queued !== null) {

            // Set position of geometries
            queued.geometries.forEach((geometry) => {
                geometry.position.x += queued.basePosition.x;
                geometry.position.y += queued.basePosition.y;
                geometry.position.z += queued.basePosition.z;
            });

            // Set position of models
            queued.models.forEach((model) => {
                model.initialPosition.x += queued.basePosition.x;
                model.initialPosition.y += queued.basePosition.y;
                model.initialPosition.z += queued.basePosition.z;
            });

            // Set position of lights
            queued.lights.forEach((light) => {
                light.position.x += queued.basePosition.x;
                light.position.y += queued.basePosition.y;
                light.position.z += queued.basePosition.z;

                if(this._debugMode) {
                    let spotLightHelper = new THREE.SpotLightHelper(light);
                    spotLightHelper.identifier = light.identifier + "-helper";
                    GameBrain.lightingManager.lights.push(spotLightHelper);
                }
            });

            // Load geometries
            queued.geometries.length > 0 && GameBrain.geometryManager.loadGeometries(queued.geometries);

            // Load models & add to scene
            if(queued.models.length > 0) {
                GameBrain.modelManager.loadModels(queued.models, () => {
                    addToScene();
                });
            }
            else {
                addToScene();
            }

            function addToScene() {
                GameBrain.sceneManager.addThings(GameBrain.geometryManager.geometries);
                GameBrain.sceneManager.addThings(GameBrain.modelManager.models);
                GameBrain.sceneManager.addThings(GameBrain.lightingManager.lights);

                queued.loaded = true;
                queued.onLoadDone();
            }

        } else {
            console.error("Scenery " + sceneryIdentifier + " not found.");
        }
    }

    startSceneryTransition(sceneryIdentifier, duration = 1) {

        // Fade in
        gsap.to("#transition", {
            autoAlpha: 1,
            duration: duration,
            onComplete: () => {

                // Set active scenery
                this.setActiveScenery(sceneryIdentifier);

                // Fade out
                gsap.to("#transition", {
                    autoAlpha: 0,
                    duration: duration,
                    delay: duration
                });
            }
        });
    }

    /**
     * Set the active scenery.
     * @param sceneryIdentifier
     */
    setActiveScenery(sceneryIdentifier) {
        const scenery = this.getSceneryReferenceByIdentifier(sceneryIdentifier);

        if (scenery.loaded) {
            // TODO Fade Out -> In

            // Set controls
            GameBrain.controlsManager.controls.dispose();
            if (scenery.orbitControls) {
                GameBrain.cameraManager.setCameraMode(true);
                GameBrain.controlsManager.initDeviceOrientation(GameBrain.cameraManager.camera);
            } else {
                // Map controls
                GameBrain.cameraManager.setCameraMode(false);
                GameBrain.controlsManager.initMapControls(GameBrain.cameraManager.camera, GameBrain.renderer.domElement);
                GameBrain.controlsManager.targetTo("MapEnvironment");
            }

            // Set fog
            GameBrain.sceneManager.scene.fog = null;
            if (scenery.fog) {
                GameBrain.sceneManager.scene.fog = new THREE.FogExp2(0x000000, 0.0025);
            }

            // Set camera
            GameBrain.cameraManager.setPosition(
                scenery.cameraPosition.x + scenery.basePosition.x,
                scenery.cameraPosition.y + scenery.basePosition.y,
                scenery.cameraPosition.z + scenery.basePosition.z
            );

            // Play sound

            // Start animations
        }
    }

    // ------------------------------------------------------------------- GETTERS

    get sceneries() {
        return this._sceneries;
    }

    getSceneryReferenceByIdentifier(identifier) {
        for (let scenery of this._sceneries) {
            if (scenery.identifier === identifier) return scenery; // Reference
        }
        return null;
    }

}

export {Scenery, SceneryManager};
