import { useState } from "react";
import { Row, Col, Spin, message, Button, Tag } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/auth";
import { searchMovies, getMovieDetails } from "../services/omdb";
import { addToWatchlist } from "../services/watchlist";
import SearchBar from "../components/SearchBar";
import type { OmdbMovie, WatchlistEntry } from "../types";

export default function Search() {
  const [user] = useAuthState(auth);
  const [results, setResults] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const movies = await searchMovies(query);
    setResults(movies);
    setLoading(false);
  };

  const handleAdd = async (movie: OmdbMovie) => {
    if (!user) return;
    setAdding(movie.imdbID);
    const details = await getMovieDetails(movie.imdbID);
    const entry: WatchlistEntry = {
      ...details,
      status: "plan_to_watch",
      dateAdded: Date.now(),
      genres: details.Genre ? details.Genre.split(", ") : [],
    };
    await addToWatchlist(user.uid, entry);
    message.success({
      content: `${movie.Title} added to watchlist!`,
      style: { marginTop: "20vh" },
    });
    setAdding(null);
  };

  return (
    <div style={{ padding: "24px 32px", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
          Search <span style={{ color: "#e50914" }}>Movies & Series</span>
        </h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Find anything and add it to your list
        </p>
      </motion.div>

      <div style={{ maxWidth: 600, marginBottom: 40 }}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#555" }}>
          No results found. Try a different title.
        </div>
      )}

      {!loading && !searched && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
          <p style={{ color: "#555", fontSize: 16 }}>
            Search for any movie or series above
          </p>
        </div>
      )}

      <Row gutter={[16, 16]}>
        {results.map((movie, i) => (
          <Col key={movie.imdbID} xs={12} sm={8} md={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                style={{
                  background: "#141414",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #2a2a2a",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-8px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 20px 60px rgba(229,9,20,0.25)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#e50914";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#2a2a2a";
                }}
              >
                {/* Poster */}
                <div
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => navigate(`/movie/${movie.imdbID}`)}
                >
                  <img
                    src={
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster"
                    }
                    alt={movie.Title}
                    style={{
                      width: "100%",
                      height: 280,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, #000000cc, transparent)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      background:
                        movie.Type === "movie" ? "#e50914" : "#8b5cf6",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 10,
                      padding: "3px 7px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    {movie.Type}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: 12 }}>
                  <div
                    onClick={() => navigate(`/movie/${movie.imdbID}`)}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                      marginBottom: 4,
                      cursor: "pointer",
                    }}
                  >
                    {movie.Title}
                  </div>
                  <Tag
                    style={{
                      background: "#2a2a2a",
                      border: "none",
                      color: "#888",
                      marginBottom: 10,
                    }}
                  >
                    {movie.Year}
                  </Tag>

                  <div style={{ display: "flex", gap: 6 }}>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      loading={adding === movie.imdbID}
                      onClick={() => handleAdd(movie)}
                      style={{
                        flex: 1,
                        background: "#e50914",
                        border: "none",
                        color: "#fff",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/movie/${movie.imdbID}`)}
                      style={{
                        background: "#2a2a2a",
                        border: "none",
                        color: "#aaa",
                        borderRadius: 6,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
