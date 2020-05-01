import gsap from "gsap";
import TIMELINES from "../timeline/timeline-configs";

class SlideContent {
    static show(html, callback = () => SlideContent.hide()) {
        let el = document.querySelector('#slide-content');
        let content = el.querySelector('div');
        content.innerHTML = html;

        el.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("TOUCH");
            callback();
        }, {once: true});

        el.classList.add('clickable');

        gsap.to(el, {opacity: 1});
        gsap.fromTo(content, {opacity: 0}, {opacity: 1});
    }

    static date(day, hour, callback = undefined, color = "white") {
        SlideContent.show(`<div class='date' style="color:${color}">${hour}<br>${day}</div>`, callback);
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
                SlideContent.date("25 mars", "16:20", () => {
                    SlideContent.hide();
                    TIMELINES.begin.play();
                })
            })
        }, "red")
    }

}

export default SlideContent