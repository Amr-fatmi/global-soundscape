import { EventEmitter } from "../utils/eventEmitter.js";
import { EVENTS } from "../constants/events.js";
import { SoundService } from "../services/soundService.js";
import { MapService } from "../services/mapService.js";
import { LocationApi } from "../services/locationService.js";

export class SearchController {
    static init() {
        listenToSearchForm();
        listenToSearchArea();
        EventEmitter.on(EVENTS.VIEW_ZOOM_UPDATED, toggleSearchAreaButton)
    }
}

function toggleSearchAreaButton(zoom) {
    let searchAreaButton = document.getElementById("search-area");

    if (zoom >= 6) {
        searchAreaButton.style.display = "block";
    } else {
        searchAreaButton.style.display = "none";
    }
}

function listenToSearchForm() {
    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();

        let input = document.getElementById("search-input").value;
        handleSearch(input);
    })
}

function listenToSearchArea() {
    document.getElementById("search-area").addEventListener("click", handleSearchAreaClick);
}

async function handleSearchAreaClick() {
    let location = await LocationApi.getCountryName(MapService.getViewCoords());
    handleSearch(location.country);
}

async function handleSearch(input) {
    let sounds = await SoundService.searchByInput(input);
    EventEmitter.emit(EVENTS.SEARCH_MADE, sounds);
}