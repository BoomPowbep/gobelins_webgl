/**
 * @class Ui
 * @classdesc Stock UI in a class to setup his new Dom and his new
 */
class Ui {
    /**
     * Create a new UI
     * @param element_id
     */
    constructor(element_id) {
        this.element_id = element_id;
        this.element = document.querySelector(element_id);
        this.active = false;

        this.setupGlobalEvents();
    }

    /**
     * Setup global events which aren't recreated of show
     */
    setupGlobalEvents() {
        let close =  this.element.querySelector('.app-close');
        if(close)
            close.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide();
            })
    }

    /**
     * Caller for setup events
     * Override for specific events
     */
    setupEvents() {
    }

    /**
     * Caller for build DOM
     * Override for specific DOM
     */
    setupDOM() {
    }

    /**
     * Show the UI
     */
    show() {
        this.setupDOM();
        this.setupEvents();
        this.element.classList.add("display");
        this.active = true;
    }

    /**
     * Hide the UI
     */
    hide() {
        this.element.classList.remove("display");
        this.active = false;
    }
}

export default Ui;