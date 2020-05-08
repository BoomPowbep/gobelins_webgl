import {toRad} from "../../Game/Util/Helpers";

const LETTERS_VAR = {
    'letter-1': {
        scene: 0,
        letter: "L",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:-10, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "69", z: "+=14.5"}
    }, //L
    'letter-2': {
        scene: 1,
        letter: "M",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:-7, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "59.5", z: "+=10.6"}
    }, //M

    'letter-3': {
        scene: 1,
        letter: "C",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:-4, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "64.2", z: "+=14.5"}
    }, //C
    'letter-4': {
        scene: 2,
        letter: "V",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:-1, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "49.9", z: "+=18.4"}
    }, //V
    'letter-5': {
        scene: 2,
        letter: "T",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:2, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "59.5", z: "+=21.9"}
    }, //T

    'letter-6': {
        scene: 3,
        letter: "U",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:5, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "54.7", z: "+=14.5"}
    }, //U
    'letter-7': {
        scene: 3,
        letter: "E",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:8, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "64.2", z: "+=29.3"}
    }, //E
    'letter-8': {
        scene: 3,
        letter: "P",
        dragRotate: {x: toRad(20), y: toRad(10), z: toRad(5)},
        dragPos: {x:11, y:-18, z:-25},
        scenePosition:{x: "+=70", y: "69", z: "+=10.6"}
    }  //P
};

export default LETTERS_VAR;