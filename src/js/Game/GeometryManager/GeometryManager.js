import * as THREE from 'three';

export default class GeometryManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Construction.
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🔳 Geometry constructor');

        this._debugMode = isDebugMode;

        // Array containing all geometries.
        this._geometries = [];

        if (isDebugMode) this._createDebugElements();
    };

    // ------------------------------------------------------------------- DEBUG

    /**
     * Creates geometries dedicated to debugging.
     * @private
     */
    _createDebugElements() {
        let axesHelper = new THREE.AxesHelper(2);
        this._registerGeometry(axesHelper);

        // let gridHelper = new THREE.GridHelper(50, 50, 0xFFFFFF, 0xFFFFFF);
        // this._registerGeometry(gridHelper);
    }

    // ------------------------------------------------------------------- MAKE

    /**
     * Creates a basic ground surface.
     * @param identifier
     * @param texturePath
     * @returns {Mesh}
     */
    createBasicGroundSurface(identifier = "Unnamed", texturePath = "") {
        let groundShape = new THREE.PlaneGeometry(50, 50);

        let groundTexture = new THREE.TextureLoader().load(texturePath);
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25, 25);

        let groundMaterial = new THREE.MeshPhongMaterial({
            map: groundTexture,
            side: THREE.FrontSide
        });
        let ground = new THREE.Mesh(groundShape, groundMaterial);
        ground.receiveShadow = true;
        ground.rotation.x -= Math.PI / 2;
        ground.identifier = identifier;

        return ground;
    }

    /**
     * Create a cube skybox.
     * @returns {Mesh}
     */
    createCubeSkybox(path, side) {

        let directions = ["front", "back", "up", "down", "right", "left"];
        let imageSuffix = ".jpg";
        let skyGeometry = new THREE.CubeGeometry(side, side, side);

        let materialArray = [];
        for (let i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(path + directions[i] + imageSuffix),
                side: THREE.BackSide
            }));
        let skyMaterial = new THREE.MeshFaceMaterial(materialArray);

        let skyboxMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        skyboxMesh.identifier = "Skybox-" + path;
        return skyboxMesh;
    }

    /**
     * Create a cube skybox.
     * @returns {Mesh}
     */
    createColorSkybox(color, side) {
        let skyGeometry = new THREE.CubeGeometry(side, side, side);

        let materialArray = [];
        for (let i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.BackSide
            }));
        let skyMaterial = new THREE.MeshFaceMaterial(materialArray);

        let skyboxMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        skyboxMesh.identifier = "Skybox-" + color;
        return skyboxMesh;
    }


    /**
     * Create a sphere skybox.
     * @returns {Mesh}
     */
    createSphereSkybox() {
        const skbName = 'ocean';
        let skyBox = new THREE.SphereGeometry(100, 100, 100);
        let skyBoxMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(
                'textures/sky/' + skbName + '.jpg'
            ),
            side: THREE.BackSide
        });
        let skyboxMesh = new THREE.Mesh(skyBox, skyBoxMaterial);
        skyboxMesh.identifier = "Skybox";
        return skyboxMesh;
    }

    /**
     * Creates a basic shape.
     * @param identifier
     * @param size
     * @param position
     * @param color
     * @param castShadow
     * @param doubleSided
     * @returns {Mesh}
     */
    createBasicShape({
                         identifier = "Unnamed",
                         size = {x: 1, y: 1, z: 1},
                         position = {x: 0, y: 0, z: 0},
                         color = 0x00ff00,
                         castShadow = false,
                         doubleSided = false
                     }) {
        let geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        let material = new THREE.MeshBasicMaterial({color: color});
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = position.x;
        cube.position.y = position.y;
        cube.position.z = position.z;
        cube.identifier = identifier;

        cube.castShadow = castShadow;

        cube.doubleSided = doubleSided;

        return cube;
    }

    /**
     * Register all created geometries.
     * @param geometriesArray
     */
    loadGeometries(geometriesArray) {
        for (let geometry of geometriesArray) {
            this._registerGeometry(geometry);
        }
    }

    /**
     * Adds the parameter geometry to the active geometries list.
     * @param geometry
     * @private
     */
    _registerGeometry(geometry) {
        this._geometries.push(geometry);
    }

    // ------------------------------------------------------------------- GETTERS

    /**
     * Returns the array containing all the geometries.
     * @returns {Array}
     */
    get geometries() {
        return this._geometries;
    }

    /**
     * Returns the geometry identified by string.
     * @param identifier
     */
    getGeometryReferenceByIdentifier(identifier) {
        for (let geometry of this._geometries) {
            if (geometry.identifier === identifier) return geometry; // Reference
        }
        return null;
    }
}
