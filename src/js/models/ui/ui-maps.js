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
    }

    setupEvents() {
        super.setupEvents();
    }

    show() {
        super.show();
        document.querySelector("#hud").classList.add("hide_hud");
    }

    hide() {
        super.hide();

        //On tp le joueur sur la scène
        GameBrain.sceneryManager.startSceneryTransition(GameBrain.sceneryManager.getLastScenery(), 0);
    }
}

export default UiMaps;