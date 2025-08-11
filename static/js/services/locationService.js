import {NOMINATIM_API } from "../constants/config.js";
import { Fetch } from "../api.js";

export class LocationApi {
    static async getCoordinates(location) {
        let params = new URLSearchParams({
            location: location,
            format: "json",
            limit: 1,
        });

        let url = `${NOMINATIM_API}/search?q=${params.toString()}`;
        
        let result = await Fetch.location(url);
        if (!result || result.length == 0) {
            return null;
        }

        return {
            lat: result[0].lat,
            lon: result[0].lon,
        };
    }

    static async getCountryName(coords) {
        let params = new URLSearchParams({
            lat: coords.lat,
            lon: coords.lon,
            format: "json",
        })

        let url = `${NOMINATIM_API}/reverse?${params.toString()}`;

        let result = await Fetch.location(url);

        console.log(result);

        return result.address;
    }
}