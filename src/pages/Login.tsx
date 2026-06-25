import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { loginWithGoogle } from "../services/auth";

export default function Login() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        gap: 16,
      }}
    >
      <h1>🎬 My Watchlist</h1>
      <p style={{ color: "#888" }}>Track every movie and series you watch</p>
      <Button
        type="primary"
        icon={<GoogleOutlined />}
        size="large"
        onClick={loginWithGoogle}
      >
        Sign in with Google
      </Button>
    </div>
  );
}
