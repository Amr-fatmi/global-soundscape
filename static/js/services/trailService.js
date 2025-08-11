let soundsTrail = {};

export class TrailService {
    static addSound(soundId, marker) {
        if (!soundsTrail[soundId]) {
            soundsTrail = {[soundId]: marker};
            console.log(soundsTrail);
        }
    }

    static async playTrail() {
        for (let soundId in soundsTrail) {
            console.log(soundsTrail[soundId]);
            soundsTrail[soundId].openPopup();
            await playSound(soundId);
        }
    }
}

async function playSound(soundId) {
    return new Promise ((resolve) => {
        let soundPlayer = document.getElementById(soundId);
        soundPlayer.addEventListener("ended", () => {
            resolve();
        })
        soundPlayer.play();
    }) 
}