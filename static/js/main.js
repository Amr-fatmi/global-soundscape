import { EventEmitter } from "./utils/eventEmitter.js";
import { EVENTS } from "./constants/events.js";
import { LARGE_PAGE_SIZE } from "./constants/config.js";
import { Session } from "./session.js";
import { initStorage } from "./storage.js";
import { SoundService } from "./services/soundService.js";
import { MapController } from "./logic/mapController.js";
import { SearchController } from "./logic/searchController.js"
import { TagsController } from "./logic/tagsController.js";
import { SoundTrailController } from "./logic/soundTrailController.js";

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
    if (Session.init()) {
        initStorage();
    }

    MapController.init();
    SearchController.init();
    TagsController.init();
    SoundTrailController.init();

    let {sounds, error} = await SoundService.loadAndCachGeotaggedSounds(LARGE_PAGE_SIZE);
    if (error) {
        console.error(`Error occurred!: ${error.message}`)
    }

    EventEmitter.emit(EVENTS.INIT, sounds);
}
