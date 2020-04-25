import TimelineItem from "./timeline-item";
import TIMELINE_TYPES from "./timeline-types";
import Timeline from "./timeline";

const TIMELINES = {
    begin : new Timeline([
        new TimelineItem(TIMELINE_TYPES.SOUND, "passant_0", 0),
        new TimelineItem(TIMELINE_TYPES.SOUND, "ringtone", 6000),
        new TimelineItem(TIMELINE_TYPES.UI, "call", 6500)
    ])
};

export default TIMELINES;