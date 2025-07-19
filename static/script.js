document.addEventListener("DOMContentLoaded", () => {
 let tagsChart = null;

    var map = L.map("map").setView([30, 0], 2.5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    loadDefaultMap();

    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();

        let userSearch = document.getElementById("search-input").value;

        let geoParams = new URLSearchParams({
        city: userSearch,
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

        let appParams = new URLSearchParams({
            city: userSearch,
        });

        fetch(`/search?${appParams.toString()}`)
        .then((res) => res.json())
        .then((data) => {
            if (tagsChart) {
                tagsChart.destroy();
            }
            tagsChart = createTagsChart(data.top_tags);
            
            createFiltersField(data.top_tags);

            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i].geotag != null) {
                    let geotag = data.results[i].geotag.split(" ");

                    let lat = Number(geotag[0]);
                    let lon = Number(geotag[1]);

                    let popupWindow = `
                        <b>${data.results[i].name}</b><br>
                        <b>By: ${data.results[i].username}</b><br>
                        <b>Tags: ${data.results[i].tags[0]}, ${data.results[i].tags[1]}</b><br>
                        <audio controls src="${data.results[i].previews["preview-hq-mp3"]}"></audio>
                        `;

                    let marker = L.marker([lat, lon]).addTo(map);
                    marker.bindPopup(popupWindow).openPopup();
                }
            }
        });
    });

    function createTagsChart(top_tags) {
        const ctx = document.getElementById("myChart");

        let tags = []
        let data = []
        for (let i = 0; i < top_tags.length; i++) {
            tags.push(top_tags[i][0])
            data.push(top_tags[i][1])
        }

        console.log(tags);

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

        return chart
    }

    function createFiltersField(top_tags) {

        let field = document.getElementById("tags-field");
        field.innerHTML = "";

        for (let i = 0; i < top_tags.length; i++) {
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("name", "tags");
            checkbox.setAttribute("id", top_tags[i][0]);
            checkbox.setAttribute("value", top_tags[i][0]);

            let label = document.createElement("label");
            label.setAttribute("for", top_tags[i][0]);
            label.innerHTML = top_tags[i][0];

            let containerDiv = document.createElement("div");
            containerDiv.className = "checkbox-group";
            containerDiv.appendChild(checkbox);
            containerDiv.appendChild(label);

            field = document.getElementById("tags-field");
            field.appendChild(containerDiv);
        }
    }

    function loadDefaultMap() {
        fetch(`/sounds`)
        .then((res) => res.json())
        .then((data) => {
            if (tagsChart) {
                tagsChart.destroy();
            }
            tagsChart = createTagsChart(data.top_tags);
            
            createFiltersField(data.top_tags);

            console.log(data.results);

            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i].geotag != null) {
                    let geotag = data.results[i].geotag.split(" ");

                    let lat = Number(geotag[0]);
                    let lon = Number(geotag[1]);

                    let popupWindow = `
                        <b>${data.results[i].name}</b><br>
                        <b>By: ${data.results[i].username}</b><br>
                        <b>Tags: ${data.results[i].tags[0]}, ${data.results[i].tags[1]}</b><br>
                        <audio controls src="${data.results[i].previews["preview-hq-mp3"]}"></audio>
                        `;

                    let marker = L.marker([lat, lon]).addTo(map);
                    marker.bindPopup(popupWindow).openPopup();
                }
            }
        });
    };

});

