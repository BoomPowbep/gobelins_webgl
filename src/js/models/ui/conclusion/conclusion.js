class Conclusion {
    constructor(id, el) {
        this.id = id;
        this.el = el;

        this.init();
    }

    show() {
        this.el.classList.add('show');
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
                    this.el.scrollTop += this.el.clientHeight;
                if(delta <= -100)
                    this.el.scrollTop -= this.el.clientHeight;
            })
        }
    }
}

export default Conclusion;