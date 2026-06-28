import { useState } from "react";
import { Button, message, Progress } from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/auth";
import { getMovieDetails } from "../services/omdb";
import { addToWatchlist } from "../services/watchlist";

interface ImportResult {
  title: string;
  status: "success" | "failed";
  reason?: string;
}

export default function Import() {
  const [user] = useAuthState(auth);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState("");
  const [results, setResults] = useState<ImportResult[]>([]);
  const [done, setDone] = useState(false);

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());

    return lines
      .slice(1)
      .map((line) => {
        // Handle commas inside quoted fields
        const cols: string[] = [];
        let current = "";
        let inQuotes = false;
        for (const char of line) {
          if (char === '"') inQuotes = !inQuotes;
          else if (char === "," && !inQuotes) {
            cols.push(current.trim());
            current = "";
          } else current += char;
        }
        cols.push(current.trim());

        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = cols[i] ?? "";
        });
        return row;
      })
      .filter((r) => r["Const"]?.startsWith("tt"));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      message.error("No valid IMDB entries found in this file");
      return;
    }

    setImporting(true);
    setDone(false);
    setResults([]);
    setTotal(rows.length);
    setProgress(0);

    const resultList: ImportResult[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const imdbId = row["Const"];
      const title = row["Title"] ?? row["Your Rating"] ?? imdbId;

      setCurrent(title);

      try {
        const details = await getMovieDetails(imdbId);

        if (details.Response === "False") {
          resultList.push({
            title,
            status: "failed",
            reason: "Not found on OMDB",
          });
        } else {
          await addToWatchlist(user.uid, {
            ...details,
            status: "watched",
            dateAdded: Date.now() - (rows.length - i) * 1000,
            genres: details.Genre ? details.Genre.split(", ") : [],
          });
          resultList.push({ title: details.Title, status: "success" });
        }
      } catch (err) {
        resultList.push({
          title,
          status: "failed",
          reason: "Error fetching details",
        });
      }

      setProgress(i + 1);
      setResults([...resultList]);

      // Delay to avoid hitting OMDB rate limit
      await new Promise((r) => setTimeout(r, 300));
    }

    setImporting(false);
    setDone(true);
    setCurrent("");
  };

  const successful = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return (
    <div style={{ padding: "24px 32px", minHeight: "100vh", maxWidth: 700 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
          Import from <span style={{ color: "#e50914" }}>IMDB</span>
        </h1>
        <p style={{ color: "#666", marginBottom: 32 }}>
          Import your existing IMDB watchlist directly into your app
        </p>
      </motion.div>

      {/* Instructions */}
      <div
        style={{
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          How to export from IMDB
        </h3>
        {[
          "Go to imdb.com → Your account → Watchlist",
          "Scroll to the very bottom of the page",
          'Click "Export this list" button',
          "Upload the downloaded CSV file below",
        ].map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#e5091422",
                border: "1px solid #e5091455",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#e50914",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <span style={{ color: "#aaa", fontSize: 13, paddingTop: 2 }}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Upload */}
      {!importing && !done && (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            background: "#141414",
            border: "2px dashed #2a2a2a",
            borderRadius: 12,
            cursor: "pointer",
            transition: "border-color 0.2s",
            marginBottom: 24,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e50914")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
        >
          <UploadOutlined
            style={{ fontSize: 40, color: "#333", marginBottom: 12 }}
          />
          <span style={{ color: "#666", fontSize: 14, marginBottom: 4 }}>
            Click to upload your IMDB CSV file
          </span>
          <span style={{ color: "#444", fontSize: 12 }}>
            Only .csv files exported from IMDB
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </label>
      )}

      {/* Progress */}
      {importing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: "24px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ color: "#fff", fontWeight: 600 }}>Importing...</span>
            <span style={{ color: "#888", fontSize: 13 }}>
              {progress} / {total}
            </span>
          </div>
          <Progress
            percent={Math.round((progress / total) * 100)}
            strokeColor="#e50914"
            trailColor="#2a2a2a"
            showInfo={false}
          />
          {current && (
            <div style={{ color: "#555", fontSize: 12, marginTop: 10 }}>
              Fetching: <span style={{ color: "#888" }}>{current}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {done && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#52c41a22",
                  border: "1px solid #52c41a44",
                  borderRadius: 10,
                  padding: "14px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 28, fontWeight: 800, color: "#52c41a" }}
                >
                  {successful}
                </div>
                <div style={{ fontSize: 12, color: "#52c41a", marginTop: 4 }}>
                  Imported
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#e5091422",
                  border: "1px solid #e5091444",
                  borderRadius: 10,
                  padding: "14px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 28, fontWeight: 800, color: "#e50914" }}
                >
                  {failed}
                </div>
                <div style={{ fontSize: 12, color: "#e50914", marginTop: 4 }}>
                  Failed
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              background: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: 12,
              overflow: "hidden",
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderBottom: "1px solid #1a1a1a",
                  fontSize: 13,
                }}
              >
                {r.status === "success" ? (
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", flexShrink: 0 }}
                  />
                ) : (
                  <WarningOutlined
                    style={{ color: "#e50914", flexShrink: 0 }}
                  />
                )}
                <span
                  style={{
                    color: r.status === "success" ? "#ccc" : "#666",
                    flex: 1,
                  }}
                >
                  {r.title}
                </span>
                {r.reason && (
                  <span style={{ color: "#444", fontSize: 11 }}>
                    {r.reason}
                  </span>
                )}
              </div>
            ))}
          </div>

          {done && (
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Button
                onClick={() => (window.location.href = "/")}
                style={{
                  background: "#e50914",
                  border: "none",
                  color: "#fff",
                  borderRadius: 8,
                  fontWeight: 600,
                  height: 44,
                  flex: 1,
                }}
              >
                View My Watchlist
              </Button>
              <Button
                onClick={() => {
                  setDone(false);
                  setResults([]);
                  setProgress(0);
                  setTotal(0);
                }}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#888",
                  borderRadius: 8,
                  height: 44,
                }}
              >
                Import Another
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
