import { BASE_SOUND_API, BASE_SEARCH_API, MAX_PAGES} from "../constants/config.js";
import { Fetch } from "../api.js";
import { SoundCache, FetchedPages } from "../storage.js";
import { Utils } from "../utils/utils.js";

export class SoundService {
    static async loadAndCachGeotaggedSounds(pageSize) {
        let geotagged = [];
        let error = null;

        try {
            let randomPage = Utils.getRandomNumFrom100();
            let newSounds = await SoundApi.default(randomPage, pageSize);
            geotagged = FilterSounds.geotagged(newSounds);

            if (FetchedPages.getCount() < MAX_PAGES) {
                SoundCache.append(geotagged);
                FetchedPages.increase();
            }
        } catch (err) {
            error = err;
        }

        return {
            sounds: geotagged.concat(SoundCache.get()),
            error: error
        };
    }

    static async searchByInput(input) {
        let geotagged = [];
        try {
            let result = await SoundApi.searchFor(input);
            geotagged = FilterSounds.geotagged(result);
        } catch (err) {
            return err;
        }
        return geotagged;
    }

    static getCoordinates(sound) {
        return ExtractFromSound.coordinates(sound);
    }

    static filterByTags(sounds, tags) {
        return FilterSounds.containsTags(sounds, tags);
    }

    static getTopTags(sounds) {
        return AnalyzeSounds.topTags(sounds);
    }
}

class SoundApi {
    static async default(page, pageSize) {
        let appParams = new URLSearchParams({
            page: page,
            pageSize: pageSize,
        });

        let url =`${BASE_SOUND_API}?${appParams.toString()}`;

        return await Fetch.sounds(url);
    }

    static async searchFor(input) {
        let appParams = new URLSearchParams({
            search: input,
        });

        let url =`${BASE_SEARCH_API}?${appParams.toString()}`;

        console.log(url);
        return await Fetch.sounds(url);
    }
};

class FilterSounds {
    static geotagged(sounds) {
        return sounds.filter(sound => sound && sound.geotag != null);
    }

    static containsTags(sounds, tags) {
        let tagsSet = new Set(tags);
        return sounds.filter(sound => sound && 
            Array.isArray(sound.tags) && sound.tags.some(tag => tagsSet.has(tag)));
    }
}

class ExtractFromSound {
    static coordinates(sound) {
        if (!sound.geotag) {
            return null
        };

        let geotag = sound.geotag.trim().split(" ");
        
        if (geotag.length < 2) {
            return null;
        }

        let [lat, lon] = geotag.map(Number);

        if (isNaN(lat) || isNaN(lon)) {
            return null;
        }

        return {lat, lon};
    }
}

class AnalyzeSounds {
    static topTags(sounds) {
        let counter = {};

        for (let sound of sounds) {
            if (sound && Array.isArray(sound.tags)) {

                for (let tag of sound.tags) {
                    counter[tag] = (counter[tag] || 0) + 1;
                }
            }
        }

        const result = Object.entries(counter).sort((a, b) => b[1] - a[1]);
        return result.slice(0, 10);
    }
}