import * as THREE from 'three';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper';

export default class SoundManager {

    // ------------------------------------------------------------------- OBJECT INITIALIZATION

    /**
     * Construction.
     * @param isDebugMode
     */
    constructor(isDebugMode) {
        console.log('🎼 Sound constructor');

        this._debugMode = isDebugMode;

        this._sounds = [];
    };

    // ------------------------------------------------------------------- DEBUG


    // ------------------------------------------------------------------- MAKE

    /**
     * Creates an Audio object.
     * @param identifier
     * @param path
     * @param play
     * @param loop
     */
    createGenericAudio(identifier, path, play = false, loop = false) {
        let sound = new Audio(path);
        sound.identifier = identifier;

        if(play) sound.play();
        if(loop) sound.loop = true;

        this._sounds.push(sound);
    }

    // ------------------------------------------------------------------- INTERACT

    play(identifier) {
        this.getSoundReferenceByIdentifier(identifier).play();
    }

    pause(identifier) {
        this.getSoundReferenceByIdentifier(identifier).pause();
    }

    // ------------------------------------------------------------------- GETTERS

    getSoundReferenceByIdentifier(identifier) {
        for (let sound of this._sounds) {
            if (sound.identifier === identifier) return sound; // Reference
        }
        console.error("Couldn't find global sound with identifier " + identifier);
        return null;
    }
}
