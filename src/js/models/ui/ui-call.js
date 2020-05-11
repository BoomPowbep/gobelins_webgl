import Ui from "./ui";
import TIMELINES from "../timeline/timeline-configs";

class UiCall extends Ui {
    constructor() {
        super("#app_call", false);
    }

    setupGlobalEvents() {
        super.setupGlobalEvents();

        let call_button = this.element.querySelector('.start-call');
        call_button.addEventListener('click', (e) => {
            e.preventDefault();
            TIMELINES.call.play();
        })
    }

    setupDOM() {
        super.setupDOM();
    }

    setupEvents() {
        super.setupEvents();
    }
}

export default UiCall;