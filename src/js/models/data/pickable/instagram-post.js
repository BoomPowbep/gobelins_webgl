import Pickable from "./pickable";

/**
 * Instagram post is a post unlocked on Instagram List for hints on joining scenes
 */
class InstagramPost  extends Pickable {
    /**
     * @param {string} identifier
     * @param {string} name
     * @param {string} commentary
     * @param {[string]} images
     */
    constructor(identifier, name, commentary, images) {
        super(identifier);
        this._name = name;
        this._commentary = commentary;
        this._images = images;
    }

    pickedUp() {
        super.pickedUp();
        //On active l'icon instagram au premier post
        document.querySelector('.app-icon[data-open="instagram"]').classList.remove('disabled');
    }

    getName() {
        return this._name;
    }

    getCommentary() {
        return this._commentary;
    }

    getImages() {
        return this._images;
    }
}

export default InstagramPost;