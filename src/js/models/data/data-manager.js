import LetterList from "./lists/letter-list";
import RecordList from "./lists/record-list";
import Letter from "./pickable/letter";
import LETTERS_VAR from "../variables/letters-var";
import RECORDS_VARS from "../variables/records-var";
import Record from "./pickable/record";
import AudioManager from "../audio/audio-manager";
import InstagramPostList from "./lists/instagram-post-list";
import INSTAGRAM_POSTS_VARS from "../variables/instagram-post-var";
import InstagramPost from "./pickable/instagram-post";

class DataManager {
    constructor() {
        this.letters = new LetterList( []);
        this.records = new RecordList( []);
        this.instagramPosts = new InstagramPostList( []);

        this.initLetters();
        this.initRecords();
        this.initInstagramPosts();
    }

    get(type, identifier) {
        switch (type) {
            case "record": {
                return this.records.get(identifier);
                break;
            }
            case "letter": {
                return this.letters.get(identifier);
                break;
            }
            case "instagram": {
                return this.instagramPosts.get(identifier);
                break;
            }
        }
        return null;
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

    initInstagramPosts() {
        Object.entries(INSTAGRAM_POSTS_VARS).forEach(entries => {
            let value = entries[1];
            this.records.add(new InstagramPost(entries[0], value.name, value.commentary, value.images));
        })
    }
}

export default DataManager;