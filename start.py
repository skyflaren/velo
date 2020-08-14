from flask import Flask, redirect, url_for, render_template

app = Flask(__name__);


@app.route("/", methods = ['GET', 'POST'])
def home():
    return render_template("index.html")


@app.route('/updatelist', methods = ['POST'])
def getJS():
	if request.method == 'POST':
		data = request.form['data']
		print(data);
	jsdata = request.form['javascript_data']
	return json.loads(jsdata)


# @app.route("/login", methods=["GET", "POST"])
# def login():
#     return render_template();


# @app.route("/<usr>")
# def user(usr):
#     return f"<h1>{usr}</h1>";


if __name__ == "__main__":
    app.run(debug=True)
