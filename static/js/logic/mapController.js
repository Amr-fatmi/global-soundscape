import { EventEmitter } from "../utils/eventEmitter.js";
import { EVENTS } from "../constants/events.js";
import { MapLoader } from "../ui/map.js";
import { MapService } from "../services/mapService.js";


export class MapController { 
    static init() {
        MapLoader.init();
        MapLoader.onMoveEnd(trackMapView);
        EventEmitter.on(EVENTS.INIT, updateMarkers);
        EventEmitter.on(EVENTS.SEARCH_MADE, updateMarkers);
        EventEmitter.on(EVENTS.SELECTED_TAGS_UPDATED, markSelectedTags);
    }
}    

function updateMarkers(sounds) {
    MapLoader.addMarkers(sounds);
}

function markSelectedTags(sounds) {
    MapLoader.clearMarkers()
    MapLoader.addMarkers(sounds);
}

function trackMapView(coords, zoom) {
    MapService.updateMapView(coords, zoom) 
    EventEmitter.emit(EVENTS.VIEW_COOREDS_UPDATED, MapService.getViewCoords());
    EventEmitter.emit(EVENTS.VIEW_ZOOM_UPDATED, MapService.getViewZoom());
}





