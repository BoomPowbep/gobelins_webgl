import * as THREE from 'three';
import THREEx from '../../threex.volumetricspotlightmaterial';

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
     * @param identifier
     * @param color
     * @param intensity
     * @param position
     * @param rotation
     * @param target
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
                        target = {x: position.x, y: 0, z: position.z},
                        angle = .05,
                        distance = 1000,
                        penumbra = .7,
                        decay = 1.2,
                        radiusTop = 2,
                        attenuationFactor = 20.0
                    }) {

        // add spot light
        let geometry = new THREE.CylinderGeometry(radiusTop, angle * 150, distance, 32 * 4, 10, true);
        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0));
        geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        let material = new THREEx.VolumetricSpotLightMaterial()
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y + 4.5, position.z);
        mesh.lookAt(new THREE.Vector3(target.x, target.y, target.z));
        material.uniforms.lightColor.value.set('white');
        material.uniforms.spotPosition.value = mesh.position;
        material.uniforms.attenuationFactor.value = attenuationFactor;

        mesh.identifier = identifier + "-volumetry";

        this._registerLight(mesh);

        let spotLight = new THREE.SpotLight(color, intensity);

        // Adding identifier property
        spotLight.identifier = identifier;

        spotLight.position.set(position.x, position.y, position.z);

        spotLight.angle = angle;

        spotLight.distance = distance;
        spotLight.penumbra = penumbra;
        spotLight.decay = decay;

        this._registerLight(spotLight);

        // Set target under
        spotLight.target.identifier = spotLight.identifier + "-target";
        spotLight.target.position.set(target.x, 0, target.z);

        this._registerLight(spotLight.target);

        return spotLight;
    }

    old_createSpotLight({
                            identifier,
                            color = 0xFFFFFF,
                            intensity = 1,
                            position = {x: 0, y: 40, z: 0},
                            target = {x: position.x, y: 0, z: position.z},
                            angle = .05,
                            distance = 1000,
                            penumbra = .7,
                            decay = 1.2
                        }) {
        let spotLight = new THREE.SpotLight(color, intensity);

        // Adding identifier property
        spotLight.identifier = identifier;

        spotLight.position.set(position.x, position.y, position.z);

        spotLight.rotation.set(0, 0, 0);

        spotLight.angle = angle;
        spotLight.distance = distance;
        spotLight.penumbra = penumbra;
        spotLight.decay = decay;

        this._registerLight(spotLight);

        // Set target under
        spotLight.target.identifier = spotLight.identifier + "-target";
        spotLight.target.position.set(target.x, 0, target.z);
        this._registerLight(spotLight.target);

        return spotLight;
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
            if (light.identifier === identifier) return light; // Reference
        }
        return null;
    }
}
