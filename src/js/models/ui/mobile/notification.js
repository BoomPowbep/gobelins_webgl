let STOCKED_TIMEOUT = null;

class Notification {
    /**
     * Show a notification
     * @param notification
     */
    static show(notification) {
        let notif = document.querySelector('*[data-open="' + notification + '"] .notification');
        if(notif)
            notif.classList.add('active');
    }

    /**
     * Hide a notification
     * @param notification
     */
    static hide(notification) {
        let notif = document.querySelector('*[data-open="' + notification + '"] .notification');
        if(notif)
            notif.classList.remove('active');
    }

    /**
     * Show a notification with a timeout
     * @param notification Id of notification
     * @param timer delay before exec
     * @param callback
     * @TODO REFACTO
     */
    static timedNotification(notification, timer = 30000, callback = () => {}) {
        if(STOCKED_TIMEOUT !== null) {
            clearTimeout(STOCKED_TIMEOUT);
            STOCKED_TIMEOUT = null;
        }

        STOCKED_TIMEOUT = setTimeout(() => {
            STOCKED_TIMEOUT = null;
            Notification.show(notification);
            callback();
        }, timer);
    }

    static instagramNotification() {
        Notification.timedNotification("instagram", 30000, () => {
            Notification.show("phone");
        })
    }

    static mapNotification() {
        Notification.timedNotification("map", 30000, () => {
            Notification.show("phone");
        })
    }
}

export default Notification;