import Ui from "./ui";
import Template from "../../../scss/template/template";
import Converter from "../converter";

class UiMemo extends Ui {
    constructor() {
        super("#app_memo");

        this.list = this.element.querySelector('.app-list');
    }

    setupDOM() {
        super.setupDOM();
        let template = new Template("script[data-template='memo_el']");
        DATA.data_manager.records.items.forEach(value => {
            console.log(value);
            template.append(this.list, {
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
        let items = document.querySelectorAll('.app-list-item');
        items.forEach(value => {
            let record = DATA.data_manager.records.get(value.getAttribute(`data-record`));

            //range pour la barre de son
            let range = value.querySelector("input[type='range']");
            range.addEventListener('change', function (e) {
                e.preventDefault();
                record.audio_file.pause();
                record.audio_file.audio.currentTime = (range.value);
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

export default UiMemo;