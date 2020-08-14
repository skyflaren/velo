from flask import Flask, redirect, url_for, render_template

app = Flask(__name__);


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template();

@app.route("/<usr>")
def user(usr):
    return f"<h1>{usr}</h1>";

if __name__ == "__main__":
    app.run(debug=True)
