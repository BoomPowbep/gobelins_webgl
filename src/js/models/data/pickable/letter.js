import Pickable from "./pickable";

/**
 * It's a letter that user need to find in scene
 */
class Letter extends Pickable{
    /**
     * @param {string} identifier
     * @param {number|null} scene
     */
    constructor(identifier, scene = null) {
        super(identifier);
        this.scene = scene;
    }

    /**
     * @return {number|null}
     */
    getScene() {
        return this.scene;
    }

    getImage() {
        return "images/letters/test.png";
    }
}

export default Letter;