import { Button, Alert } from "antd";
import {
  GoogleOutlined,
  PlayCircleFilled,
  CheckOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { loginWithGoogle } from "../services/auth";

const features = [
  "Track Movies & Series",
  "Rate & Review",
  "Filter & Sort",
  "Stats Dashboard",
];

export default function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff08 1px, transparent 0)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", zIndex: 1, maxWidth: 480, width: "100%" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{ marginBottom: 32 }}
        >
          <PlayCircleFilled style={{ fontSize: 80, color: "#e50914" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: 8,
            background: "linear-gradient(135deg, #fff 0%, #e50914 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          WATCHLIST
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ color: "#666", fontSize: 16, marginBottom: 40 }}
        >
          Your personal movie & series tracker
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 40,
            textAlign: "left",
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#e5091422",
                  border: "1px solid #e5091455",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckOutlined style={{ fontSize: 11, color: "#e50914" }} />
              </div>
              <span style={{ color: "#aaa", fontSize: 14 }}>{f}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Button
            size="large"
            icon={<GoogleOutlined />}
            onClick={loginWithGoogle}
            style={{
              background: "#e50914",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              height: 52,
              paddingInline: 40,
              fontSize: 16,
              fontWeight: 600,
              width: "100%",
              maxWidth: 320,
            }}
          >
            Sign in with Google
          </Button>
          <Alert
            type="warning"
            showIcon
            message="Disable your ad blocker if sign in doesn't work"
            style={{ maxWidth: 360, fontSize: 12 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
