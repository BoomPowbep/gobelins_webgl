import TIMELINE_TYPES from "./timeline-types";
import AudioManager from "../audio/audio-manager";
import Mobile from "../ui/mobile/pickup";

class Timeline {
    constructor(timeline_content) {
        this.timeline_content = timeline_content;
    }

    play() {
        this.timeline_content.forEach(value => {
            setTimeout(() => {
                switch (value.type) {
                    case TIMELINE_TYPES.FUNCTION : {
                        value.content();
                        break;
                    }
                    case TIMELINE_TYPES.SOUND : {
                        AudioManager.play(value.content);
                        break;
                    }
                    case TIMELINE_TYPES.UI : {
                        DATA.ui_manager.active(value.content);
                        break;
                    }
                    case TIMELINE_TYPES.CONCLUSION : {
                        DATA.conclusion_manager.show(value.content);
                        break;
                    }
                    case TIMELINE_TYPES.PHONE : {
                        Mobile.unlock();
                        break;
                    }
                }
            }, value.delay)
        });
    }

}

export default Timeline;