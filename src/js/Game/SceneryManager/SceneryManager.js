import GameBrain from "../GameManager/GameManager";
import * as THREE from 'three';

class Scenery {
    constructor({
                    identifier = "Default",
                    geometries = [],
                    models = [],
                    lights = [],
                    cameraPosition = {x: 0, y: 0, z: 0},
                    fog = false,
                    canMove = true,
                    ambiantSoundIdentifier = "Default",
                    onLoadDone = () => null
                }) {
        this.identifier = identifier;
        this.geometries = geometries;
        this.models = models;
        this.lights = lights;
        this.cameraPosition = cameraPosition;
        this.fog = fog;
        this.canMove = canMove;
        this.ambiantSoundIdentifier = ambiantSoundIdentifier;
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

        this._sceneries = [];
    };

    // ------------------------------------------------------------------- MAKE

    addScenery(scenery) {
        this._sceneries.push(scenery);
    }

    loadScenery(sceneryIdentifier) {
        const queued = this.getSceneryReferenceByIdentifier(sceneryIdentifier);
        if (queued !== null) {

            // Load geometries
            queued.geometries.length > 0 && GameBrain.geometryManager.loadGeometries(queued.geometries);

            // Load models
            queued.models.length > 0 && GameBrain.modelManager.loadModels(queued.models, () => {

                GameBrain.sceneManager.addThings(GameBrain.geometryManager.geometries);
                GameBrain.sceneManager.addThings(GameBrain.modelManager.models);
                GameBrain.sceneManager.addThings(GameBrain.lightingManager.lights);

                queued.loaded = true;
                queued.onLoadDone();
            });

        } else {
            console.error("Scenery " + sceneryIdentifier + " not found.");
        }
    }

    setActiveScenery(sceneryIdentifier) {
        const scenery = this.getSceneryReferenceByIdentifier(sceneryIdentifier);

        if (scenery.loaded) {
            // TODO Fade Out -> In

            // Set fog
            GameBrain.sceneManager.scene.fog = null;
            if(scenery.fog) {
                GameBrain.sceneManager.scene.fog = new THREE.FogExp2(0x000000, 0.0025);
            }

            // Set camera
            GameBrain.cameraManager.setPosition(
                scenery.cameraPosition.x,
                scenery.cameraPosition.y,
                scenery.cameraPosition.z
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
