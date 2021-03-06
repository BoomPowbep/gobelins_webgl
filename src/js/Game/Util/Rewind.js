import VARS from "../../models/vars";
import AudioManager from "../../models/audio/audio-manager";

class Rewind {
    static dateRewind(el, start, end, duration = 4000) {
        AudioManager.play("ambient_tick");
        const DELAY = 10;

        //On calcule les scores du début à la fin
        let score_start = start.day * (24*3600)  + start.hour*3600 + start.minute*60;
        let score_end = end.day * (24*3600)  + end.hour*3600 + end.minute*60;

        //on calcule la diff et ce qu'on ajoutera au prochain timeout
        let beginEndDiff = Math.abs(score_end - score_start);
        let addBy = Math.ceil(beginEndDiff / duration * DELAY);

        //on check si on est sur une progression positive ou pas
        let progression = 1;
        if(score_start >= score_end)
            progression = -1;

        //On commence
        let begin = score_start;

        let lastDay = start.weekDay;

        let interval = setInterval(function () {
            begin += addBy * progression;
            if((progression === 1 && begin >= score_end) || (progression === -1 && begin <= score_end))  {
                //fin de l'interval, on clear l'interval et on set la date finale
                clearInterval(interval);
                AudioManager.pause("ambient_tick");
                el.innerHTML = `<span>${end.hour <= 9 ? `0${end.hour}`: end.hour}:${end.minute <= 9 ? `0${end.minute}`: end.minute}</span><span>${VARS.DAYS[end.weekDay]} ${end.day} ${start.month}</span>`;
            }
            else {
                //on calcule les jours, les heures et les minutes
                let day = Math.floor(begin/(24*3600));
                let hours = Math.floor((begin - (day*24*3600))/3600);
                let minutes = Math.floor((begin - (day*24*3600) - (hours*3600))/60);
                //on set en formattant
                el.innerHTML = `<span>${hours <= 9 ? `0${hours}`: hours}:${minutes <= 9 ? `0${minutes}`: minutes}</span><span>${VARS.DAYS[start.weekDay + (day - start.day)]} ${day} ${start.month}</span>`;
            }

        }, DELAY);
    }
}

export default Rewind;