import AudioFile from "./audio-file";
import AUDIO_DICTIONARY from "./audio-dictionnary";

const AUDIO_LIST = [];

class AudioManager {
    /**
     * Get all audio registered
     * @return {[AudioFile]}
     */
    static getAudioList() {
        return AUDIO_LIST;
    }

    /**
     * Get an audio from key
     * @param key
     * @return {AudioFile}
     */
    static getAudio(key) {
        return AUDIO_LIST.find(value => value.identifier === key);
    }

    /**
     * Shorter way to play sound
     * @param key
     */
    static play(key) {
        AudioManager.getAudio(key).play(0);
    }

    /**
     * Shorter way to pause sound
     * @param key
     */
    static pause(key) {
        AudioManager.getAudio(key).pause();
    }

    /**
     * Init all sounds
     */
    static init() {
        //Iterate through our audio dictionary
        Object.entries(AUDIO_DICTIONARY).forEach(entry => {
            let value = entry[1];
            let audio = new AudioFile(entry[0], value.file, value.volume??1, value.loop??false, value.autoplay??false);
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

    /**
     * Stop all sounds
     */
    static stopAll() {
        AUDIO_LIST.forEach(value => value.pause());
    }
}

window.AudioManager = AudioManager;

export default AudioManager;