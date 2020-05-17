class VideoFile {
    constructor(name, end_callback) {
        this.name = name;

        let video = document.createElement( 'video' );
        video.src = `textures/${name}.mp4`;
        video.setAttribute("playsinline", true);
        video.setAttribute("muted", true);
        video.load();

        video.onended = function () {
            end_callback();
        };

        this.video = video;
    }

    appendIn(element) {
        element.append(this.video);
    }

    play() {
        this.video.play();
    }
}

export default VideoFile;