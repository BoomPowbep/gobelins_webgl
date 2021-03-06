import gsap from "gsap";
import TIMELINES from "../timeline/timeline-configs";
import Rewind from "../../Game/Util/Rewind";
import VARS from "../vars";
import GameBrain from "../../Game/GameManager/GameManager";

class SlideContent {
    static show(html, callback = () => SlideContent.hide(), event = true, duration = 0.5) {
        let el = document.querySelector('#slide-content');
        let content = el.querySelector('div');
        content.innerHTML = html;

        setTimeout(() => {
            el.addEventListener("click", function (e) {
                e.preventDefault();
                callback();
            }, {once: true});

            el.classList.add('clickable');
        }, event === true ? 0 : event);

        gsap.to(el, {opacity: 1, duration: duration});
        gsap.fromTo(content, {opacity: 0}, {opacity: 1});
    }

    static date(date, callback = undefined, color = "white", event = true) {
        SlideContent.show(`<div class='date' style="color:${color}"><span>${date.hour <= 9 ? `0${date.hour}`: date.hour}:${date.minute}</span><span>${VARS.DAYS[date.weekDay]} ${date.day} ${date.month}</span></div>`, callback, event);
    }

    /**
     * @param {VideoFile} video
     * @param callback
     * @param event
     */
    static video(video) {
        let el = document.querySelector('#slide-content');
        let content = el.querySelector('div');

        content.innerHTML = "";

        video.appendIn(content);
        video.play();

        el.querySelector('.animation').style.display = "none";
    }

    static fromTo(start_date, end_date, callback = undefined, duration=5000, color = "white", event = true, open_duration = 0.5) {
        SlideContent.show(`<div class='date' style="color:${color}"><span>${start_date.hour <= 9 ? `0${start_date.hour}`: start_date.hour}:${start_date.minute}</span><span>${VARS.DAYS[start_date.weekDay]} ${start_date.day} ${start_date.month}</span></div>`, callback, event, open_duration);
        let el = document.querySelector('#slide-content');
        let date = el.querySelector('.date');

        setTimeout(function () {
            Rewind.dateRewind(
                date,
                start_date,
                end_date,
                duration
            );
        }, 1200)
    }

    static image(image, callback = undefined, event = true) {
        SlideContent.show(`<img src='${image}'>`, callback, event);
    }

    static hide() {
        let el = document.querySelector('#slide-content');

        el.classList.remove('clickable');

        gsap.to(el, {opacity: 0});
    }

    //Special Slide Content
    static introduction() {
        SlideContent.date(VARS.HOURS.BEGIN, () => {
            SlideContent.image("/images/cuisine.png", () => {
                SlideContent.fromTo(VARS.HOURS.BEGIN, VARS.HOURS.SCENE_INTRO, () => {
                    SlideContent.hide();
                    TIMELINES.begin.play();
                }, 2000, undefined, 5000)
            })
        })
    }

}

export default SlideContent