import { MapLoader } from "../ui/map.js";
import { TagUi } from "../ui/tags.js";
import { SoundService } from "../services/soundService.js";
import { LocationApi } from "../services/locationService.js";

let selectedTags = [];
let soundsTrail = {};
let mapView = {};

export async function loadPage(pageSize) {
    let {sounds, error} = await SoundService.loadAndCachGeotaggedSounds(pageSize);
    if (error) {
        console.error(`Error occurred!: ${error.message}`)
    }
    MapLoader.addMarkers(sounds);
    MapLoader.onMoveEnd(handleMapMoveEnd);
    loadTopTagsChart(sounds);
    listenToSearch();
    listenToAddToTrail();
    listenToPlayTrail();
    listenToSearchArea()
}

export function listenToSearch() {
    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();

        let userInput = document.getElementById("search-input").value;
        handleSearch(userInput);
    });
}

async function handleSearch(userInput) {
    let sounds = await SoundService.searchByInput(userInput);
    MapLoader.addMarkers(sounds);

    loadTopTagsChart(sounds);
}

function loadTopTagsChart(sounds) {
    let topTags = SoundService.getTopTags(sounds);
    TagUi.topTagsChart(topTags, (clickedTag) => {
        if (selectedTags.includes(clickedTag)) {
            selectedTags = selectedTags.filter(tag => tag !== clickedTag);
        } else {
            selectedTags.push(clickedTag);
        }

        handleTagClick(sounds);
    })
}

function handleTagClick(sounds) {
    if (selectedTags.length === 0) {
        loadPage(30);
    } else {
        let filteredSounds = SoundService.filterByTags(sounds, selectedTags);
        console.log(filteredSounds);
        MapLoader.clearMarkers();
        MapLoader.addMarkers(filteredSounds);
    }
}

function listenToAddToTrail() {
    document.getElementById("map").addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-trail")) {
            let audioId = event.target.value;
            let marker = event.target.marker;
            if (!soundsTrail[audioId]) {
                soundsTrail[audioId] = marker;
            }
        }
    });
}

function listenToPlayTrail() {
    let playTrailButton = document.getElementById("play-trail");

    playTrailButton.addEventListener("click", async () => {
        for (let audioId in soundsTrail) {
           soundsTrail[audioId].openPopup();
           await playAudio(audioId);
        }
    })
}

function playAudio(id) {
    return new Promise((resolve) => {
        let audio = document.getElementById(id);
        audio.addEventListener("ended", () => {
            resolve();
        })
        audio.play();
    })
}

function handleMapMoveEnd(coords, zoom) {
    trackMapMoveEnd(coords, zoom);
    toggleSearchAreaButton();
}

function trackMapMoveEnd(coords, zoom) {
    mapView["lat"] = coords.lat;
    mapView["lon"] = coords.lng;
    mapView["zoom"] = zoom;
}

function toggleSearchAreaButton() {
    let searchAreaButton = document.getElementById("search-area");

    if (mapView.zoom >= 6) {
        searchAreaButton.style.display = "block";
    } else {
        searchAreaButton.style.display = "none";
    }
}

function listenToSearchArea() {
    document.getElementById("search-area").addEventListener("click", async () => {
        if (mapView.zoom >= 6) {
            console.log(`Coords: Lat: ${mapView.lat}. Lon: ${mapView.lon}. Zoom: ${mapView.zoom}`);

            let input = await LocationApi.getCountryName(mapView);

            if (mapView.zoom >= 12) {
                handleSearch(input.city);
            }

            handleSearch(input.country);
        }
    })
}


















