class UiManager {
    constructor() {
        this.ui_list = {};

        document.querySelector("#phone").addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
        });
    }

    /**
     * Register an UI to the list
     * @param {string} identifier
     * @param {Ui} ui
     */
    registerUi(identifier, ui) {
        this.ui_list[identifier] = ui;
    }

    /**
     * @param {string} identifier
     */
    get(identifier) {
        return this.ui_list[identifier];
    }

    /**
     * @param {string} identifier
     */
    active(identifier) {
        if(identifier != null) {
            let ui = this.get(identifier);
            if(ui !== undefined)
                ui.show();
        }
    }
}

export default UiManager;