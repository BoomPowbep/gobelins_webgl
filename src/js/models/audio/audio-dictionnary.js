/*
 * List of all audio and specific rules (loop, volume).
 * A sound has a required file. loop and volume are optional
 */
const AUDIO_DICTIONARY = {
    //vocaux
    'vocal_1' : {file: "sounds/vocal/vocal1.mp3"},
    'vocal_2' : {file: "sounds/vocal/vocal2.mp3"},
    'vocal_3' : {file: "sounds/vocal/vocal3.mp3"},

    //papier
    'paper' : {file: "sounds/paper.wav", volume: 0.5},

    //introduction
    'passant_0' : {file: "sounds/passant/collage-0.m4a", volume: 0.5},
    'ringtone' : {file: "sounds/ringtone.mp3", volume: 0.5, loop: true},

    'appel' : {file: "sounds/street/appel.mp3", volume: 0.5},
    'passant_1' : {file: "sounds/street/passant_1.mp3", volume: 0.5},
    'passant_2' : {file: "sounds/street/passant_2.mp3", volume: 0.5},

    'ambient_cricket' : {file: "sounds/ambient/Crikets.mp3", volume: 0.5, loop: true},
    'ambient_bar' : {file: "sounds/ambient/Bar.mp3", volume: 0.5, loop: true},
    'ambient_voiture' : {file: "sounds/ambient/Voitures.mp3", volume: 0.5, loop: true},
};

export default AUDIO_DICTIONARY;