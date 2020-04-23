class Pickup {
    static show(message, identifier) {
        const element = document.querySelector('#pickup');
        const  paragraph = element.querySelector('.pickup-content');
        const image = element.querySelector('img');

        paragraph.innerHTML = message;
        let letter =  DATA.data_manager.get("letter", identifier);
        console.log(letter);
        image.setAttribute('img', letter)

        element.classList.add("active");
    }
}

export default Pickup;