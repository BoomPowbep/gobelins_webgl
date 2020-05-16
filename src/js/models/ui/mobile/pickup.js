class Mobile {
    static unlock() {
        const element = document.querySelector('#phone-opener');
        element.classList.remove('locked');

        //bulle
        Mobile.bubble(true);
    }

    static lock() {
        const element = document.querySelector('#phone-opener');
        element.classList.add('locked');
    }

    static bubble(toggle) {
        document.querySelector('.red-bubble').classList.toggle('hided', !toggle)
    }
}

export default Mobile;