import Ui from "./ui";
import Template from "../../template/template";
import Notification from "../ui/mobile/notification";

/**
 * UI For Instagram in Game APP
 */
class UiInstagram extends Ui {
    constructor() {
        super("#app_instagram");

        this.list = this.element.querySelector('.app-list');
    }

    /**
     * Create dom LIST for Instagram Post
     */
    setupDOM() {
        super.setupDOM();

        let templateIg = new Template("script[data-template='ig_el']");
        this.list.innerHTML = "";
        DATA.data_manager.instagramPosts.items.forEach(value => {
            if (value.isPicked()){
                templateIg.append(this.list, {
                    name: value.getName(),
                    commentary: value.getCommentary(),
                });
            }
        });

        Notification.hide("instagram");
    }

    /**
     * Create events for Instagram Post
     */
    setupEvents() {
        super.setupEvents();

        /*
            SLIDERS USING NATIVE EVENTS AND COMPONENTS.
            We don't need a heavy library so we write a very light one
         */
        let sliders = document.querySelectorAll('.slider');
        sliders.forEach(value => {
            //Start X Position
            let startCl = 0;
            value.addEventListener('touchstart', (e) => {
                e.preventDefault();
                //Set X Position in Event
                startCl = e.touches[0].clientX;
            })
            value.addEventListener('touchend', (e) => {
                //Get End X position (in changedTouches, it's not in touches in this case)
                let endCl = e.changedTouches[0].clientX;

                //calc the difference between the touch position
                let delta = startCl - endCl;

                //slide using scrollLeft
                if(delta >= 100)
                    value.scrollLeft += value.clientWidth;
                if(delta <= -100)
                    value.scrollLeft -= value.clientWidth;
            })
        });
    }
}

export default UiInstagram;