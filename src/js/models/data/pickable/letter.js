import Pickable from "./pickable";

/**
 * Constitue la donnée théoriquement d'une lettre.
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
}

export default Letter;