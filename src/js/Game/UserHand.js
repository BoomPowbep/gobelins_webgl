import DATA from "../models/data";
import GameBrain from "./GameManager/GameManager";
import gsap from "gsap";
import {toRad} from "./Util/Helpers";
import Mobile from "../models/ui/mobile/pickup";

let draggableElements = null;

class UserHand {
    /**
     * On crée les éléments que l'utilisateur Drag'N'Drop
     */
    static createElements() {
        if (draggableElements == null) {
            draggableElements = DATA.data_manager.letters.items.map(value => {
                let shape = GameBrain.geometryManager.createBasicShape({
                    identifier: "dnd-" + value.identifier,
                    position: {x: 0, y: 0, z: 0}, //position au point 0,0,0
                    size: {x: 7, y: 7, z: 0.1}, // taille arbitraire qui marche bien
                    texture: value.getImage(), // texture
                    rotation: value.dragRotate, // rotation par défaut
                    color: 0xFFFFFF,
                });
                shape.cameraPosition = value.dragPos;
                shape.scenePosition = value.scenePosition;
                shape.appendInCamera = true;

                return shape;
            });
        }
    }

    /**
     * Affiche les éléments restants en bas (si changement de scène etc)
     */
    static show() {
        Mobile.lock();
        //on crée les éléments (sauf si ils existent déjà)
        if (DATA.is_gluing && draggableElements != null) {
            draggableElements.forEach(value => {
                if(value.appendInCamera) {
                    //on ajoute l'élément à la caméra
                    GameBrain.cameraManager.camera.add(value);
                    //on le positionne DANS la caméra correctement
                    value.position.set(value.cameraPosition.x, value.cameraPosition.y, value.cameraPosition.z);
                }
            })
        }
    }

    /**
     * Indique si un élément peut être Drag and Drop
     * @param identifier
     * @return {boolean}
     */
    static isDragable(identifier) {
        let el = draggableElements.find(value => value.identifier === identifier);
        return (el !== undefined && el !== null && el.appendInCamera);
    }

    /**
     * Anim l'élément sur la scène
     * @param identifier
     */
    static putOnScene(identifier) {
        let el = draggableElements.find(value => value.identifier === identifier);
        if(el !== undefined && el !== null) {
            //on vire l'élément de la caméra et on le remet dans la scène
           GameBrain.cameraManager.camera.remove(el);
           GameBrain.sceneManager.scene.add(el);

           //On passe ca à false, ca desactive le D'n'D sur cet élément et ne le rend plus dans la caméra
           el.appendInCamera = false;

           //On ajoute une durée d'animation à la position dynamiquement
           el.scenePosition.duration = 5;

           //On anime avec GSAP
           gsap.fromTo(el.position, {x: GameBrain.cameraManager.camera.position.x, y: GameBrain.cameraManager.camera.position.y, z: GameBrain.cameraManager.camera.position.z}, el.scenePosition);
           gsap.to(el.rotation, {x: 0, y:  toRad(90), z:  0, duration: 2});
           gsap.to(el.scale, {x: 0.55, y: 0.55, z: 0.55, duration: 2});

           UserHand.checkFinish();
        }
    }

    /**
     * Vérifie si le joueur a tout D'n'D
     */
    static checkFinish(){
        let el = draggableElements.find(value => value.appendInCamera);
        if(el === undefined || el === null) {
            document.dispatchEvent(new CustomEvent("end-dragndrop"));
        }
    };
}

export default UserHand;