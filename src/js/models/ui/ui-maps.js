import Ui from "./ui";
import Notification from "../ui/mobile/notification";
import GameBrain from "../../Game/GameManager/GameManager";

class UiMaps extends Ui {
    constructor() {
        super("#app_maps");
    }

    setupDOM() {
        super.setupDOM();
        Notification.hide("maps");


        document.querySelector("#hud").style.display = "none";
    }

    setupEvents() {
        super.setupEvents();
    }

    hide() {
        super.hide();

        //On tp le joueur sur la scène
        GameBrain.sceneryManager.startSceneryTransition(GameBrain.sceneryManager.getLastScenery(), 0);
    }
}

export default UiMaps;