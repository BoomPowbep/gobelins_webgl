import GameBrain from "../../Game/GameManager/GameManager";
import * as THREE from "three";
import AudioManager from "../audio/audio-manager";

class Listening {
    /**
     *
     * @param identifier
     * @param duration
     * @param {string} audio_file
     * @param gauge_geometry_id
     * @param starter_geometry_id
     * @param callback
     */
    constructor(identifier, duration, audio_file, gauge_geometry_id, starter_geometry_id, callback = () => {}) {
        this.identifier = identifier;
        this.duration = duration;
        this.audio_file = audio_file;
        this.gauge_geometry_id = gauge_geometry_id;
        this.starter_geometry_id = starter_geometry_id;
        this.callback = callback;

        this.listening = false;
        this.listened = false;
        this.animation_tick = null;
    }

    touchStart() {
        this.listening = true;

        const duration = this.duration;

        let gauge_geometry = GameBrain.geometryManager.getGeometryReferenceByIdentifier(this.gauge_geometry_id);
        gauge_geometry.geometry = new THREE.CircleGeometry(gauge_geometry.geometry.parameters.radius,
            gauge_geometry.geometry.parameters.segments,
            0,
            1.6 * Math.PI);



        // Gauge animationk
        const tick = duration / 100;
        const twoPi = 2 * Math.PI;
        let executions = 0;

        AudioManager.getAudio(this.audio_file).play(0);

       this.animation_tick = setInterval(() => {
            executions++;
            const elapsedTime = executions * tick;

            if(elapsedTime >= duration) {
                //première écoute
                if (!this.listened) {
                    this.callback();
                }
                this.listened = true;
                AudioManager.getAudio(this.audio_file).pause();
            }

            if (this.listened) {
                //exec at end
                clearInterval(this.animation_tick);
            }

            const angle = elapsedTime * twoPi / duration;

            gauge_geometry.geometry = new THREE.CircleGeometry(gauge_geometry.geometry.parameters.radius,
                gauge_geometry.geometry.parameters.segments,
                0,
                angle);

        }, tick);
    }

    touchEnd() {
        if (this.listened && this.listening) {
            this.listening = false;
            AudioManager.getAudio(this.audio_file).pause();
        }
        // Ecoute avortée
        else if (!this.listened && this.listening) {
            this.listening = false;
            // Stop animation
            clearInterval(this.animation_tick);
            // Reset theta
            let gauge_geometry = GameBrain.geometryManager.getGeometryReferenceByIdentifier(this.gauge_geometry_id);
            gauge_geometry.geometry = new THREE.CircleGeometry(gauge_geometry.geometry.parameters.radius,
                gauge_geometry.geometry.parameters.segments,
                0,
                Math.PI * 2);
            // Stop sound
            AudioManager.getAudio(this.audio_file).pause();
        }
    }
}

export default Listening;