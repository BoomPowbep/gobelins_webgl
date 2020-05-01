import Ui from "./ui";
import Notification from "../ui/mobile/notification";

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
}

export default UiMaps;