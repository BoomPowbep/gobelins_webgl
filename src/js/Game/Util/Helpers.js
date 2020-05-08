import GameBrain from "../GameManager/GameManager";

/**
 * convert degree to rad.
 * @param degree
 * @returns {number}
 */
export function toRad(degree) {
    return degree * Math.PI / 180;
}

/**
 * Look in the scene if an object is already there.
 * @param identifier
 * @returns {boolean}
 */
export function checkForExistingObjectInSceneWithIdentifier(identifier) {
    for(let obj in GameBrain.sceneManager.scene.children) {
        if(GameBrain.sceneManager.scene.children[obj].identifier === identifier) {
            return true;
        }
    }
    return false;
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
