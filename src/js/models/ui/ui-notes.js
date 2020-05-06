import Ui from "./ui";
import Converter from "../converter";
import Template from "../../template/template";
import Notification from "../ui/mobile/notification";

class UiNotes extends Ui {
    constructor() {
        super("#app_notes");

        this.grid = this.element.querySelector('.app-grid');
        this.list = this.element.querySelector('.app-list');
    }

    setupDOM() {
        super.setupDOM();
        let template = new Template("script[data-template='photo_el']");
        this.grid.innerHTML = "";
        DATA.data_manager.letters.items.forEach(value => {
            if (value.isPicked()) {
                template.append(this.grid, {
                    id: value.identifier,
                });
            }
        });
//
        let templateMemo = new Template("script[data-template='memo_el']");
        this.list.innerHTML = "";
        DATA.data_manager.records.items.forEach(value => {
            if (value.isPicked()){
                templateMemo.append(this.list, {
                    id: value.identifier,
                    duration:  (value.audio_file.duration),
                    duration_text: Converter.durationToTime(value.audio_file.duration),
                    name: value.identifier,
                    date: "Aujourd'hui"
                });
            }
        });
        Notification.hide("notes");
    }

    setupEvents() {
        super.setupEvents();

        //MEMO VOCAUX

        let items = this.list.querySelectorAll('.app-list-item');
        items.forEach(value => {
            let record = DATA.data_manager.records.get(value.getAttribute(`data-record`));
            let duration = value.querySelector(".duration");
            let playIcon = value.querySelector(".play");
            let pauseIcon = value.querySelector(".pause");

            let updateTime = null;

            //Si le son a fini d'être joué
            record.getAudioFile().audio.addEventListener('ended', function () {
                pauseIcon.style.display = "none";
                playIcon.style.display = "block";

                duration.innerText = Converter.durationToTime(record.getAudioFile().duration);
                clearInterval(updateTime);
            });

            //bouton pour jouer le son
            playIcon.addEventListener('click', function (e) {
                e.preventDefault();
                record.audio_file.play();
                playIcon.style.display = "none";
                pauseIcon.style.display = "block";

                updateTime = setInterval(function () {
                    duration.innerText = Converter.durationToTime(record.getAudioFile().audio.currentTime);
                }, 250)
            });
            pauseIcon.addEventListener('click', function (e) {
                e.preventDefault();
                record.audio_file.pause();
                pauseIcon.style.display = "none";
                playIcon.style.display = "block";
                clearInterval(updateTime);
            });
        })
    }
}

export default UiNotes;