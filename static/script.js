document.addEventListener("DOMContentLoaded", () => {
    var map = L.map("map").setView([30, 0], 2.5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    
    document.getElementById("search-form").addEventListener("submit", (event) => {
        event.preventDefault();

        let userSearch = document.getElementById("search-input").value;
        
        let params = new URLSearchParams();
        params.append("city", userSearch);

        fetch(`/search?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
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
                console.log(data.results)
            })
    })
});
