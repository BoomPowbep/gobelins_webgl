import Ui from "./ui";
import Template from "../../template/template";
import Notification from "../ui/mobile/notification";
import gsap from "gsap";
import {Power0} from "gsap/all";

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
        let templateImageIg = new Template("script[data-template='ig_slide']");
        this.list.innerHTML = "";
        DATA.data_manager.instagramPosts.items.forEach(value => {
            if (value.isPicked()){
                templateIg.append(this.list, {
                    id: value.identifier,
                    name: value.getName(),
                    commentary: value.getCommentary(),
                    total: value.getImages().length
                });
            }
        });

        //slide instagram
        let items = this.list.querySelectorAll('.app-list-item');
        items.forEach(value => {
            let dots = value.querySelector('.dots');
            //on récup l'attribut
            let post = value.getAttribute('data-ig');

            //on récup les données du post
            let postData = DATA.data_manager.instagramPosts.get(post);

            //on ajoute les photos
            postData.getImages().forEach((photo, index) => {
                templateImageIg.append(value.querySelector('.slider'), {
                    index,
                    path: photo
                });

                //On ajoute un DOT pour le slider
                let dot = document.createElement('div');
                dot.classList.add('dot');
                if(index === 0)
                    dot.classList.add('active');
                dot.setAttribute('data-index', index);
                dots.append(dot);
            })
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
        let items = document.querySelectorAll('.app-list-item');
        items.forEach(value => {
            //index du slide
            let index = 0;

            //Elements
            let progression = value.querySelector('.progression');
            let dots = value.querySelectorAll('.dots .dot');
            let slider = value.querySelector('.slider');
            let slides = value.querySelectorAll('.slide');

            //slider scroll
            let scrollTo = (new_index) => {
                index = Math.min(slides.length-1, Math.max(0, new_index));
                let item = value.querySelector(`.slide[data-index="${index}"]`);
                if(item)
                    gsap.to(slider, {scrollTo: {x: item}, ease: Power0.easeNone, onComplete: () => {
                        //on change la progression
                        progression.innerText = `${index+1} / ${slides.length}`;

                        //On active les dots
                        dots.forEach(value1 => {
                            value1.classList.toggle('active', value1.getAttribute('data-index') == index)
                        })
                    }});
            };

            //EVENTS

            //Start X Position
            let startCl = 0;

            if(slider !== null) {
                slider.addEventListener('touchstart', (e) => {
                    startCl = e.touches[0].clientX;
                });
                slider.addEventListener('touchend', (e) => {
                    //Get End X position (in changedTouches, it's not in touches in this case)
                    let endCl = e.changedTouches[0].clientX;

                    //calc the difference between the touch position
                    let delta = startCl - endCl;

                    //slide using scrollLeft
                    if (delta >= 100)
                        scrollTo(index + 1);
                    if (delta <= -100)
                        scrollTo(index - 1);
                })
            }
        });
    }
}

export default UiInstagram;