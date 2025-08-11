import { DEFAULT_MAP_COORDS, DEFAULT_MAP_ZOOM, LOCATING_ZOOM } from "../constants/config.js";
import { LocationApi } from "../services/locationService.js";
import { Utils } from "../utils/utils.js";
import { SoundService } from "../services/soundService.js";
let map;
let layerGroups = {};

export class MapLoader {

    static init() {
        map = L.map("map", {
            minZoom: 2, 
            worldCopyJump: true, 
            zoomControl: false,
        }).setView(DEFAULT_MAP_COORDS, DEFAULT_MAP_ZOOM);

        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                attribution: "Tiles © Esri",
            }
        ).addTo(map);

        L.tileLayer(
            'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Labels © Esri',
                pane: 'overlayPane'
            }
        ).addTo(map);

        //L.layerGroup().addTo(map);

        layerGroups["default"] = new L.MarkerClusterGroup().addTo(map);

    }

    static addMarkers(sounds) {
        sounds.forEach(sound => {
            let coords = SoundService.getCoordinates(sound);
            if (!coords) {
                return;
            }
            let marker = L.marker([coords.lat, coords.lon], {wrapLng: true})
            .addTo(layerGroups["default"]);
            marker.bindPopup(Utils.createPopupHTML(sound, marker));
        });
    }

    static clearMarkers() {
        layerGroups["default"].remove();
        layerGroups["default"] = L.layerGroup().addTo(map);
    }

    static  async locateOnMap(location, fallback) {
        let geoData = await LocationApi.getCoordinates(location);
        if (geoData) {
            map.setView([geoData.lat, geoData.lon], LOCATING_ZOOM);
        } else {
            map.setView([fallback.lat, fallback.lon], LOCATING_ZOOM);
        }
    }

    static onMoveEnd(trackMapView) {
        map.on("moveend", () => {
            trackMapView(map.getCenter(), map.getZoom());
        })
    }
}







