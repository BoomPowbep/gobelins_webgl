import DATA from "./data";
import Notification from "./ui/mobile/notification";

const SCENE_EVENTS_VARS = {
    introduction: () => {

    },
    sceneBistro: () => {
        //Notif instagram
        Notification.instagramNotification();
    },
    sceneColleuse: () => {
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-1");
        //Notif instagram
        Notification.instagramNotification();
    },
    scenePolice : () => {
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-2");
        //Notif instagram
        Notification.instagramNotification();
    },
    end : () => {
        //On lance la conclusion de la scène précédente
        DATA.conclusion_manager.show("scene-3")
    }
};

export default SCENE_EVENTS_VARS;