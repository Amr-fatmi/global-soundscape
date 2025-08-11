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

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return {"sounds": data["results"]}, 200
    except requests.exceptions.RequestException as e:
        print(str(e))
        return {"error": "Freesound API request failed"}, 500

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
        "sort": "score",
        "filter": "geotag:[* TO *] duration:[0 TO 300]",
        "fields": "id,username,name,previews,duration,geotag,created,tags",
        "token": FREESOUND_API_KEY
    }

    results, status = get_freesound_data(params)
    return jsonify(results), status

@app.route("/search")
def search():
    search = request.args.get("search", "")
    if not isinstance(search, str) or not search.strip():
        search = "sound"

    terms = [term.strip() for term in search.split(",") if term.strip()]
    if not terms:
        terms = ["sound"]

    search_query = " OR ".join(terms)

    params = {
        "query": search_query,
        "filter": "geotag:[* TO *] duration:[0 TO 300]",
        "sort": "score",
        "fields": "id,username,name,previews,duration,geotag,created,tags",
        "page_size": 150,
        "page": 1,
        "token": FREESOUND_API_KEY
    }

    results, status = get_freesound_data(params)
    return jsonify(results), status