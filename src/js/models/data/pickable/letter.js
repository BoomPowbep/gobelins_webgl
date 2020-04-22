import Pickable from "./pickable";

/**
 * It's a letter that user need to find in scene
 */
class Letter extends Pickable{
    /**
     * @param {string} identifier
     * @param {Vector3|null} position
     */
    constructor(identifier, position = null) {
        super(identifier);
        this.position = position;
    }

    /**
     * @return {Vector3|null}
     */
    getPosition() {
        return this.position;
    }

    getImage() {
        return "images/letters/test.png";
    }
}

export default Letter;