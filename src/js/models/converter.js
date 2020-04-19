class Converter {
    /**
     * Converter to get a time string instead of a second duration
     * @param duration
     * @return {string}
     */
    static durationToTime(duration) {
        duration = Math.ceil(duration);

        let minutes = Math.floor(duration / 60);
        let seconds = duration - minutes*60;

        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`
    }
}

export default Converter;