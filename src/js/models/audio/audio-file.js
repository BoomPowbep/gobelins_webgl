class AudioFile {
    constructor(identifier, path, volume = 0.5, loop = false) {
        this.identifier = identifier;
        this.path = path;
        this.volume = volume;
        this.loop = loop;
        this.ready = false;

        this.init();
    }

    /**
     * @return {*|HTMLAudioElement|Audio}
     */
    getAudioDom() {
        return this.audio;
    }

    /**
     * Initialise le son
     */
    init() {
        this.audio = new Audio(this.path);
        this.audio.volume = this.volume;
        this.audio.loop = this.loop;

        this.duration = null;

        //Une fois que le son est chargé il passe en state ready
        this.audio.addEventListener('loadeddata', () => {
            this.ready = true;
            this.duration = this.audio.duration;
        });
    }
}

export default AudioFile;