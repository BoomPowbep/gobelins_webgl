/**
 * Constitue un objet qui peut être cliqué la map
 */
class Pickable {
    /**
     * @param {string} identifier
     */
    constructor(identifier) {
        this.identifier = identifier;
        this.picked = false;
    }

    /**
     * Execute this on letter pickup on map
     */
    pickedUp() {
        this.picked = true;
    }

    isPicked() {
        return this.picked;
    }
}

export default Pickable;