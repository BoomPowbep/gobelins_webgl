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
        Object.entries(LETTERS_VAR).forEach(value => {
            this.letters.add(new Letter(value[0]));
        })
    }

    initRecords() {
        Object.entries(RECORDS_VARS).forEach(value => {
            this.records.add(new Record(value[0], AudioManager.getAudio(value[1].audio_id)));
        })
    }
}

export default DataManager;