/**
 * This class is an override of Audio File
 */
class AudioFile {
    /**
     * @param {string} identifier Technical name of the sound (use for call etc)
     * @param {string} path Path of sound file
     * @param {number} volume Min 0 max 1
     * @param {boolean} loop Is sound looped ?
     */
    constructor(identifier, path, volume = 0.5, loop = false) {
        this.identifier = identifier;
        this.path = path;
        this.volume = volume;
        this.loop = loop;
        this.ready = false;

        this.isPlaying = false;

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
        //With create audio and set volume and loop
        this.audio = new Audio(this.path);
        this.audio.volume = this.volume;
        this.audio.loop = this.loop;

        //Init sound duration is null
        this.duration = null;

        //When sound is load it's ready
        this.audio.addEventListener('loadeddata', () => {
            this.ready = true;
            this.duration = this.audio.duration;
        });

        //When a sound has finish to be played
        this.audio.addEventListener("ended", function(){
            this.isPlaying = false;
        });
    }

    /**
     * Play sound
     * @param startAt
     */
    play(startAt = null) {
        if(startAt != null)
            this.audio.currentTime = startAt;
        this.audio.play();

        this.isPlaying = true;
    }

    /**
     * Pause sound
     */
    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }
}

export default AudioFile;