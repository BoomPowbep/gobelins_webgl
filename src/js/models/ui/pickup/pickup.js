import Converter from "../../converter";

class Pickup {
    static show(type = "letter", identifier) {
        let message = "";
        const element = document.querySelector('#pickup');
        const  paragraph = element.querySelector('.pickup-content');
        const  progression = element.querySelector('.progression');
        const image = element.querySelector('img');
        const record = element.querySelector('.record');

        if(type === "letter") {
            let picked = DATA.data_manager.letters.countPicked();
            if( picked === 1 ) {
                message = "Tu as trouvé une des 8 lettres manquantes. Plus que 7.";
            } else if( picked === 7 ) {
                message = "Il ne te reste plus qu’une seule lettre à trouver.";
            } else if( picked === 8 ) {
                message = "Toutes les lettres ont été trouvées. Tu peux à présent reconstituer le collage.";
            }

            let letter = DATA.data_manager.get("letter", identifier);
            image.setAttribute('src', letter.getPhoneImage());
            progression.innerText = DATA.data_manager.letters.countPicked() + " / " + DATA.data_manager.letters.count();

            image.style.display = "block";
            record.style.display = "none";
        }
        else {
            message = "Un nouvel enregistrement vocal vient d’être ajouté à tes fichiers.";

            let recordData = DATA.data_manager.get("record", identifier);
            progression.innerText = DATA.data_manager.records.countPicked() + " / " + DATA.data_manager.records.count();
            record.querySelector('.important').innerText = recordData.getRecordName()
            record.querySelector('.small').innerText = Converter.durationToTime(recordData.getAudioFile().duration);

            image.style.display = "none";
            record.style.display = "block";
        }

        paragraph.innerHTML = message;
        element.classList.add("active");
    }
}

export default Pickup;