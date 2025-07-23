import os, requests
from dotenv import load_dotenv

from flask import Flask, render_template, request, jsonify

load_dotenv()

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

FREESOUND_API_KEY = os.getenv("FREESOUND_API_KEY")

def get_freesound_data(params):
    url = "https://freesound.org/apiv2/search/text/"
    response = requests.get(url, params=params)

    if response.status_code == 200:

        data = response.json()

        print(data["results"])

        print(f"Data fetched successfully: 200")
        print(f"Pages: {data["count"]}")
        return {"sounds": data["results"]}, 200
    else:
        return {"error": "Freesound API failed"}, response.status_code

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sounds")
def sounds():
    page = request.args.get("page")
    page_size = request.args.get("pageSize")
    params = {
        "query": "sound",
        "page": page,
        "page_size": page_size,
        "filter": "duration:[0 TO 300] geotag:[* TO *]",
        "fields": "id,name,geotag,previews,tags,username",
        "sort": "score_desc",
        "token": FREESOUND_API_KEY
    }

    results, status = get_freesound_data(params)
    return jsonify(results), status

@app.route("/search")
def search():
    location  = request.args.get("location")
    if not location or not isinstance(location, str):
        location = "sound"
    
    params = {
        "query": location,
        "fields": "id,username,name,previews,duration,geotag,created,tags",
        "page_size": 150,
        "page": 1,
        "token": FREESOUND_API_KEY
    }

    results, status = get_freesound_data(params)
    return jsonify(results), status