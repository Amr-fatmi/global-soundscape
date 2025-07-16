from dotenv import load_dotenv
import os, requests

from flask import Flask, render_template, request, jsonify

load_dotenv()

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

FREESOUND_API_KEY = os.getenv("FREESOUND_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search")
def search():
    city = request.args.get("city")
    url = "https://freesound.org/apiv2/search/text/"

    params = {
        "query": city,
        "fields": "id,username,name,previews,duration,geotag,created,tags",
        "token": FREESOUND_API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        print(f"Data fetched successfully: 200")
        return jsonify({"results": data["results"]}), 200
    else:
        return jsonify({"error": "Freesound API failed"}), response.status_code