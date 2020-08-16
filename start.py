import numpy as np, pandas as pd

from flask import Flask, redirect, url_for, render_template, request, jsonify
from geolocation_clustering import geolocation_cluster

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def home():
    global trip_length, names, lats, lons, durs, schedule, warnings
    trip_length = ""
    names = []
    lats = []
    lons = []
    durs = []
    schedule = []
    warnings = []
    travel_mode = 0
    return render_template("index.html")

@app.route('/process', methods=['GET', 'POST'])
def process():
    trip_length = request.form['time']
    rating = request.form['rating']
    icons = eval(request.form['icons'])
    names = eval(request.form['names'])
    lats = eval(request.form['latitudes']) #stringed array back to list
    lons = eval(request.form['longitudes'])
    durs = eval(request.form['durations'])

    print(trip_length)
    print(rating)
    print(icons)
    print(names)
    print(lats)
    print(lons)
    print(durs)

    if not(trip_length and sum(icons) >= 1 and names):
        return jsonify({'warning': 'Missing Fields!'})

    trip_length = int(trip_length)
    rating = int(rating)
    lats = list(map(float, lats))
    lons = list(map(float, lons))
    durs = list(map(float, durs))

    travel_mode = 0
    if icons[2]:
        travel_mode = 2
    elif icons[1]:
        travel_mode = 1
    elif icons[0]:
        travel_mode = 0

    arr = list([names[i],lats[i],lons[i],durs[i]] for i in range(len(durs)))
    df = pd.DataFrame(data=arr, columns=['location','lat','lon','duration'])

    response, warnings, generate_map = geolocation_cluster(df, d=trip_length, r=rating, t=travel_mode)
    if not generate_map:
        return jsonify({'warning': 'Too many locations were provided for the given time frame!\n'
                                   'Please reduce the number of locations or increase your time\n '
                                   'frame and try again!'})
    for cluster in response:
        for day in cluster:
            schedule.append(day)
    total_days = len(schedule)

    return jsonify({'redirect':url_for('directions', day=1, total=total_days)})

# @app.route('/directions', methods=['GET', 'POST'])
# def directions_test():
#     return render_template("directions_test.html")

@app.route('/directions/<total>/<day>', methods=['GET', 'POST'])
def directions(day, total):
    print(schedule)
    # if request.method == 'GET':
        # return jsonify({'schedule':schedule[int(day)-1]})
    warnings.append("Everything worked!");
    data = {'schedule': schedule[int(day)-1], 'day': day, 'total':total, 'travel':travel_mode, 'warnings': warnings}
    return render_template("directions.html", data=data)

# @app.route("/login", methods=["GET", "POST"])
# def login():
#     return render_template();


# @app.route("/<usr>")
# def user(usr):
#     return f"<h1>{usr}</h1>";

if __name__ == "__main__":
    trip_length = ""
    names = []
    lats = []
    lons = []
    durs = []
    schedule = []
    warnings = []
    travel_mode = 0
    app.run(debug=True)