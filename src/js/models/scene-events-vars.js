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
        TIMELINES.stopTimeline.play();
        setTimeout(() => TIMELINES.sceneBistro.play(), 1);

        DATA.data_manager.get("instagram", "post-1").pickedUp();
        //Notif instagram
        Notification.instagramNotification();
        //heures
        Dates.fromObject(VARS.HOURS.SCENE_1);
    },
    sceneColleuse: () => {
        TIMELINES.stopTimeline.play();
        setTimeout(() => TIMELINES.sceneColleuse.play(), 1);

        DATA.data_manager.get("instagram", "post-2").pickedUp();
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromObject(VARS.HOURS.SCENE_2);
    },
    scenePolice : () => {
        TIMELINES.stopTimeline.play();
        setTimeout(() => TIMELINES.scenePolice.play(), 1);

        DATA.data_manager.get("instagram", "post-3").pickedUp();
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromObject(VARS.HOURS.SCENE_3);

    },
    end : () => {
        if(DATA.data_manager.letters.hasPickupAll()) {
            //On lance la conclusion de la scène précédente
            TIMELINES.stopTimeline.play();
            setTimeout(() => TIMELINES.sceneFinal.play(), 1);
            //Heures
            Dates.fromObject(VARS.HOURS.SCENE_FINAL);
        }
    }
};

export default SCENE_EVENTS_VARS;