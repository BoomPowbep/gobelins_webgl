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

/**
 * Manager for all experience data
 */
class DataManager {
    /**
     * Create lists and init their contents
     */
    constructor() {
        this.letters = new LetterList( []);
        this.records = new RecordList( []);
        this.instagramPosts = new InstagramPostList( []);

        this.initLetters();
        this.initRecords();
        this.initInstagramPosts();
    }

    /**
     * Get specific element in lists
     * @param type
     * @param identifier
     * @return {Pickable|null}
     */
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

    /**
     * Init letter list
     */
    initLetters() {
        Object.entries(LETTERS_VAR).forEach(value => {
            let v = value[1];
            this.letters.add(new Letter(value[0], v.scene, v.letter, v.dragPos, v.dragRotate, v.scenePosition));
        })
    }


    /**
     * Init record list
     */
    initRecords() {
        Object.entries(RECORDS_VARS).forEach(value => {
            this.records.add(new Record(value[0], AudioManager.getAudio(value[1].audio_id), value[1].record_name));
        })
    }


    /**
     * Init instagram post list
     */
    initInstagramPosts() {
        Object.entries(INSTAGRAM_POSTS_VARS).forEach(entries => {
            let value = entries[1];
            this.instagramPosts.add(new InstagramPost(entries[0], value.name, value.commentary, value.images));
        })
    }
}

export default DataManager;