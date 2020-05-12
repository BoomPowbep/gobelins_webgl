/**
 * @class Ui
 * @classdesc Stock UI in a class to setup his new Dom and his new
 */
class Ui {
    /**
     * Create a new UI
     * @param element_id
     * @param open_phone_on_hide
     */
    constructor(element_id, open_phone_on_hide = true) {
        this.element_id = element_id;
        this.element = document.querySelector(element_id);
        this.active = false;
        this.open_phone_on_hide = open_phone_on_hide;

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

    hideOnly() {
        this.element.classList.remove("display");
        this.active = false;
    }

    /**
     * Hide the UI
     */
    hide() {
        this.hideOnly();

        if(this.open_phone_on_hide)
            DATA.ui_manager.active("phone");
    }
}

export default Ui;