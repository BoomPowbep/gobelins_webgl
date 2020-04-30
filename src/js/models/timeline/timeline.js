import TIMELINE_TYPES from "./timeline-types";
import AudioManager from "../audio/audio-manager";
import Mobile from "../ui/mobile/pickup";
import Message from "../ui/mobile/message";
import Notification from "../ui/mobile/notification";

class Timeline {
    constructor(timeline_content) {
        this.timeline_content = timeline_content;
        this.timeout_id = [];
    }

    play() {
        this.timeline_content.forEach(value => {
            let timeout = setTimeout(() => {
                switch (value.type) {
                    case TIMELINE_TYPES.FUNCTION : {
                        value.content();
                        break;
                    }
                    case TIMELINE_TYPES.SOUND : {
                        AudioManager.play(value.content);
                        break;
                    }
                    case TIMELINE_TYPES.SOUND_STOP : {
                        AudioManager.getAudio(value.content).pause();
                        break;
                    }
                    case TIMELINE_TYPES.UI : {
                        DATA.ui_manager.active(value.content);
                        break;
                    }
                    case TIMELINE_TYPES.UI_HIDE : {
                        DATA.ui_manager.get(value.content).hide();
                        break;
                    }
                    case TIMELINE_TYPES.CONCLUSION : {
                        DATA.conclusion_manager.show(value.content);
                        break;
                    }
                    case TIMELINE_TYPES.NOTIFICATION : {
                        Notification.show(value.content);
                        break
                    }
                    case TIMELINE_TYPES.NOTIFICATION_HIDE : {
                        Notification.hide(value.content);
                        break
                    }
                    case TIMELINE_TYPES.MESSAGE : {
                        Message.message(value.content);
                        break;
                    }
                    case TIMELINE_TYPES.PHONE : {
                        Mobile.unlock();
                        document.querySelector("#phone-opener").addEventListener("touchend", () => {
                            DATA.ui_manager.get("phone").show()
                        });
                        break;
                    }
                }
            }, value.delay);

            this.timeout_id.push(timeout);
        });
    }

    stop() {
        this.timeout_id.forEach(value => {
            clearTimeout(value);
        })
    }

}

export default Timeline;