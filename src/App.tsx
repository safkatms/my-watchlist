import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { Button } from "antd";
import {
  SearchOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  PlayCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { getRedirectResult } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "./services/auth";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import MovieDetail from "./pages/MovieDetail";
import Import from "./pages/Import";

function Navbar({ user }: { user: any }) {
  const location = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "linear-gradient(to bottom, #000000ee, transparent)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        gap: 32,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
        }}
      >
        <PlayCircleFilled style={{ fontSize: 28, color: "#e50914" }} />
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          WATCHLIST
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 8, flex: 1 }}>
        <Link
          to="/"
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            background: location.pathname === "/" ? "#e50914" : "transparent",
            color: location.pathname === "/" ? "#fff" : "#aaa",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          <UnorderedListOutlined /> My List
        </Link>
        <Link
          to="/search"
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            background:
              location.pathname === "/search" ? "#e50914" : "transparent",
            color: location.pathname === "/search" ? "#fff" : "#aaa",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          <SearchOutlined /> Search
        </Link>
        <Link
          to="/import"
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            background:
              location.pathname === "/import" ? "#e50914" : "transparent",
            color: location.pathname === "/import" ? "#fff" : "#aaa",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          <UploadOutlined /> Import
        </Link>
      </div>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, color: "#888" }}>{user?.email}</span>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={logout}
          style={{ color: "#888", fontSize: 13 }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    getRedirectResult(auth).catch(console.error);
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0a0a0a",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Animated play button */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "3px solid #e50914",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "ring-pulse 1.5s ease-in-out infinite",
              margin: "0 auto 16px",
              position: "relative",
            }}
          >
            {/* Ripple ring */}
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                border: "2px solid #e50914",
                animation: "ripple 1.5s ease-out infinite",
                opacity: 0,
              }}
            />
            {/* Play triangle */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                borderLeft: "22px solid #e50914",
                marginLeft: 5,
                animation: "play-pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>

          <div
            style={{
              color: "#333",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Loading
          </div>
        </div>

        <style>{`
        @keyframes ring-pulse {
          0%, 100% { border-color: #e50914; transform: scale(1); }
          50% { border-color: #ff4444; transform: scale(1.05); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes play-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      </div>
    );

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
        {user && <Navbar user={user} />}
        <div style={{ paddingTop: user ? 72 : 0 }}>
          <Routes>
            <Route
              path="/"
              element={user ? <Watchlist uid={user.uid} /> : <Login />}
            />
            <Route
              path="/search"
              element={user ? <Search /> : <Navigate to="/" />}
            />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route
              path="/import"
              element={user ? <Import /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
