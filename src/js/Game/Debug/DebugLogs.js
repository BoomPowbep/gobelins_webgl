
export default class DebugLogs {

    /**
     * Constructor.
     */
    constructor() {
        this._domContainer = document.createElement("div");
        this._domContainer.classList.add("debugLogsWrapper");
        document.body.appendChild(this._domContainer);
    }

    /**
     * Append log to the logger.
     * @param string
     */
    addLog(string) {
        let log = document.createElement("div");
        log.classList.add("debugLog");
        log.innerHTML = string;

        // Max 4 elements in view
        if(this._domContainer.children.length >= 4) {
            this._domContainer.removeChild(this._domContainer.children[0]);
        }

        this._domContainer.appendChild(log);

        // Remove after timeout
        setTimeout(() => {
            log.remove();
        }, 3000);
    }
}