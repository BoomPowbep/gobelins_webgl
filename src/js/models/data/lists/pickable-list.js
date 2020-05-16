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

    hasPickupAllInScene(scene_id) {
        return this.items.filter(value => value.scene === scene_id && !value.picked).length === 0;
    }

    count() {
        return this.items.length;
    }

    countPicked() {
        return this.getPickedUp().length;
    }

    countOnScene(scene) {
        return this.items.filter(value => value.scene === scene).length;
    }

    countPickedOnScene( scene ) {
        return this.items.filter(value => value.scene === scene && value.picked).length;
    }
}

export default PickableList;