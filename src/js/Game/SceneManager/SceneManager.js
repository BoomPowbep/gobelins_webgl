import * as THREE from 'three';
import {checkForExistingObjectInSceneWithIdentifier} from "../Util/Helpers";

export default class SceneManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor.
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🌴 SceneManager constructor');

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color( 0xFF69B4 );
    };

    // ------------------------------------------------------------------- MAKE

    /**
     * Add an array of objects the the scene.
     * @param things
     */
    addThings(things) {
        for(let thing of things) {
            if(!checkForExistingObjectInSceneWithIdentifier(thing.identifier)) {
                this._scene.add(thing);
                if(thing.type === "SpotLight") {
                    thing.target.identifier = thing.identifier + "-target";
                    this._scene.add(thing.target);
                    // FIXME ca marche pas ca
                    thing.target.position.set(thing.position.x, 0, thing.position.z);
                }
            }
        }
    }

    // ------------------------------------------------------------------- GETTERS

    /**
     * Returns the scene object.
     * @returns {Scene}
     */
    get scene() {
        return this._scene;
    }
}
