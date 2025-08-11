export class Fetch {
    static async sounds(url) {
     try {
            let response = await fetch(url);
            let json = await response.json();
            if  (!response.ok) {
                throw new Error(`API Error!: ${json.error}, Error Code: ${response.status}`);
            }
            console.log(json.sounds);
            return json.sounds;
        } catch (error) {
            throw error;
        }
    }

    static location(url) {
    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            return data;
        });
    }
}

