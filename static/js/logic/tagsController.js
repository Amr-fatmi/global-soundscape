import { EventEmitter } from "../utils/eventEmitter.js";
import { EVENTS } from "../constants/events.js";
import { TagUi } from "../ui/tags.js";
import { TagsService } from "../services/tagsService.js";
import { SoundService } from "../services/soundService.js";


export class TagsController {
    static init() {
        EventEmitter.on(EVENTS.INIT, loadTopTagsChart);
        EventEmitter.on(EVENTS.SEARCH_MADE, loadTopTagsChart);
    }    
}

function loadTopTagsChart(sounds) {
    let topTags = SoundService.getTopTags(sounds);
    TagUi.topTagsChart(topTags, (clickedTag) => onTagClick(clickedTag, sounds));
}

function onTagClick(clickedTag, sounds) {
    TagsService.updateSelectedTags(clickedTag);
    let selectedTags = TagsService.getSelectedTags();
    let filteredSounds = SoundService.filterByTags(sounds, selectedTags);
    EventEmitter.emit(EVENTS.SELECTED_TAGS_UPDATED, filteredSounds);
}