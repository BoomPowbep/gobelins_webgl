import Ui from "./ui";

class UiPhone extends Ui {
    constructor() {
        super("#app_phone");
    }

    setupGlobalEvents() {
        super.setupGlobalEvents();


        const appIcons = this.element.querySelectorAll(".app-icon");
        appIcons.forEach(value => {
            value.addEventListener('click', (e) => {
                e.preventDefault();
                this.hide();
                DATA.ui_manager.active(value.getAttribute("data-open"));
            })
        })
    }

    setupDOM() {
        super.setupDOM();
    }

    setupEvents() {
        super.setupEvents();
    }
}

export default UiPhone;