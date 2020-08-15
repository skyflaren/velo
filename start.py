import numpy as np, pandas as pd

from flask import Flask, redirect, url_for, render_template, request, jsonify
from geolocation_clustering import geolocation_cluster

app = Flask(__name__)

trip_length = ""
names = []
lats = []
lons = []
durs = []


@app.route("/", methods=['GET', 'POST'])
def home():
    return render_template("index.html")


@app.route('/process', methods=['POST'])
def process():
    trip_length = request.form['time']
    rating = request.form['rating']
    names = eval(request.form['names'])
    lats = eval(request.form['latitudes']) #stringed array back to list
    lons = eval(request.form['longitudes'])
    durs = eval(request.form['durations'])

    print(trip_length)
    print(rating)
    print(names)
    print(lats)
    print(lons)
    print(durs)

    if not(trip_length and names):
        return jsonify({'warning': 'Missing Fields!'})

    trip_length = int(trip_length)
    lats = list(map(float, lats))
    lons = list(map(float, lons))
    durs = list(map(float, durs))


    arr = list([names[i],lats[i],lons[i],durs[i]] for i in range(len(durs)))
    df = pd.DataFrame(data=arr, columns=['location','lat','lon','duration'])

    schedule, warning = geolocation_cluster(df, trip_length)
    return jsonify({'schedule': schedule,
                    'warning': warning})

@app.route('/directions', methods=['GET', 'POST'])
def directions():
    return render_template("directions.html");

# @app.route("/login", methods=["GET", "POST"])
# def login():
#     return render_template();


# @app.route("/<usr>")
# def user(usr):
#     return f"<h1>{usr}</h1>";


if __name__ == "__main__":
    app.run(debug=True)