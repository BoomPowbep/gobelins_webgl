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


    get name() {
        return this._name;
    }

    get commentary() {
        return this._commentary;
    }

    get images() {
        return this._images;
    }
}

export default InstagramPost;