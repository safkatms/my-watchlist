import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Tag, Button, Spin, message } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/auth";
import { getMovieDetails } from "../services/omdb";
import { addToWatchlist } from "../services/watchlist";
import type { OmdbMovie, WatchlistEntry } from "../types";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [movie, setMovie] = useState<OmdbMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getMovieDetails(id).then((data) => {
        setMovie(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAdd = async () => {
    if (!user || !movie) return;
    const entry: WatchlistEntry = {
      ...movie,
      status: "plan_to_watch",
      dateAdded: Date.now(),
      genres: movie.Genre ? movie.Genre.split(", ") : [],
    };
    await addToWatchlist(user.uid, entry);
    message.success(`${movie.Title} added to watchlist!`);
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "80px auto" }} />
    );
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24 }}
      >
        Back
      </Button>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450?text=No+Poster"
          }
          alt={movie.Title}
          style={{ width: 250, borderRadius: 8, objectFit: "cover" }}
        />
        <div style={{ flex: 1 }}>
          <h1>
            {movie.Title} ({movie.Year})
          </h1>
          <div style={{ marginBottom: 12 }}>
            <Tag color={movie.Type === "movie" ? "blue" : "purple"}>
              {movie.Type}
            </Tag>
            {movie.Genre?.split(", ").map((g) => (
              <Tag key={g}>{g}</Tag>
            ))}
          </div>
          <p>{movie.Plot}</p>
          <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="IMDB Rating">
              ⭐ {movie.imdbRating}
            </Descriptions.Item>
            <Descriptions.Item label="Runtime">
              {movie.Runtime}
            </Descriptions.Item>
            <Descriptions.Item label="Director">
              {movie.Director}
            </Descriptions.Item>
            <Descriptions.Item label="Actors">{movie.Actors}</Descriptions.Item>
            {movie.totalSeasons && (
              <Descriptions.Item label="Seasons">
                {movie.totalSeasons}
              </Descriptions.Item>
            )}
            {movie.Awards && (
              <Descriptions.Item label="Awards">
                {movie.Awards}
              </Descriptions.Item>
            )}
          </Descriptions>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add to Watchlist
          </Button>
        </div>
      </div>
    </div>
  );
}
