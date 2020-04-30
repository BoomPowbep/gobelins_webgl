import TimelineItem from "./timeline-item";
import TIMELINE_TYPES from "./timeline-types";
import Timeline from "./timeline";

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
    ])
};

export default TIMELINES;