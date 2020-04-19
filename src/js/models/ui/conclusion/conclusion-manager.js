import Conclusion from "./conclusion";

//Close animation duration
const ANIMATION_LENGTH = 2000;

/**
 * Manager for our conclusion ui
 */
class ConclusionManager {
    /**
     * Create new instance
     */
    constructor() {
        this.list = [];
        this.el = document.querySelector('#conclusion');
        this.init();
    }

    /**
     * Init slides and close button triggers
     */
    init() {
        const conclusions = document.querySelectorAll("#conclusion .conclude-block");
        conclusions.forEach(value => {
            let data = value.getAttribute('data-conclusion');

            this.list.push(new Conclusion(data, value));
        });

        const closeButtons = document.querySelectorAll("*[data-close-conclusion]");
        closeButtons.forEach((value) => {
            let data = value.getAttribute('data-close-conclusion');
            value.addEventListener("click", (e) => {
                this.hide(data);
            })
        })
    }

    /**
     * Get a conclusion
     * @param id
     * @return {T}
     */
    get(id) {
        return this.list.find(value => value.id === id);
    }

    /**
     * Show a conclusion (and hide other ones)
     * @param id
     */
    show(id) {
        //Check if exist
        if(this.get(id) !== undefined) {
            //For each, show or hide based on id
            this.list.forEach(value => {
                if (value.id === id) {
                    value.show();
                } else {
                    value.hide();
                }
            })
            //activate parent div
            this.el.classList.add('active');
        }
    }

    /**
     * Hide a conclusion
     * @param id
     */
    hide(id) {
        this.el.classList.remove('active');
        //we put a little timer here to hide properly conclusion
        setTimeout(() => {
            this.get(id).hide()
        }, ANIMATION_LENGTH);
    }
}

export default ConclusionManager;