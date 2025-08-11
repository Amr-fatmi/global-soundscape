import { MAX_PAGES } from "./constants/config.js";
import { Utils } from "./utils/utils.js";

export function initStorage() {
    localStorage.setItem(Utils.getStorageKey("fetched_pages"), "0");
    localStorage.setItem(Utils.getStorageKey("cached_sounds"), JSON.stringify([]));
}

export function createLocationStorage(address, sounds) {
    localStorage.setItem(Utils.getStorageKey(address), JSON.stringify(sounds));
}

export class SoundCache {
    static append(newSounds) {
        let oldSounds = JSON.parse(localStorage.getItem(Utils.getStorageKey("cached_sounds")));
        let combinedSounds = newSounds.concat(oldSounds);
        localStorage.setItem(Utils.getStorageKey("cached_sounds"), JSON.stringify(combinedSounds));
    }

    static get() {
        let sounds =
        JSON.parse(localStorage.getItem(Utils.getStorageKey("cached_sounds"))) || [];
        return sounds;
    }
}

export class FetchedPages {
    static getCount() {
        let page = parseInt(localStorage.getItem(Utils.getStorageKey("fetched_pages")));
        return page;
    }

    static increase() {
        let page = this.getCount();
        if (page < MAX_PAGES) {
            page++;
            localStorage.setItem(Utils.getStorageKey("fetched_pages"), String(page));
        }
        return page;
    }
}
