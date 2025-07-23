let sessionId = localStorage.getItem(`session_id`);
var map;
let tagsChart = null;

document.addEventListener("DOMContentLoaded", () => {
    loadMap();

    if (!sessionId) {
        initializeFirstVisit();
    } else {
        defaultSoundFetching(getPageToFetch(), 30).then( newSounds => {
            saveSounds(newSounds);
            savedSounds = getSavedSounds();
            loadSoundsAndTags(savedSounds);
        });
    }

    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();
        let userSearch = document.getElementById("search-input").value;
        locateLocationOnMap(userSearch);
        fetchUserSearchSounds(userSearch).then( newSounds => {
            loadSoundsAndTags(newSounds);
        });
    });
});

function initializeFirstVisit() {
    sessionId = crypto.randomUUID();
    localStorage.setItem(`session_id`, sessionId);
    localStorage.setItem(`fetched_pages_${sessionId}`, "0");
    localStorage.setItem(`cached_sounds_${sessionId}`, JSON.stringify([]));
    defaultSoundFetching(getPageToFetch(), 150).then( newSounds => {
        saveSounds(newSounds);
        savedSounds = getSavedSounds();
        loadSoundsAndTags(savedSounds);
    });
}

function loadMap() {
    map = L.map("map").setView([30, 0], 2.5);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    }).addTo(map);
}

function loadSoundsAndTags(sounds) {
    let topTags =  countTopTags(sounds);

    loadMarkers(sounds);
    loadTopTagsChart(topTags);
    loadFiltersField(topTags);
}

function locateLocationOnMap(location) {
    let geoParams = new URLSearchParams({
        location: location,
        format: "json",
        limit: 1,
        });

    fetch(
    `https://nominatim.openstreetmap.org/search?q=${geoParams.toString()}`
    )
    .then((res) => res.json())
    .then((data) => {
        if (data.length > 0) {
            map.setView([data[0].lat, data[0].lon], 10);
        } else {
            alert("Location Not Found");
        }
    });
}

function getPageToFetch() {
    page = parseInt(localStorage.getItem(`fetched_pages_${sessionId}`));
    if (page < 100) {
        page++;
    }
    return page;
}

function incrementFetchedPages() {
    page = parseInt(localStorage.getItem(`fetched_pages_${sessionId}`));
    if (page < 100) {
        page++;
        localStorage.setItem(`fetched_pages_${sessionId}`, String(page));
    }
}

function defaultSoundFetching(page, pageSize) {
    let appParams = new URLSearchParams({
        page: page,
        pageSize: pageSize,
    });
    let url =`/sounds?${appParams.toString()}`;
    return fetchSounds(url);
}

function fetchUserSearchSounds(userSearch) {
    let appParams = new URLSearchParams({
            location: userSearch,
        });

    let url =`/search?${appParams.toString()}`;
    return fetchSounds(url);
}

function fetchSounds(url) {
    return fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.sounds);
            return data.sounds;
        });
}

function saveSounds(sounds) {
    console.log(sounds);
    let oldSounds = JSON.parse(localStorage.getItem(`cached_sounds_${sessionId}`));
    let combinedSounds = sounds.concat(oldSounds);
    localStorage.setItem(`cached_sounds_${sessionId}`, JSON.stringify(combinedSounds));
}

function getSavedSounds() {
    let sounds = JSON.parse(localStorage.getItem(`cached_sounds_${sessionId}`)) || [];
    return sounds;
}

function loadMarkers(sounds) {
    console.log(sounds.length);
    for (let i = 0; i < sounds.length; i++) {
        if (sounds[i] && sounds[i].geotag != null) {
            let geotag = sounds[i].geotag.split(" ");
            let lat = Number(geotag[0]);
            let lon = Number(geotag[1]);

            let popupWindow = `
                <b>${sounds[i].name}</b><br>
                <b>By: ${sounds[i].username}</b><br>
                <b>Tags: ${sounds[i].tags[0]}, ${sounds[i].tags[1]}</b><br>
                <audio controls src="${sounds[i].previews["preview-hq-mp3"]}"></audio>
                `;

            let marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(popupWindow).openPopup();
        }    
    }   
}

function loadTopTagsChart(topTags) {
    if (tagsChart) {
        tagsChart.destroy();
    }

    const ctx = document.getElementById("myChart");

    let tags = []
    let data = []
    for (let i = 0; i < topTags.length; i++) {
        if (topTags[i]) {
            tags.push(topTags[i][0])
            data.push(topTags[i][1])
        }
    }

    let chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: tags,
            datasets: [
            {
                label: "Top Tags",
                data: data,
                borderWidth: 1,
            },
            ],
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    tagsChart = chart;

    return chart
}

function loadFiltersField(topTags) {
    let field = document.getElementById("tags-field");
    field.innerHTML = "";

    for (let i = 0; i < topTags.length; i++) {
        if (topTags[i]) {
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("name", "tags");
            checkbox.setAttribute("id", topTags[i][0]);
            checkbox.setAttribute("value", topTags[i][0]);

            let label = document.createElement("label");
            label.setAttribute("for", topTags[i][0]);
            label.innerHTML = topTags[i][0];

            let containerDiv = document.createElement("div");
            containerDiv.className = "checkbox-group";
            containerDiv.appendChild(checkbox);
            containerDiv.appendChild(label);

            field = document.getElementById("tags-field");
            field.appendChild(containerDiv);
        }
    }
}

function countTopTags(sounds) {
    let counter = {};

    for (let sound of sounds) {
        if (sound && sound.tags != null) {

            for (let tag of sound.tags) {
                counter[tag] = (counter[tag] || 0) + 1;
            }
        }
    }

    const resulte = Object.entries(counter).sort((a, b) => b[1] - a[1]);
    return resulte.slice(0, 10);
}


