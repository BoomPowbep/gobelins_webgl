import Pickable from "./pickable";

/**
 * It's an audio record that user need to find in scene
 */
class Record  extends Pickable {
    /**
     * @param {string} identifier
     * @param {AudioFile} audio_file
     * @param record_name
     */
    constructor(identifier, audio_file, record_name = "???") {
        super(identifier);
        this.audio_file = audio_file;
        this.record_name = record_name;
    }

    /**
     * Return the AudioFile
     * @return {AudioFile}
     */
    getAudioFile() {
        return this.audio_file;
    }

    getRecordName() {
        return this.record_name;
    }
}

export default Record;