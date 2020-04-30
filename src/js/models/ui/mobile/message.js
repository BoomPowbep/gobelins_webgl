class Message {
    static message(message, autoHideDelay = 10000) {
        let messageElement = document.querySelector('#message');
        messageElement.classList.add('active');
        messageElement.innerText = message;

        setTimeout(() => {
            messageElement.classList.remove('active');
        }, autoHideDelay);
    }
}

export default Message;