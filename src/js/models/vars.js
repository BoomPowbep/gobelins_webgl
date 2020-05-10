const VARS = {
    DRAG_N_DROP_DELTA : 0.3,
    HOURS : {
        BEGIN :{weekDay: 0, day: "21", month: "mars", hour: 0, minute: 15},
        SCENE_INTRO :{weekDay: 4, day: "25", month: "mars", hour: 16, minute: 30},
        SCENE_1 :{weekDay: 4, day: "25", month: "mars", hour: 19, minute: 20},
        SCENE_2 :{weekDay: 4, day: "25", month: "mars", hour: 22, minute: 40},
        SCENE_3 :{weekDay: 4, day: "25", month: "mars", hour: 23, minute: 50},
        SCENE_FINAL :{weekDay: 5, day: "26", month: "mars", hour: 1, minute: 15},
    },
    DAYS : [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche'
    ],
    SCENERIES : {
        BAR : 'BistroScenery',
        POLICE : 'ComissariatScenery',
        STREET : 'StreetScenery',
        COLLEUSE : 'ColleusesScenery',
    }
};

export default VARS;