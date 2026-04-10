import "./App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  age: number;
  gender: number;
  bmi: number;
  weight_kg: number;
  waist_cm: number;
  education: number;
  alcohol: number;
  t2d: number;
  sleep_apnea_syndrome: number;
  gastroesophageal_reflux_disease: number;
  ede_q_per_operation: number;
};

type PredictionResponse = {
  prediction: number;
  probability: number;
  saved?: boolean;
};

function App() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    age: 0,
    gender: 0,
    bmi: 0,
    weight_kg: 0,
    waist_cm: 0,
    education: 0,
    alcohol: 0,
    t2d: 0,
    sleep_apnea_syndrome: 0,
    gastroesophageal_reflux_disease: 0,
    ede_q_per_operation: 0,
  });

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleChange = (field: keyof FormData, value: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Prediction failed");
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the backend or get a prediction.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      age: 0,
      gender: 0,
      bmi: 0,
      weight_kg: 0,
      waist_cm: 0,
      education: 0,
      alcohol: 0,
      t2d: 0,
      sleep_apnea_syndrome: 0,
      gastroesophageal_reflux_disease: 0,
      ede_q_per_operation: 0,
    });
    setResult(null);
    setError("");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(255,255,255,0.5)",
    backdropFilter: "blur(10px)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #ecfeff 100%)",
        padding: "32px 16px",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 0.9fr",
          gap: "24px",
        }}
      >
        <div style={cardStyle}>
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "#ede9fe",
                color: "#5b21b6",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              🧠 ML Health Prediction
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "46px",
                lineHeight: 1.05,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              Binge Eating Predictor
            </h1>

            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                color: "#475569",
                fontSize: "17px",
                lineHeight: 1.7,
                maxWidth: "800px",
              }}
            >
              Enter the patient information required by your machine learning
              model to estimate whether binge eating is likely or unlikely.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "14px",
              marginBottom: "26px",
            }}
          >
            <StatCard label="Model" value="Random Forest" />
            <StatCard label="Features" value="11 Inputs" />
            <StatCard label="Project Type" value="Supervised ML" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>Age</label>
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 30"
                value={form.age || ""}
                onChange={(e) => handleChange("age", Number(e.target.value))}
              />
            </div>

            <div>
              <label style={labelStyle}>Gender</label>
              <select
                style={inputStyle}
                value={form.gender}
                onChange={(e) => handleChange("gender", Number(e.target.value))}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>BMI</label>
              <input
                style={inputStyle}
                type="number"
                step="0.1"
                placeholder="e.g. 32"
                value={form.bmi || ""}
                onChange={(e) => handleChange("bmi", Number(e.target.value))}
              />
            </div>

            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input
                style={inputStyle}
                type="number"
                step="0.1"
                placeholder="e.g. 90"
                value={form.weight_kg || ""}
                onChange={(e) =>
                  handleChange("weight_kg", Number(e.target.value))
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Waist (cm)</label>
              <input
                style={inputStyle}
                type="number"
                step="0.1"
                placeholder="e.g. 100"
                value={form.waist_cm || ""}
                onChange={(e) =>
                  handleChange("waist_cm", Number(e.target.value))
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Education</label>
              <select
                style={inputStyle}
                value={form.education}
                onChange={(e) =>
                  handleChange("education", Number(e.target.value))
                }
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Alcohol</label>
              <select
                style={inputStyle}
                value={form.alcohol}
                onChange={(e) =>
                  handleChange("alcohol", Number(e.target.value))
                }
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>T2D</label>
              <select
                style={inputStyle}
                value={form.t2d}
                onChange={(e) => handleChange("t2d", Number(e.target.value))}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Sleep Apnea Syndrome</label>
              <select
                style={inputStyle}
                value={form.sleep_apnea_syndrome}
                onChange={(e) =>
                  handleChange("sleep_apnea_syndrome", Number(e.target.value))
                }
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Gastroesophageal Reflux Disease</label>
              <select
                style={inputStyle}
                value={form.gastroesophageal_reflux_disease}
                onChange={(e) =>
                  handleChange(
                    "gastroesophageal_reflux_disease",
                    Number(e.target.value)
                  )
                }
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>EDE-Q Score (Per-operation)</label>
              <input
                style={inputStyle}
                type="number"
                step="0.1"
                placeholder="e.g. 3.5"
                value={form.ede_q_per_operation || ""}
                onChange={(e) =>
                  handleChange("ede_q_per_operation", Number(e.target.value))
                }
              />
            </div>
            </div>

<div
  style={{
    marginTop: "14px",
    padding: "10px 14px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#64748b",
    lineHeight: 1.6,
  }}
>
  To know your EDE-Q Score,{" "}
  <a
    href="https://eqe-q-score.onrender.com/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#2563eb",
      fontWeight: 700,
      textDecoration: "none",
    }}
  >
    click here
  </a>
</div>

<div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "26px",
    flexWrap: "wrap",
  }}
>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "26px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={primaryBtn}
            >
              {loading ? "Predicting..." : "Predict Risk"}
            </button>

            <button onClick={handleReset} type="button" style={secondaryBtn}>
              Reset
            </button>
          </div>

          <div style={{ marginTop: "12px" }}>
            <button
              onClick={() => navigate("/records")}
              type="button"
              style={{ ...secondaryBtn, width: "100%" }}
            >
              View Records
            </button>
          </div>
          <div style={{ marginTop: "12px" }}>
  <button
    onClick={() => navigate("/admin-login")}
    type="button"
    style={{ ...secondaryBtn, width: "100%" }}
  >
    Admin Login
  </button>
</div>

          {error && <ErrorBox message={error} />}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={cardStyle}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "10px",
                fontSize: "28px",
                color: "#0f172a",
              }}
            >
              Prediction Result
            </h2>
            <p
              style={{
                marginTop: 0,
                color: "#64748b",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              The model returns the predicted class and confidence level based
              on the entered patient information.
            </p>

            {!result && !loading && !error && (
              <Placeholder text="Fill the form and click Predict Risk to see the model output." />
            )}

            {loading && <InfoBox text="Predicting patient outcome..." />}

            {result && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "22px",
                  borderRadius: "20px",
                  background:
                    result.prediction === 1
                      ? "linear-gradient(135deg, #fff7ed 0%, #fee2e2 100%)"
                      : "linear-gradient(135deg, #ecfdf5 0%, #dcfce7 100%)",
                  border:
                    result.prediction === 1
                      ? "1px solid #fdba74"
                      : "1px solid #86efac",
                }}
              >
                <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>
                  Predicted Status
                </div>

                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: "14px",
                  }}
                >
                  {result.prediction === 1
                    ? "⚠️ Binge eating likely"
                    : "✅ Binge eating unlikely"}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <MiniCard title="Prediction Code" value={String(result.prediction)} />
                  <MiniCard
                    title="Confidence"
                    value={`${(result.probability * 100).toFixed(2)}%`}
                  />
                </div>

                {result.saved && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.75)",
                      color: "#166534",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Saved to database successfully.
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h3
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#0f172a",
                fontSize: "22px",
              }}
            >
              Clinical Note
            </h3>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.8,
                fontSize: "15px",
              }}
            >
              This web application is built for academic and demonstration
              purposes. It supports the machine learning project and should not
              be used as a replacement for professional medical diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "18px",
        padding: "16px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ color: "#64748b", fontSize: "13px" }}>{label}</div>
      <div
        style={{
          marginTop: "6px",
          color: "#0f172a",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        padding: "14px",
        borderRadius: "14px",
      }}
    >
      <div style={{ fontSize: "13px", color: "#64748b" }}>{title}</div>
      <div
        style={{
          marginTop: "6px",
          fontSize: "22px",
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "22px",
        borderRadius: "18px",
        border: "1px dashed #cbd5e1",
        background: "#f8fafc",
        color: "#64748b",
        textAlign: "center",
        lineHeight: 1.8,
      }}
    >
      {text}
    </div>
  );
}

function InfoBox({ text }: { text: string }) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "22px",
        borderRadius: "18px",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        color: "#1d4ed8",
        fontWeight: 600,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      style={{
        marginTop: "18px",
        padding: "14px 16px",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "14px",
        color: "#b91c1c",
        fontWeight: 500,
      }}
    >
      {message}
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  flex: 1,
  minWidth: "180px",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  fontWeight: 700,
  fontSize: "16px",
  color: "white",
  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(37, 99, 235, 0.28)",
};

const secondaryBtn: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontWeight: 700,
  fontSize: "16px",
  color: "#0f172a",
  background: "white",
  cursor: "pointer",
};

export default App;