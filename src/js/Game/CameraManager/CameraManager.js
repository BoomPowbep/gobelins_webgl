import * as THREE from 'three';

export default class CameraManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Constructor
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🎥 CameraManager constructor');

        this._perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 5000);
        this._orthoCamera = new THREE.OrthographicCamera(window.innerWidth / -1000, window.innerWidth / 1000, window.innerHeight / 1000, window.innerHeight / -1000, 0.01, 5000);

        this._isPerspective = true;
        this._activeCamera = this._perspectiveCamera;
    };

    /**
     * Set the active camera (perspective or ortho)
     * @param perspective
     */
    setCameraMode(perspective) {
        this._isPerspective = perspective;
        this._activeCamera = perspective ? this._perspectiveCamera : this._orthoCamera;
        this._activeCamera.updateProjectionMatrix();
    }

    // ------------------------------------------------------------------- CAMERA MOTION

    /**
     * Set the camera position.
     * @param x
     * @param y
     * @param z
     */
    setPosition(x = 0, y = 0, z = 0) {
        this._activeCamera.position.x = x;
        this._activeCamera.position.y = y;
        this._activeCamera.position.z = z;
    }

    /**
     * Make the camera look at a point.
     * @param thing
     */
    lookAtSomething(thing) {
        this._activeCamera.lookAt(thing);
    }

    // ------------------------------------------------------------------- SETTERS

    /**
     * Attach objects to the camera (audio for example).
     * @param things []
     */
    attach(things) {
        for(let thing in things) {
            this._activeCamera.add(thing);
        }
    }

    // ------------------------------------------------------------------- GETTERS

    /**
     * Returns the camera object.
     * @returns
     */
    get camera() {
        return this._activeCamera;
    }
}
