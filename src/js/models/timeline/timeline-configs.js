import TimelineItem from "./timeline-item";
import TIMELINE_TYPES from "./timeline-types";
import Timeline from "./timeline";
import VARS from "../vars";
import AudioManager from "../audio/audio-manager";
import Converter from "../converter";

const TIMELINES = {
    begin : new Timeline([
        new TimelineItem(TIMELINE_TYPES.HOURS_HUD, VARS.HOURS.SCENE_INTRO, 0),
        new TimelineItem(TIMELINE_TYPES.SOUND, "passant_0", 0),
        new TimelineItem(TIMELINE_TYPES.SOUND, "ringtone", 8000),
        new TimelineItem(TIMELINE_TYPES.UI, "call", 8500),
        new TimelineItem(TIMELINE_TYPES.TEXT, {el: ("#app_call .duration"), text: "Appel entrant"}, 8500),
    ]),
    call: new Timeline([
        new TimelineItem(TIMELINE_TYPES.FUNCTION, () => {
            let el = document.querySelector(("#app_call .duration"));
            let audio = AudioManager.getAudio("appel");

            let update = setInterval(() => {
                if(audio.audio.currentTime >= audio.duration)
                    clearInterval(update);
                el.innerText = Converter.durationToTime(audio.audio.currentTime);
            }, 250);

            let stop = document.querySelector('.stop-call');
            let start = document.querySelector('.start-call');

            stop.style.display = "block";
            start.style.display = "none";
        }, 0),
        new TimelineItem(TIMELINE_TYPES.SOUND_STOP, "ringtone", 0),
        new TimelineItem(TIMELINE_TYPES.SOUND, "appel", 0),
        new TimelineItem(TIMELINE_TYPES.TEXT, {el:  ("#app_call .duration"), text: "Appel terminé"}, 20000),
        new TimelineItem(TIMELINE_TYPES.UI_HIDE, "call", 21000),
        new TimelineItem(TIMELINE_TYPES.PHONE, null, 21000),
        new TimelineItem(TIMELINE_TYPES.MESSAGE, "Tu as désormais accès à ton téléphone pour enquêter", 21000),
        new TimelineItem(TIMELINE_TYPES.NOTIFICATION, "phone", 21000),
        new TimelineItem(TIMELINE_TYPES.ALLOW_PICKING, true, 21000),
        new TimelineItem(TIMELINE_TYPES.MESSAGE, "Oh on dirait qu’un morceau de collage est juste là", 31000),
    ]),
    end: new Timeline([
        new TimelineItem(TIMELINE_TYPES.CAMERA,  {x: (1.5), y:(36), z:(-44)}, 5000),
        new TimelineItem(TIMELINE_TYPES.HOURS_SLIDE, {start: VARS.HOURS.SCENE_FINAL, end: VARS.HOURS.BEGIN, duration: 4000}, 7000),
        new TimelineItem(TIMELINE_TYPES.HIDE_SLIDE, null, 15000),
        new TimelineItem(TIMELINE_TYPES.HOURS_HUD, VARS.HOURS.BEGIN, 15000)
    ]),
    sceneBistro: new Timeline([
        new TimelineItem(TIMELINE_TYPES.MESSAGE, "Ecoute la conversation du bar", 10000),
    ]),
    sceneColleuse: new Timeline([
        new TimelineItem(TIMELINE_TYPES.CONCLUSION, 'scene-1', 0)
    ]),
    scenePolice: new Timeline([
        new TimelineItem(TIMELINE_TYPES.CONCLUSION, 'scene-2', 0)
    ]),
    sceneFinal: new Timeline([
        new TimelineItem(TIMELINE_TYPES.CONCLUSION, 'scene-3', 0)
    ]),
    postListenBistro : new Timeline([
        new TimelineItem(TIMELINE_TYPES.ALLOW_PICKING, true, 0),
        new TimelineItem(TIMELINE_TYPES.NOTIFICATION, "instagram", 30000),
        new TimelineItem(TIMELINE_TYPES.NOTIFICATION, "phone", 30000),
        new TimelineItem(TIMELINE_TYPES.MESSAGE, "Tu ne trouves pas tout ? Regarde Instagram pour t'aider",  40000),
    ]),
    mapNotification: new Timeline([
        new TimelineItem(TIMELINE_TYPES.NOTIFICATION, "maps", 0),
        new TimelineItem(TIMELINE_TYPES.NOTIFICATION, "phone", 0)
    ]),
    stopTimeline: new Timeline([
        new TimelineItem(TIMELINE_TYPES.ALLOW_PICKING, false, 0),
        new TimelineItem(TIMELINE_TYPES.SOUND_STOP_ALL, null, 0),
        new TimelineItem(TIMELINE_TYPES.STOP_PREVIOUS_TIMELINE, null, 0),
    ]),
    stopAll() {
        //On sait jamais si y'a des trucs qui trainent
        Object.values(TIMELINES)
            .filter(value => value instanceof Timeline)
            .forEach(value => value.stop());
    }
};

window.TIMELINES = TIMELINES;

export default TIMELINES;