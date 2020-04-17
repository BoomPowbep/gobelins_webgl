class Ui {
    constructor(element_id) {
        this.element_id = element_id;
        this.element = document.querySelector(element_id);
        this.active = false;
    }

    /**
     * Caller for all registration
     */
    init(){
        this.setupDOM();
        this.setupEvents();
    }

    /**
     * Caller for setup events
     */
    setupEvents() {
        let close =  this.element.querySelector('.app-close'); 
        if(close)
            close.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide();
            })
    }

    /**
     * Caller for build DOM
     */
    setupDOM() {
    }

    show() {
        this.init();
        this.element.classList.add("display");
        this.active = true;
    }

    hide() {
        this.element.classList.remove("display");
        this.active = false;
    }
}

export default Ui;