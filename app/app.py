from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html", score=None, level=None, error=None)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        q1 = int(request.form["q1"])
        q2 = int(request.form["q2"])
        q3 = int(request.form["q3"])
        q4 = int(request.form["q4"])
        q5 = int(request.form["q5"])
        q6 = int(request.form["q6"])

        total = q1 + q2 + q3 + q4 + q5 + q6
        score = round((total / 6) * 3.5, 2)

        if score <= 1.16:
            level = "Low Risk"
        elif score <= 2.33:
            level = "Moderate Risk"
        else:
            level = "High Risk"

        return render_template(
            "index.html",
            score=score,
            level=level,
            error=None,
            q1=q1, q2=q2, q3=q3, q4=q4, q5=q5, q6=q6
        )

    except Exception as e:
        return render_template(
            "index.html",
            score=None,
            level=None,
            error=str(e)
        )


if __name__ == "__main__":
    app.run(debug=True)