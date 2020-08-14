from flask import Flask, redirect, url_for, render_template, request

app = Flask(__name__)


@app.route("/", methods = ['GET', 'POST'])
def home():
	if request.method == 'POST':
		data = request.form.get('data', False)
		print(data)
	return render_template("index.html")


@app.route('/updatelist', methods = ['POST'])
def getJS():
	return render_template("index.html")


# @app.route("/login", methods=["GET", "POST"])
# def login():
#     return render_template();


# @app.route("/<usr>")
# def user(usr):
#     return f"<h1>{usr}</h1>";


if __name__ == "__main__":
    app.run(debug=True)
