import LetterList from "./lists/letter-list";
import RecordList from "./lists/record-list";
import Letter from "./pickable/letter";
import LETTERS_VAR from "../variables/letters-var";
import RECORDS_VARS from "../variables/records-var";
import Record from "./pickable/record";
import AudioManager from "../audio/audio-manager";

class DataManager {
    constructor() {
        this.letters = new LetterList( []);
        this.records = new RecordList( []);

        this.initLetters();
        this.initRecords();
    }

    initLetters() {
        LETTERS_VAR.forEach(value => {
            this.letters.add(new Letter(value));
        })
    }

    initRecords() {
        RECORDS_VARS.forEach(value => {
            this.records.add(new Record(value.id, AudioManager.getAudio(value.audio_id)));
        })
    }
}

export default DataManager;