import DATA from "./data";
import Notification from "./ui/mobile/notification";
import Dates from "./ui/dates/dates";
import VARS from "./vars";
import GameBrain from "../Game/GameManager/GameManager";
import {toRad} from "../Game/Util/Helpers";

const SCENE_EVENTS_VARS = {
    introduction: () => {
        GameBrain.controlsManager.controls.updateAlphaOffsetAngle(toRad(-90));
        //heures
        Dates.fromDateHour("mars", 25, 16, 30);
    },
    sceneBistro: () => {
        GameBrain.controlsManager.controls.updateAlphaOffsetAngle(toRad(-210));

        TIMELINES.stopTimeline.play();
        setTimeout(() => TIMELINES.sceneBistro.play(), 1);

        DATA.data_manager.get("instagram", "post-1").pickedUp();
        //Notif instagram
        Notification.instagramNotification();
        //heures
        Dates.fromObject(VARS.HOURS.SCENE_1);
    },
    sceneColleuse: () => {
        GameBrain.controlsManager.controls.updateAlphaOffsetAngle(toRad(180));

        TIMELINES.stopTimeline.play();
        setTimeout(() => TIMELINES.sceneColleuse.play(), 1);

        DATA.data_manager.get("instagram", "post-2").pickedUp();
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromObject(VARS.HOURS.SCENE_2);
    },
    scenePolice : () => {
        GameBrain.controlsManager.controls.updateAlphaOffsetAngle(toRad(30));

        TIMELINES.stopTimeline.play();
        setTimeout(() => TIMELINES.scenePolice.play(), 1);

        DATA.data_manager.get("instagram", "post-3").pickedUp();
        //Notif instagram
        Notification.instagramNotification();
        //Heures
        Dates.fromObject(VARS.HOURS.SCENE_3);

    },
    end : () => {
        GameBrain.controlsManager.controls.updateAlphaOffsetAngle(toRad(-90));

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