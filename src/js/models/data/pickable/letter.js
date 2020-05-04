import Pickable from "./pickable";

/**
 * It's a letter that user need to find in scene
 */
class Letter extends Pickable{
    /**
     * @param {string} identifier
     * @param {number|null} scene
     * @param {string|null} letter
     * @param dragPos
     * @param dragRotate
     * @param scenePosition
     */
    constructor(identifier, scene = null, letter = null, dragPos={x:0, y:0, z:0}, dragRotate={x:0,y:0,z:0}, scenePosition={x:0, y:0, z:0}) {
        super(identifier);
        this.scene = scene;
        this.letter = letter;

        this.dragPos = dragPos;
        this.dragRotate = dragRotate;
        this.scenePosition = scenePosition;
    }

    /**
     * @return {number|null}
     */
    getScene() {
        return this.scene;
    }

    pickedUp() {
        super.pickedUp();
        let event = new CustomEvent("letter", {detail: this});
        document.dispatchEvent(event);
    }

    getImage() {
        return `textures/letters/${this.letter}.png`;
    }
}

export default Letter;