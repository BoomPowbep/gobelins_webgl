class Mobile {
    static unlock() {
        const element = document.querySelector('#phone-opener');
        element.classList.remove('locked');
    }
}

export default Mobile;