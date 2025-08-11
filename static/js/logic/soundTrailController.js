import { TrailService } from "../services/trailService.js";


export class SoundTrailController { 
    static init() {
        listenToAddToTrail();
        listenToPlayTrail();
    }
}

function listenToAddToTrail() {
    document.getElementById("map").addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-trail")) {
            let soundId = event.target.value;
            TrailService.addSound(soundId, event.target.marker);
        }
    });
}

function listenToPlayTrail() {
    document.getElementById("play-trail").addEventListener("click", () => {
        TrailService.playTrail();
    });
}


