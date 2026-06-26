import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Button, message, Rate } from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  PlayCircleFilled,
  StarFilled,
  ClockCircleOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/auth";
import { getMovieDetails } from "../services/omdb";
import { getTrailerKey } from "../services/youtube";
import {
  addToWatchlist,
  updateRating,
  getWatchlist,
} from "../services/watchlist";
import type { OmdbMovie, WatchlistEntry } from "../types";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [movie, setMovie] = useState<OmdbMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [addingToList, setAddingToList] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setShowTrailer(false);
    setTrailerKey(null);

    getMovieDetails(id).then(async (data) => {
      setMovie(data);
      setLoading(false);

      // Fetch trailer in parallel
      const key = await getTrailerKey(data.Title, data.Year);
      setTrailerKey(key);

      // Check if already in watchlist
      if (user) {
        const list = await getWatchlist(user.uid);
        const existing = list.find((m) => m.imdbID === id);
        if (existing) {
          setInWatchlist(true);
          setMyRating(existing.myRating ?? 0);
        }
      }
    });
  }, [id, user]);

  const handleAdd = async () => {
    if (!user || !movie) return;
    setAddingToList(true);
    const entry: WatchlistEntry = {
      ...movie,
      status: "plan_to_watch",
      dateAdded: Date.now(),
      genres: movie.Genre ? movie.Genre.split(", ") : [],
    };
    await addToWatchlist(user.uid, entry);
    setInWatchlist(true);
    setAddingToList(false);
    message.success(`${movie.Title} added to watchlist!`);
  };

  const handleRating = async (val: number) => {
    if (!user || !movie) return;
    setMyRating(val);
    await updateRating(user.uid, movie.imdbID, val);
  };

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
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 40,
                background: "#e50914",
                borderRadius: 3,
                animation: "netflix-bounce 1s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        <style>{`
        @keyframes netflix-bounce {
          0%, 100% { transform: scaleY(0.4); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
      </div>
    );

  if (!movie)
    return <p style={{ color: "#fff", padding: 32 }}>Movie not found.</p>;

  const genres = movie.Genre?.split(", ") ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      {/* ── HERO SECTION ── */}
      <div style={{ position: "relative", minHeight: 600, overflow: "hidden" }}>
        {/* Blurred backdrop */}
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : ""}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(24px) brightness(0.25)",
              transform: "scale(1.1)",
            }}
          />
        </div>

        {/* Gradient overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #0a0a0aee 40%, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #0a0a0a 0%, transparent 60%)",
          }}
        />

        {/* Back button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 24,
            left: 32,
            background: "#ffffff15",
            border: "1px solid #ffffff22",
            color: "#fff",
            borderRadius: 8,
            backdropFilter: "blur(10px)",
            zIndex: 10,
          }}
        >
          Back
        </Button>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            zIndex: 5,
            display: "flex",
            gap: 40,
            alignItems: "flex-start",
            padding: "100px 40px 60px",
            maxWidth: 1100,
          }}
        >
          {/* Poster */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/220x330/1a1a1a/555?text=No+Poster"
            }
            alt={movie.Title}
            style={{
              width: 220,
              borderRadius: 16,
              boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
              flexShrink: 0,
              border: "2px solid #ffffff11",
            }}
          />

          {/* Info */}
          <div style={{ flex: 1 }}>
            {/* Type + Genre tags */}
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Tag
                style={{
                  background: movie.Type === "movie" ? "#e50914" : "#8b5cf6",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {movie.Type}
              </Tag>
              {genres.map((g) => (
                <Tag
                  key={g}
                  style={{
                    background: "#ffffff15",
                    border: "1px solid #ffffff22",
                    color: "#ccc",
                    fontSize: 11,
                  }}
                >
                  {g}
                </Tag>
              ))}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 12,
                lineHeight: 1.05,
                letterSpacing: "-1px",
              }}
            >
              {movie.Title}
            </h1>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              {movie.Year && (
                <span
                  style={{
                    color: "#888",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <CalendarOutlined /> {movie.Year}
                </span>
              )}
              {movie.Runtime && movie.Runtime !== "N/A" && (
                <span
                  style={{
                    color: "#888",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <ClockCircleOutlined /> {movie.Runtime}
                </span>
              )}
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <span
                  style={{
                    color: "#f5c518",
                    fontSize: 14,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <StarFilled /> {movie.imdbRating} / 10
                </span>
              )}
              {movie.totalSeasons && (
                <span style={{ color: "#888", fontSize: 14 }}>
                  {movie.totalSeasons} Seasons
                </span>
              )}
              {(movie as any).Rated && (movie as any).Rated !== "N/A" && (
                <span
                  style={{
                    padding: "2px 8px",
                    border: "1px solid #555",
                    color: "#888",
                    fontSize: 12,
                    borderRadius: 4,
                  }}
                >
                  {(movie as any).Rated}
                </span>
              )}
            </div>

            {/* Plot */}
            {movie.Plot && movie.Plot !== "N/A" && (
              <p
                style={{
                  color: "#bbb",
                  lineHeight: 1.8,
                  fontSize: 15,
                  marginBottom: 28,
                  maxWidth: 640,
                }}
              >
                {movie.Plot}
              </p>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 28,
              }}
            >
              {trailerKey && (
                <Button
                  size="large"
                  icon={<PlayCircleFilled />}
                  onClick={() => setShowTrailer(true)}
                  style={{
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    height: 48,
                    paddingInline: 28,
                  }}
                >
                  Watch Trailer
                </Button>
              )}

              <Button
                size="large"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                loading={addingToList}
                disabled={inWatchlist}
                style={{
                  background: inWatchlist ? "#1a1a1a" : "#e50914",
                  border: inWatchlist ? "1px solid #333" : "none",
                  color: inWatchlist ? "#555" : "#fff",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                  height: 48,
                  paddingInline: 28,
                }}
              >
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </Button>
            </div>

            {/* My rating */}
            {inWatchlist && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <span style={{ color: "#555", fontSize: 13 }}>My Rating:</span>
                <Rate
                  count={10}
                  value={myRating}
                  onChange={handleRating}
                  style={{ fontSize: 16, color: "#e50914" }}
                />
                {myRating > 0 && (
                  <span style={{ color: "#e50914", fontWeight: 700 }}>
                    {myRating}/10
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── DETAILS SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ padding: "0 40px 60px", maxWidth: 1100 }}
      >
        {/* Info grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            {
              label: "Director",
              value: movie.Director,
              icon: <GlobalOutlined />,
            },
            { label: "Actors", value: movie.Actors, icon: <GlobalOutlined /> },
            { label: "Awards", value: movie.Awards, icon: <TrophyOutlined /> },
            {
              label: "Country",
              value: (movie as any).Country,
              icon: <GlobalOutlined />,
            },
            {
              label: "Language",
              value: (movie as any).Language,
              icon: <GlobalOutlined />,
            },
            {
              label: "Box Office",
              value: (movie as any).BoxOffice,
              icon: <StarFilled />,
            },
            {
              label: "Production",
              value: (movie as any).Production,
              icon: <GlobalOutlined />,
            },
            {
              label: "Writer",
              value: (movie as any).Writer,
              icon: <GlobalOutlined />,
            },
          ]
            .filter((i) => i.value && i.value !== "N/A")
            .map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#141414",
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  padding: "16px 20px",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#e50914")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#2a2a2a")
                }
              >
                <div
                  style={{
                    color: "#e50914",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 8,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {item.icon} {item.label}
                </div>
                <div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.5 }}>
                  {item.value}
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* ── TRAILER MODAL ── */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "#000000ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 960,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 40px 120px rgba(229,9,20,0.4)",
                border: "1px solid #e5091422",
                position: "relative",
              }}
            >
              {/* Close button */}
              <Button
                onClick={() => setShowTrailer(false)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 10,
                  background: "#000000cc",
                  border: "none",
                  color: "#fff",
                  borderRadius: 6,
                  backdropFilter: "blur(10px)",
                }}
              >
                Close
              </Button>

              {/* YouTube embed */}
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  title={`${movie.Title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
