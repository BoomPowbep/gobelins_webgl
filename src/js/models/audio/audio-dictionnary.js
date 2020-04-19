/*
 * List of all audio and specific rules (loop, volume).
 * A sound has a required file. loop and volume are optional
 */
const AUDIO_DICTIONARY = {
    'vocal_1' : {file: "sounds/vocal/vocal1.m4a"},
    'vocal_2' : {file: "sounds/vocal/vocal2.m4a"},
    'birds' : {file: "sounds/birds.mp3", loop: false, volume: 0.1},
    'horn' : {file: "sounds/horn.wav", volume: 0.2},
    'paper' : {file: "sounds/paper.wav", volume: 0.5},
};

export default AUDIO_DICTIONARY;