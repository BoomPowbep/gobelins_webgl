import DataManager from "./data/data-manager";
import UiManager from "./ui/ui-manager";
import UiNotes from "./ui/ui-notes";
import UiMaps from "./ui/ui-maps";
import UiInstagram from "./ui/ui-instagram";
import ConclusionManager from "./ui/conclusion/conclusion-manager";
import UiCall from "./ui/ui-call";
import UiPhone from "./ui/ui-phone";

//All our data
const DATA = {
    data_manager : null,
    ui_manager : null,
    conclusion_manager : null,
    is_gluing: false, //il est en train de reconstituer le collage
    drag_start_y: null,
    drag_element: null,
    can_pick: false,
    firstPhoneOpen : true,
    playedTimeline: [],

    //Setup all managers
    setupManagers: () => {
        DATA.data_manager = new DataManager();
        DATA.ui_manager = new UiManager();
        DATA.conclusion_manager = new ConclusionManager();
        DATA.ui_manager.registerUi("notes", new UiNotes());
        DATA.ui_manager.registerUi("maps", new UiMaps());
        DATA.ui_manager.registerUi("instagram", new UiInstagram());
        DATA.ui_manager.registerUi("call", new UiCall());
        DATA.ui_manager.registerUi("phone", new UiPhone());
    }
};

//Create window.DATA to be able to debug data easily
window.DATA = DATA;

export default DATA;