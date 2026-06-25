import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Layout, Menu, Button, Spin } from "antd";
import {
  SearchOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { getRedirectResult } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "./services/auth";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";
import MovieDetail from "./pages/MovieDetail";

const { Header, Content } = Layout;

export default function App() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    getRedirectResult(auth).catch(console.error);
  }, []);

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "80px auto" }} />
    );

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        {user && (
          <Header style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{ color: "white", fontWeight: "bold", marginRight: 16 }}
            >
              🎬 Watchlist
            </span>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ flex: 1 }}
              items={[
                {
                  key: "watchlist",
                  icon: <UnorderedListOutlined />,
                  label: <Link to="/">My List</Link>,
                },
                {
                  key: "search",
                  icon: <SearchOutlined />,
                  label: <Link to="/search">Search</Link>,
                },
              ]}
            />
            <Button
              type="text"
              icon={<LogoutOutlined />}
              style={{ color: "white" }}
              onClick={logout}
            >
              Logout
            </Button>
          </Header>
        )}
        <Content>
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
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}
