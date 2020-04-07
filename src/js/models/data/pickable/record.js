import Pickable from "./pickable";

class Record  extends Pickable {
    /**
     * @param {string} identifier
     * @param {AudioFile} audio_file
     */
    constructor(identifier, audio_file) {
        super(identifier);
        this.audio_file = audio_file;
    }

    /**
     * Return the AudioFile
     * @return {AudioFile}
     */
    getAudioFile() {
        return this.audio_file;
    }

    /**
     * Play the linked audio file
     */
    play() {
        this.getAudioFile().getAudioDom().play();
    }

    /**
     * Stop the linked audio file
     */
    stop() {
        this.getAudioFile().getAudioDom().pause();
    }
}

export default Record;