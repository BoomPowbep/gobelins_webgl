import gsap from "gsap";
import TIMELINES from "../timeline/timeline-configs";
import Rewind from "../../Game/Util/Rewind";

class SlideContent {
    static show(html, callback = () => SlideContent.hide()) {
        let el = document.querySelector('#slide-content');
        let content = el.querySelector('div');
        content.innerHTML = html;

        el.addEventListener("click", function (e) {
            e.preventDefault();
            callback();
        }, {once: true});

        el.classList.add('clickable');

        gsap.to(el, {opacity: 1});
        gsap.fromTo(content, {opacity: 0}, {opacity: 1});
    }

    static date(day, hour, callback = undefined, color = "white") {
        SlideContent.show(`<div class='date' style="color:${color}">${hour}<br>${day}</div>`, callback);
    }

    static fromTo(start_date, end_date, callback = undefined, duration=5000, color = "white") {
        SlideContent.show(`<div class='date' style="color:${color}">${start_date.day} ${start_date.month}<br>${start_date.hour}:${start_date.minute}</div>`, callback);
        let el = document.querySelector('#slide-content');
        let date = el.querySelector('.date');

        Rewind.dateRewind(
            date,
            start_date,
            end_date,
            duration
        );
    }

    static image(image, callback = undefined) {
        SlideContent.show(`<img src='${image}'>`, callback);
    }

    static hide() {
        let el = document.querySelector('#slide-content');

        el.classList.remove('clickable');

        gsap.to(el, {opacity: 0});
    }

    //Special Slide Content
    static introduction() {
        SlideContent.date("21 mars", "00:15", () => {
            SlideContent.image("https://pokexp.com/uploads/event/28042020-staff-day.png", () => {
                SlideContent.fromTo({day: "21", month: "mars", hour: 0, minute: 15}, {day: "25", month: "mars", hour: 16, minute: 30}, () => {
                    SlideContent.hide();
                    //TIMELINES.begin.play();
                }, 3000)
            })
        }, "red")
    }

}

export default SlideContent