import os, requests
from dotenv import load_dotenv
from collections import Counter

from flask import Flask, render_template, request, jsonify

load_dotenv()

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

FREESOUND_API_KEY = os.getenv("FREESOUND_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sounds")
def sounds():
    url = "https://freesound.org/apiv2/search/text/"
    params = {
        "query": "sound",
        "page": 1,
        "page_size": 100,
        "filter": "duration:[0 TO 300] geotag:[* TO *]",
        "fields": "id,name,geotag,previews,tags,username",
        "sort": "score_desc",
        "token": FREESOUND_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:

        data = response.json()

        print(data["results"])

        results = data["results"]
        all_tags = []

        for sound in results:
            all_tags.extend(sound["tags"])

        top_tags = Counter(all_tags).most_common(10)
        print(top_tags)

        print(f"Data fetched successfully: 200")
        print(f"Pages: {data["count"]}")
        return jsonify({"results": results, "top_tags": top_tags}), 200
    else:
        return jsonify({"error": "Freesound API failed"}), response.status_code


@app.route("/search")
def search():
    city = request.args.get("city")
    url = "https://freesound.org/apiv2/search/text/"

    params = {
        "query": city,
        "fields": "id,username,name,previews,duration,geotag,created,tags",
        "page_size": 150,
        "page": 1,
        "token": FREESOUND_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:

        data = response.json()

        results = data["results"]
        all_tags = []

        for sound in results:
            all_tags.extend(sound["tags"])

        top_tags = Counter(all_tags).most_common(10)
        print(top_tags)


        
        print(f"Data fetched successfully: 200")
        print(f"Pages: {data["count"]}")
        return jsonify({"results": results, "top_tags": top_tags}), 200
    else:
        return jsonify({"error": "Freesound API failed"}), response.status_code