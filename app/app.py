import os
import csv
import io

from flask import (
    Flask,
    render_template,
    request,
    Response,
    redirect,
    url_for,
    session,
)
from dotenv import load_dotenv

from database import db
from models import EDEQSubmission

load_dotenv()

app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY", "yassin_demo_secret_key")

basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "predictions.db")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return render_template(
        "index.html",
        score=None,
        level=None,
        error=None
    )


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

        new_record = EDEQSubmission(
            q1=q1,
            q2=q2,
            q3=q3,
            q4=q4,
            q5=q5,
            q6=q6,
            score=score,
            level=level
        )

        db.session.add(new_record)
        db.session.commit()

        return render_template(
            "index.html",
            score=score,
            level=level,
            error=None,
            q1=q1,
            q2=q2,
            q3=q3,
            q4=q4,
            q5=q5,
            q6=q6
        )

    except Exception as e:
        return render_template(
            "index.html",
            score=None,
            level=None,
            error=str(e)
        )


@app.route("/records")
def records():
    rows = EDEQSubmission.query.order_by(EDEQSubmission.created_at.desc()).all()
    return render_template("records.html", rows=rows)


@app.route("/download-records")
def download_records():
    rows = EDEQSubmission.query.order_by(EDEQSubmission.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Score",
        "Level",
        "Created At",
    ])

    for row in rows:
        writer.writerow([
            row.id,
            row.q1,
            row.q2,
            row.q3,
            row.q4,
            row.q5,
            row.q6,
            row.score,
            row.level,
            row.created_at,
        ])

    csv_data = output.getvalue()
    output.close()

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=edeq_records.csv"
        },
    )


@app.route("/admin-login", methods=["GET", "POST"])
def admin_login():
    error = None

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        admin_username = os.getenv("ADMIN_USERNAME", "yassin")
        admin_password = os.getenv("ADMIN_PASSWORD", "123")

        if username == admin_username and password == admin_password:
            session["admin_logged_in"] = True
            return redirect(url_for("dashboard"))
        else:
            error = "Invalid username or password"

    return render_template("admin_login.html", error=error)


@app.route("/admin-logout")
def admin_logout():
    session.pop("admin_logged_in", None)
    return redirect(url_for("admin_login"))


@app.route("/dashboard")
def dashboard():
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin_login"))

    rows = EDEQSubmission.query.order_by(EDEQSubmission.created_at.desc()).all()
    total_records = len(rows)
    latest_record = rows[0] if rows else None

    return render_template(
        "dashboard.html",
        total_records=total_records,
        latest_record=latest_record,
        rows=rows,
    )


if __name__ == "__main__":
    app.run(debug=True)