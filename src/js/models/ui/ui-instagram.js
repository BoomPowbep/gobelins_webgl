import Ui from "./ui";
import Template from "../../../scss/template/template";
import Converter from "../converter";

class UiInstagram extends Ui {
    constructor() {
        super("#app_instagram");

        this.list = this.element.querySelector('.app-list');
    }

    setupDOM() {
        super.setupDOM();

        let templateIg = new Template("script[data-template='ig_el']");
        this.list.innerHTML = "";
        DATA.data_manager.instagramPosts.items.forEach(value => {
           // if (value.isPicked()){
            templateIg.append(this.list, {
                name: value.getName(),
                commentary: value.getCommentary(),
            });
           // }
        });
    }

    setupEvents() {
        super.setupEvents();

        let sliders = document.querySelectorAll('.slider');
        sliders.forEach(value => {
            let startCl = 0;
            value.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startCl = e.touches[0].clientX;
            })
            value.addEventListener('touchend', (e) => {
                e.preventDefault();
                let endCl = e.changedTouches[0].clientX;

                let delta = startCl - endCl;
                console.log(value.clientWidth);
                if(delta >= 100)
                    value.scrollLeft += value.clientWidth;
                if(delta <= -100)
                    value.scrollLeft -= value.clientWidth;
            })
        });
    }
}

export default UiInstagram;