import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type RecordItem = {
  id: number;
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
  prediction: number;
  probability: number;
  created_at: string | null;
};

function RecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const fetchRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/records`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: RecordItem[] = await response.json();
      setRecords(data);
    } catch (err) {
      console.error("Records fetch error:", err);
      setError("Could not load saved records from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
            border: "1px solid rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ marginBottom: "24px", textAlign: "center" }}>
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
                fontSize: "40px",
                lineHeight: 1.05,
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              Saved Records
            </h1>

            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                color: "#475569",
                fontSize: "17px",
                lineHeight: 1.7,
              }}
            >
              This page displays all predictions saved in the same database.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/")} style={primaryBtn}>
              Back to Predictor
            </button>

            <button onClick={fetchRecords} style={secondaryBtn}>
              Refresh
            </button>

            <a
              href="http://127.0.0.1:8000/download-records"
              style={{
                ...secondaryBtn,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Download CSV
            </a>
          </div>

          {loading && <Box text="Loading records..." />}

          {!loading && error && <ErrorBox message={error} />}

          {!loading && !error && (
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                overflow: "hidden",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  borderBottom: "1px solid #e2e8f0",
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#0f172a",
                }}
              >
                Saved Records ({records.length})
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "1100px",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {[
                        "ID","Age","Gender","BMI","Weight","Waist","Education",
                        "Alcohol","T2D","Sleep Apnea","GERD","EDE-Q",
                        "Prediction","Probability","Created At",
                      ].map((header) => (
                        <th
                          key={header}
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            fontSize: "13px",
                            color: "#475569",
                            textAlign: "center",
                            fontWeight: 700,
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.length > 0 ? (
                      records.map((row) => (
                        <tr key={row.id}>
                          <td style={cellStyle}>{row.id}</td>
                          <td style={cellStyle}>{row.age}</td>
                          <td style={cellStyle}>{row.gender}</td>
                          <td style={cellStyle}>{row.bmi}</td>
                          <td style={cellStyle}>{row.weight_kg}</td>
                          <td style={cellStyle}>{row.waist_cm}</td>
                          <td style={cellStyle}>{row.education}</td>
                          <td style={cellStyle}>{row.alcohol}</td>
                          <td style={cellStyle}>{row.t2d}</td>
                          <td style={cellStyle}>{row.sleep_apnea_syndrome}</td>
                          <td style={cellStyle}>{row.gastroesophageal_reflux_disease}</td>
                          <td style={cellStyle}>{row.ede_q_per_operation}</td>
                          <td style={cellStyle}>{row.prediction === 1 ? "Likely" : "Unlikely"}</td>
                          <td style={cellStyle}>{(row.probability * 100).toFixed(2)}%</td>
                          <td style={cellStyle}>
                            {row.created_at ? new Date(row.created_at).toLocaleString() : ""}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={15}
                          style={{
                            padding: "18px",
                            textAlign: "center",
                            color: "#64748b",
                          }}
                        >
                          No saved records yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Box({ text }: { text: string }) {
  return (
    <div
      style={{
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

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      style={{
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

const cellStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "center",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "13px",
  color: "#0f172a",
};

export default RecordsPage;