import Ui from "./ui";
import Template from "../../../scss/template/template";
import Converter from "../converter";

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
            template.append(this.grid, {
                id: value.identifier,
            });
        });

        let templateMemo = new Template("script[data-template='memo_el']");
        this.list.innerHTML = "";
        DATA.data_manager.records.items.forEach(value => {
            console.log(value);
            templateMemo.append(this.list, {
                id: value.identifier,
                duration:  (value.audio_file.duration),
                duration_text: Converter.durationToTime(value.audio_file.duration),
                name: value.identifier,
                date: "Aujourd'hui"
            });
            if (value.isPicked()){
            }
        });
    }

    setupEvents() {
        super.setupEvents();

        //MEMO VOCAUX

        let items = document.querySelectorAll('.app-list-item');
        items.forEach(value => {
            let record = DATA.data_manager.records.get(value.getAttribute(`data-record`));

            //range pour la barre de son
            let range = value.querySelector("input[type='range']");
            let wasPlaying = false;

            range.addEventListener('focus', function (e) {
                wasPlaying = record.audio_file.isPlaying;
            });
            range.addEventListener('input', function (e) {
                record.audio_file.pause();
            });
            range.addEventListener('change', function (e) {
                e.preventDefault();
                record.audio_file.audio.currentTime = (range.value);
                if(wasPlaying)
                    record.audio_file.play();
            })
            let range_progression = setInterval(() => {
                if(record.audio_file.isPlaying) {
                    range.value = (record.audio_file.audio.currentTime);
                }
            },  33);

            //bouton pour jouer le son
            value.querySelector("button").addEventListener('click', function (e) {
                e.preventDefault();
                record.audio_file.play();
            })

            //active l'app
            value.querySelector('.app-toggler').addEventListener('click', function (e) {
                e.preventDefault();
                value.querySelector('.app-toggled').classList.toggle("active");
            })
        })
    }
}

export default UiNotes;