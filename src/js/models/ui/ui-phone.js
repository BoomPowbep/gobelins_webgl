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
                    GameBrain.sceneryManager.startSceneryTransition("MapScenery", 0);
                }
                else {
                    DATA.ui_manager.active(value.getAttribute("data-open"));
                }
            })
        })
    }

    hide() {
        super.hide();

        //on fait un check pour savoir si on joue une TIMELINE spéciale à la fermeture du tél ou non
        if (DATA.firstPhoneOpen) {
            DATA.firstPhoneOpen = false;
            TIMELINES.firstPhoneOpen.play();
        }
    }

    setupDOM() {
        super.setupDOM();

        Notification.hide("phone");

        document.querySelector("#hud").classList.remove("hide_hud");
    }

    setupEvents() {
        super.setupEvents();
    }
}

export default UiPhone;