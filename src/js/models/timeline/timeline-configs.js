import TimelineItem from "./timeline-item";
import TIMELINE_TYPES from "./timeline-types";
import Timeline from "./timeline";
import VARS from "../vars";

const TIMELINES = {
    begin : new Timeline([
        new TimelineItem(TIMELINE_TYPES.SOUND, "passant_0", 0),
        new TimelineItem(TIMELINE_TYPES.SOUND, "ringtone", 8000),
        new TimelineItem(TIMELINE_TYPES.UI, "call", 8500)
    ]),
    call: new Timeline([
        new TimelineItem(TIMELINE_TYPES.SOUND_STOP, "ringtone", 0),
        new TimelineItem(TIMELINE_TYPES.SOUND, "appel", 0),
        new TimelineItem(TIMELINE_TYPES.UI_HIDE, "call", 19000),
        new TimelineItem(TIMELINE_TYPES.PHONE, null, 19000),
        new TimelineItem(TIMELINE_TYPES.MESSAGE, "Tu as désormais accès à ton téléphone pour enquêter", 19000),
        new TimelineItem(TIMELINE_TYPES.NOTIFICATION, "phone", 19000),
    ]),
    end: new Timeline([
        new TimelineItem(TIMELINE_TYPES.CAMERA,  {x: (1.5), y:(36), z:(-44)}, 5000),
        new TimelineItem(TIMELINE_TYPES.HOURS_SLIDE, {start: VARS.HOURS.SCENE_FINAL, end: VARS.HOURS.BEGIN, duration: 4000}, 7000),
        new TimelineItem(TIMELINE_TYPES.HIDE_SLIDE, null, 14000),
        new TimelineItem(TIMELINE_TYPES.HOURS_HUD, VARS.HOURS.BEGIN, 14000)
    ]),
    stopAll() {
        //On sait jamais si y'a des trucs qui trainent
        Object.values(TIMELINES)
            .filter(value => value instanceof Timeline)
            .forEach(value => value.stop());
    }
};

export default TIMELINES;