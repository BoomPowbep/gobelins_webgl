import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Vector3} from "three";
import GameBrain from "../GameManager/GameManager";

class Model {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Construction.
     * @param identifier
     * @param path
     * @param initialScaleFactor
     * @param initialPosition
     * @param initialRotation
     * @param visible
     */
    constructor(
        {
            identifier = "Unnamed",
            path = "",
            initialScaleFactor = .01,
            initialPosition = {
                x: 0,
                y: 0,
                z: 0
            },
            initialRotation = {x: 0, y: 0, z: 0},
            visible = true
        }) {
        this.identifier = identifier;
        this.path = path;
        this.initialScaleFactor = initialScaleFactor;
        this.initialPosition = initialPosition;
        this.initialRotation = initialRotation;
        this.loaded = false;
        this.visible = visible;
    }
}

class ModelManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Construction.
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🔳 Model constructor');

        // Array containing all geometries.
        this._models = [];

        this.fbxLoader = new FBXLoader();
        this.gltfLoader = new GLTFLoader();
    };

    // ------------------------------------------------------------------- DEBUG


    // ------------------------------------------------------------------- MAKE

    /**
     * Load all models passed as argument.
     * @param modelsArray Model
     * @param callback
     */
    loadModels(modelsArray, callback) {

        let loadedCount = 0;
        const targetCount = modelsArray.length;

        modelsArray.map(model => {
            //obligé d'ajouter ca y'a un truc qui crash dans ton code mickael, peut être t'as fix mais du coup impossible pour moi de debug quoi que ce soit
            if(!(model instanceof Model)) {
                loadedCount++;
                loadedCount === targetCount && callback();
                return;
            }

            const type = model.path.match(/\.[0-9a-z]+$/i)[0];

            let loader;
            if (type === ".glb") {
                loader = this.gltfLoader;
            } else if (type === ".fbx") {
                loader = this.fbxLoader;
            }

            try {
                loader.load(model.path,
                    // On loaded
                    (object) => {
                        console.log("Loaded model from " + model.path, object);

                        const target = (type === ".glb") ? object.scene : object;

                        target.scale.set(model.initialScaleFactor, model.initialScaleFactor, model.initialScaleFactor);

                        target.position.x = model.initialPosition.x;
                        target.position.y = model.initialPosition.y;
                        target.position.z = model.initialPosition.z;

                        target.rotation.x = model.initialRotation.x;
                        target.rotation.y = model.initialRotation.y;
                        target.rotation.z = model.initialRotation.z;

                        target.visible = model.visible;

                        // Add identifier
                        target.identifier = model.identifier;

                        this._enableBackfaceCulling(target);

                        this._registerModel(target);

                        loadedCount++;

                        // If everything is loaded, execute callback
                        loadedCount === targetCount && callback()
                    },
                    // On progress
                    (status) => {
                        let progress = [status.loaded, status.total];
                    },
                    // On error
                    (error) => {
                        console.warn(`Object loading error [model = ${model.path}]: `, error);
                    });
            }
            catch (e) {
                console.log(e);
            }
        });

    }

    /**
     *
     * @param {Object3D} model
     */
    playFirstAnimation(model) {
        let mixer = new THREE.AnimationMixer(model);
        let clips = model.animations;

        if(clips.length === 0) {
            console.log("Animation missing in " + model.identifier);
            return;
        }

        let action = mixer.clipAction(clips[0]);

        action.play();

        GameBrain.mixers.push(mixer);
    }

    playFirstAnimationByIdentifier(identifier) {
        let model = this.getModelReferenceByIdentifier(identifier);
        console.log("MODEL - ", identifier, model);
        this.playFirstAnimation(model);
    }

    _enableBackfaceCulling(target) {
        target.traverse((obj) => {
            if(obj.isMesh) {
                obj.material.side = THREE.DoubleSide;
            }
            else if(obj.isGroup) {
                // this._enableBackfaceCulling(obj);
            }
        });
    }

    /**
     * Adds the parameter model to the active models list.
     * @param model
     * @private
     */
    _registerModel(model) {
        this._models.push(model);
    }

    // ------------------------------------------------------------------- GETTERS

    /**
     * Returns the array containing all the geometries.
     * @returns {Array}
     */
    get models() {
        return this._models;
    }

    /**
     * Returns the model identified by string.
     * @param identifier
     */
    getModelReferenceByIdentifier(identifier) {
        for (let model of this._models) {
            if (model.identifier === identifier) return model; // Reference
        }
        return null;
    }
}

export {ModelManager, Model};
