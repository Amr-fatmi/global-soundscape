import { EventEmitter } from "../utils/eventEmitter.js"
import { EVENTS } from "../constants/events.js";
let mapView = {};

export class MapService {
    static updateMapView(coords, zoom) {
        mapView = {
            lat: coords.lat,
            lon: coords.lng,
            zoom: zoom
        };
    }

    static getViewCoords() {
        return {
            lat: mapView.lat,
            lon: mapView.lon
        };
    }

    static getViewZoom() {
        return mapView.zoom;
    }
}

