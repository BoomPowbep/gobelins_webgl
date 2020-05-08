import DATA from "./data";
import Notification from "./ui/mobile/notification";
import Dates from "./ui/dates/dates";

const SCENE_EVENTS_VARS = {
    introduction: () => {
        //heures
        Dates.fromDateHour("mars", 25, 16, 30);
    },
    sceneBistro: () => {
        //Notif instagram
        Notification.instagramNotification();
        //heures
        Dates.fromDateHour("mars", 25, 19, 20);
    },
    sceneColleuse: () => {
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-1");
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromDateHour("mars", 25, 22, 40);
    },
    scenePolice : () => {
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-2");
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromDateHour("mars", 25, 23, 50);
    },
    end : () => {
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-3")
        //Heures
        Dates.fromDateHour("mars", 26, "01", 15);
    }
};

export default SCENE_EVENTS_VARS;