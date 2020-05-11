import Ui from "./ui";
import GameBrain from "../../Game/GameManager/GameManager";
import Notification from "../ui/mobile/notification";

class UiPhone extends Ui {
    constructor() {
        super("#app_phone", false);
    }

    setupGlobalEvents() {
        super.setupGlobalEvents();


        const appIcons = this.element.querySelectorAll(".app-icon");
        appIcons.forEach(value => {
            value.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide();
                if(value.getAttribute("data-open") === "maps") {
                    GameBrain.sceneryManager.startSceneryTransition("MapScenery");
                }
                else {
                    DATA.ui_manager.active(value.getAttribute("data-open"));
                }
            })
        })
    }

    setupDOM() {
        super.setupDOM();

        Notification.hide("phone");

        document.querySelector("#hud").style.display = "block";
    }

    setupEvents() {
        super.setupEvents();
    }
}

export default UiPhone;