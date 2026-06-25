import { useState } from "react";
import { Row, Col, Card, Button, Tag, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
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
    message.success(`${movie.Title} added to watchlist!`);
    setAdding(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      <SearchBar onSearch={handleSearch} />

      {loading && (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      )}

      <Row gutter={[16, 16]}>
        {results.map((movie) => (
          <Col key={movie.imdbID} xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              cover={
                <img
                  alt={movie.Title}
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x450?text=No+Poster"
                  }
                  style={{ height: 280, objectFit: "cover" }}
                  onClick={() => navigate(`/movie/${movie.imdbID}`)}
                />
              }
              actions={[
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  loading={adding === movie.imdbID}
                  onClick={() => handleAdd(movie)}
                  size="small"
                >
                  Add
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <span
                    style={{ fontSize: 13, cursor: "pointer" }}
                    onClick={() => navigate(`/movie/${movie.imdbID}`)}
                  >
                    {movie.Title}
                  </span>
                }
                description={
                  <div>
                    <Tag>{movie.Year}</Tag>
                    <Tag color={movie.Type === "movie" ? "blue" : "purple"}>
                      {movie.Type}
                    </Tag>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
