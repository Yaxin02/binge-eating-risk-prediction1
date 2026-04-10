import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type RecordItem = {
  id: number;
  age: number;
  bmi: number;
  prediction: number;
  probability: number;
  created_at: string | null;
};

function DashboardPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE}/records`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (isAuth !== "true") {
      navigate("/admin-login");
      return;
    }

    fetchRecords();
  }, []);

  const latestRecord = records.length > 0 ? records[0] : null;

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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
            🛡️ Admin Panel
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: 900,
              textAlign: "center",
              color: "#0f172a",
            }}
          >
            Binge Dashboard
          </h1><br></br>

          <p
            style={{
              textAlign: "center",
              color: "#475569",
              fontSize: "16px",
              lineHeight: 1.8,
              marginBottom: "24px",
            }}
          >
            Simple admin dashboard for saved binge eating predictions.
          </p>

          {loading ? (
            <div style={boxStyle}>Loading dashboard...</div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "18px",
                }}
              >
                <div style={cardStyle}>
                  <div style={labelStyle}>Total Records</div>
                  <div style={valueStyle}>{records.length}</div>
                </div>

                <div style={cardStyle}>
                  <div style={labelStyle}>Latest Prediction</div>
                  <div style={valueStyle}>
                    {latestRecord
                      ? latestRecord.prediction === 1
                        ? "Likely"
                        : "Unlikely"
                      : "No data"}
                  </div>
                </div>
              </div>

              <div style={boxStyle}>
                {latestRecord ? (
                  <>
                    <strong>Latest Record:</strong>
                    <br />
                    Age: {latestRecord.age}
                    <br />
                    BMI: {latestRecord.bmi}
                    <br />
                    Prediction: {latestRecord.prediction === 1 ? "Likely" : "Unlikely"}
                    <br />
                    Probability: {(latestRecord.probability * 100).toFixed(2)}%
                    <br />
                    Date:{" "}
                    {latestRecord.created_at
                      ? new Date(latestRecord.created_at).toLocaleString()
                      : ""}
                  </>
                ) : (
                  "No records saved yet."
                )}
              </div>
            </>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            <button onClick={() => navigate("/")} style={primaryBtn}>
              Back to Predictor
            </button>

            <button onClick={() => navigate("/records")} style={secondaryBtn}>
              View Records
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

            <button
              onClick={() => {
                localStorage.removeItem("admin_auth");
                navigate("/admin-login");
              }}
              style={secondaryBtn}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#f8fafc",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #e2e8f0",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "8px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 900,
  color: "#0f172a",
};

const boxStyle: React.CSSProperties = {
  marginTop: "18px",
  padding: "18px",
  borderRadius: "18px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  lineHeight: 1.9,
  color: "#0f172a",
};

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

export default DashboardPage;