import * as THREE from 'three';

export default class LightingManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor.
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🔦 LightingManager constructor');

        this._debugMode = isDebugMode;

        this._lights = [];

        this._createAmbientLight();
    };

    // ------------------------------------------------------------------- MAKE

    /**
     * Create a spot light.
     * https://threejs.org/examples/#webgl_lights_spotlight
     * @param color
     * @param intensity
     * @param position
     * @param angle
     * @param distance
     * @param penumbra
     * @param decay
     */
    createSpotLight({
                        identifier,
                        color = 0xFFFFFF,
                        intensity = 1,
                        position = {x: 0, y: 40, z: 0},
                        angle = .3,
                        distance = 50,
                        penumbra = .2,
                        decay = 1.2
                    }) {
        let spotLight = new THREE.SpotLight(color, intensity);

        // Adding identifier property
        spotLight.identifier = identifier;

        spotLight.position.set(position.x, position.y, position.z);

        spotLight.angle = angle;
        spotLight.distance = distance;
        spotLight.penumbra = penumbra;
        spotLight.decay = decay;

        // spotLight.castShadow = true;
        // spotLight.shadowCameraVisible = true;

        spotLight.shadow.camera.near = .01;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        this._registerLight(spotLight);

        if (this._debugMode) {
            let spotLightHelper = new THREE.SpotLightHelper(spotLight);
            this._registerLight(spotLightHelper);
        }
    }

    /**
     * Create a basic generic ambient light.
     * @private
     */
    _createAmbientLight() {
        let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        ambientLight.identifier = "AmbientLight";
        this._registerLight(ambientLight);
    }

    /**
     * Register a new light.
     * @param light
     * @private
     */
    _registerLight(light) {
        this._lights.push(light);
    }

    // ------------------------------------------------------------------- GETTERS

    /**
     * Returns the array containing the lighting.
     * @returns {Array}
     */
    get lights() {
        return this._lights;
    }

    /**
     * Returns the light asked with identifier.
     * @param identifier
     * @returns
     */
    getLightReferenceByIdentifier(identifier) {
        for (let light of this._lights) {
            if(light.identifier === identifier) return light; // Reference
        }
        return null;
    }
}
