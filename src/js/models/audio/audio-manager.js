import AudioFile from "./audio-file";
import AUDIO_DICTIONARY from "./audio-dictionnary";

const AUDIO_LIST = [];

class AudioManager {
    /**
     * @return {[AudioFile]}
     */
    static getAudioList() {
        return AUDIO_LIST;
    }

    /**
     * @param key
     * @return {AudioFile}
     */
    static getAudio(key) {
        return AUDIO_LIST.find(value => value.identifier === key);
    }

    static play(key) {
        AudioManager.getAudio(key).getAudioDom().play();
    }

    static init() {
        Object.entries(AUDIO_DICTIONARY).forEach(entry => {
            let value = entry[1];
            console.log(entry);
            let audio = new AudioFile(entry[0], value.file, value.volume??1, value.loop??false);
            AUDIO_LIST.push(audio);
        })

        //Check for all sound ready event
        //To be improve but at least we get a way to see when sounds are ready
        let check = setInterval(() => {
            let hasOneNotReady = AudioManager.getAudioList().find(value => !value.ready);
            if(hasOneNotReady === undefined) {
                document.dispatchEvent(new CustomEvent("sound_ready"));
                clearInterval(check);
            }
        }, 50)
    }
}

export default AudioManager;