import DATA from "./data";
import Notification from "./ui/mobile/notification";
import Dates from "./ui/dates/dates";
import VARS from "./vars";

const SCENE_EVENTS_VARS = {
    introduction: () => {
        //heures
        Dates.fromDateHour("mars", 25, 16, 30);
    },
    sceneBistro: () => {
        DATA.data_manager.get("instagram", "post-1").pickedUp();
        //Notif instagram
        Notification.instagramNotification();
        //heures
        Dates.fromObject(VARS.HOURS.SCENE_1);
    },
    sceneColleuse: () => {
        DATA.data_manager.get("instagram", "post-2").pickedUp();
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-1");
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromObject(VARS.HOURS.SCENE_2);
    },
    scenePolice : () => {
        DATA.data_manager.get("instagram", "post-3").pickedUp();
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-2");
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromObject(VARS.HOURS.SCENE_3);

    },
    end : () => {
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-3")
        //Heures
        Dates.fromObject(VARS.HOURS.SCENE_FINAL);
    }
};

export default SCENE_EVENTS_VARS;