import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin);

class Conclusion {
    constructor(id, el) {
        this.id = id;
        this.el = el;
        this.played_once = false;

        this.init();

        this.index = 0;
    }

    show() {
        if (!this.played_once) {
            this.el.classList.add('show');
            this.played_once = true;
        }
    }

    hide() {
        this.el.classList.remove('show');
    }

    /*
    We got 2 kinds of conclusions
    1. middle conclusion
    2. final conclusion
    Both have same behaviours. Except for multi slide which has swipe to top ?
     */
    init() {
        let blocks = this.el.querySelectorAll('.conclude');
        //it work like instagram slider, might be refactored in near future (if it's useful)
        //@todo improve to get common slider
        if(blocks.length > 1) {
            //Start Y Position
            let startCl = 0;
            this.el.addEventListener('touchstart', (e) => {
                //Set Y Position in Event
                startCl = e.touches[0].clientY;
            })
            this.el.addEventListener('touchend', (e) => {
                //Get End Y position (in changedTouches, it's not in touches in this case)
                let endCl = e.changedTouches[0].clientY;

                //calc the difference between the touch position
                let delta = startCl - endCl;

                //slide using scrollLeft
                if(delta >= 100)
                    this.scroll(1);
                if(delta <= -100)
                    this.scroll(-1);
            })
        }


        let next = this.el.querySelector('button[data-next-conclusion]');
        if(next)
            next.addEventListener('click', (e) => {
                e.preventDefault();
                this.scroll(1);
            })
    }
    
    scroll(direction = 1) {
        this.index = Math.max(0, this.index+direction);
        gsap.to(this.el, {scrollTo: {y:(this.index* this.el.clientHeight)}, onComplete: () => {
            let next = this.el.querySelector('button[data-next-conclusion]');
            if(this.index === 7) {
                next.innerText = "Crédits";
            }
            else if(this.index === 8) {
                gsap.to(next, {opacity: 0});
            }
            else {
                next.innerText = "Suivant";
            }

        }});
    }
}

export default Conclusion;