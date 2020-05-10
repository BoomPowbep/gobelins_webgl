import GameBrain from "../../Game/GameManager/GameManager";
import * as THREE from "three";

class Listening {
    constructor(identifier, duration, audio_file, gauge_geometry_id, starter_geometry_id, callback = () => {}) {
        this.identifier = identifier;
        this.duration = duration;
        this.audio_file = audio_file;
        this.gauge_geometry_id = gauge_geometry_id;
        this.starter_geometry_id = starter_geometry_id;
        this.callback = callback;

        this.listening = false;
        this.listened = false;
        this.listen_timer = null;
        this.animation_tick = null;
    }

    touchStart() {
        if (!this.listened) {

            this.listening = true;

            const duration = this.duration;
            this.listen_timer = setTimeout(() => {
                // Ecoute terminée
                this.listened = true;
            }, duration);

            let gauge_geometry = GameBrain.geometryManager.getGeometryReferenceByIdentifier(this.gauge_geometry_id);
            gauge_geometry.geometry = new THREE.CircleGeometry(gauge_geometry.geometry.parameters.radius,
                gauge_geometry.geometry.parameters.segments,
                0,
                1.6 * Math.PI);

            // Gauge animationk
            const tick = duration / 100;
            const twoPi = 2 * Math.PI;
            let executions = 0;
           this.animation_tick = setInterval(() => {
                executions++;
                const elapsedTime = executions * tick;
                if (this.listened) {
                    //exec at end
                    this.callback();
                    console.log("kjghdkgfhfdkjghdfkjgh");
                    clearInterval(this.animation_tick);
                }

                const angle = elapsedTime * twoPi / duration;

                gauge_geometry.geometry = new THREE.CircleGeometry(gauge_geometry.geometry.parameters.radius,
                    gauge_geometry.geometry.parameters.segments,
                    0,
                    angle);

            }, tick);
        }
    }

    touchEnd() {
        if (this.listened && this.listening) {
            this.listening = false;
            // TODO
        }
        // Ecoute avortée
        else if (!this.listened && this.listening) {
            this.listening = false;
            // Stop timer
            clearTimeout(this.listen_timer);
            // Stop animation
            clearInterval(this.animation_tick);
            // Reset theta
            let gauge_geometry = GameBrain.geometryManager.getGeometryReferenceByIdentifier(this.gauge_geometry_id);
            gauge_geometry.geometry = new THREE.CircleGeometry(gauge_geometry.geometry.parameters.radius,
                gauge_geometry.geometry.parameters.segments,
                0,
                Math.PI * 0.2);
            // Stop sound
            // TODO
        }
    }
}

export default Listening;