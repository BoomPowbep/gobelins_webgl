import Pickable from "./pickable";

/**
 * It's an audio record that user need to find in scene
 */
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
}

export default Record;