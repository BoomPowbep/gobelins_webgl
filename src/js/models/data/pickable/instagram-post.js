import Pickable from "./pickable";

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