import GameBrain from "../GameManager/GameManager";

export function toRad(degree) {
    return degree * Math.PI / 180;
}

export function checkForExistingObjectInSceneWithIdentifier(identifier) {
    for(let obj in GameBrain.sceneManager.scene.children) {
        if(GameBrain.sceneManager.scene.children[obj].identifier === identifier) {
            return true;
        }
    }
    return false;
}
