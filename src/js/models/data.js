import DataManager from "./data/data-manager";
import UiManager from "./ui/ui-manager";
import UiNotes from "./ui/ui-notes";
import UiMaps from "./ui/ui-maps";
import UiSettings from "./ui/ui-settings";
import UiInstagram from "./ui/ui-instagram";
import ConclusionManager from "./ui/conclusion/conclusion-manager";

//All our data
const DATA = {
    data_manager : null,
    ui_manager : null,
    conclusion_manager : null,

    //Setup all managers
    setupManagers: () => {
        DATA.data_manager = new DataManager();
        DATA.ui_manager = new UiManager();
        DATA.conclusion_manager = new ConclusionManager();
        DATA.ui_manager.registerUi("notes", new UiNotes());
        DATA.ui_manager.registerUi("maps", new UiMaps());
        DATA.ui_manager.registerUi("settings", new UiSettings());
        DATA.ui_manager.registerUi("instagram", new UiInstagram());
    }
};

//Create window.DATA to be able to debug data easily
window.DATA = DATA;

export default DATA;