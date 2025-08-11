import { Session } from "../session.js";

export class Utils {
    
    static getRandomNumFrom100() {
        let randomNum = Math.floor(Math.random() * 100) + 1;
        return randomNum;
    }

    static getStorageKey(base) {
        return `${base}_${Session.getId}`;
    }

    static createPopupHTML(sound, marker) {
        let container = document.createElement("div");

        function createButton(marker) {
            let button = document.createElement("button");
            button.className = "add-to-trail";
            button.type = "button";
            button.textContent = "Add to trail";
            button.value = `sound-${sound.id}`;

            button.marker = marker;
            return button;
        }

        let popupWindow = `
            <b>${sound.name}</b><br>
            <b>By: ${sound.username}</b><br>
            <b>Tags: ${sound.tags[0]}, ${sound.tags[1]}</b><br>
            <b>Created: ${sound.created}</b><br>
            <audio id=sound-${sound.id} controls src="${sound.previews["preview-hq-mp3"]}"></audio>`;

        container.innerHTML = popupWindow;
        container.appendChild(createButton(marker));

        return container;
    }
}

