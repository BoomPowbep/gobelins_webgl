/**
 * List of pickable items
 */
class PickableList {
    /**
     * @param {[Pickable]} items
     */
    constructor(items) {
        this.items = items;
    }

    /**
     * @param {Pickable} pickable
     */
    add(pickable) {
        this.items.push(pickable);
    }

    /**
     * @param {string} identifier
     * @return {Pickable}
     */
    get(identifier) {
        return this.items.find(value => value.identifier === identifier)
    }

    getPickedUp() {
        return this.items.filter(value => value.picked);
    }

    hasPickupAll() {
        return this.items.find(value => !value.picked) === undefined;
    }
}

export default PickableList;