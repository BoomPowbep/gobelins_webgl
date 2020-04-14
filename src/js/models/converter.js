class Converter {
    static durationToTime(duration) {
        duration = Math.ceil(duration);

        let minutes = Math.floor(duration / 60);
        let seconds = duration - minutes*60;

        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`
    }
}

export default Converter;