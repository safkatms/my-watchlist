import { useEffect, useState, useMemo } from "react";
import { Row, Col, Empty } from "antd";
import { motion } from "framer-motion";
import {
  getWatchlist,
  removeFromWatchlist,
  updateStatus,
  updateRating,
} from "../services/watchlist";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import StatsDashboard from "../components/StatsDashboard";
import type { WatchlistEntry, WatchStatus } from "../types";

interface Props {
  uid: string;
}

export default function Watchlist({ uid }: Props) {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getWatchlist(uid).then((data) => {
      setWatchlist(data.sort((a, b) => b.dateAdded - a.dateAdded));
      setLoading(false);
    });
  }, [uid]);

  const allGenres = useMemo(() => {
    const genres = watchlist.flatMap((m) => m.genres);
    return [...new Set(genres)].sort();
  }, [watchlist]);

  const filtered = useMemo(() => {
    let list = [...watchlist];
    if (search)
      list = list.filter((m) =>
        m.Title.toLowerCase().includes(search.toLowerCase()),
      );
    if (statusFilter !== "all")
      list = list.filter((m) => m.status === statusFilter);
    if (typeFilter !== "all") list = list.filter((m) => m.Type === typeFilter);
    if (genreFilter !== "all")
      list = list.filter((m) => m.genres.includes(genreFilter));
    list.sort((a, b) => {
      if (sortBy === "dateAdded") return b.dateAdded - a.dateAdded;
      if (sortBy === "imdbRating")
        return +(b.imdbRating ?? 0) - +(a.imdbRating ?? 0);
      if (sortBy === "myRating") return (b.myRating ?? 0) - (a.myRating ?? 0);
      if (sortBy === "title") return a.Title.localeCompare(b.Title);
      return 0;
    });
    return list;
  }, [watchlist, statusFilter, typeFilter, genreFilter, sortBy, search]);

  const handleDelete = async (imdbID: string) => {
    await removeFromWatchlist(uid, imdbID);
    setWatchlist((prev) => prev.filter((m) => m.imdbID !== imdbID));
  };

  const handleStatusChange = async (entry: WatchlistEntry) => {
    const nextStatus: Record<WatchStatus, WatchStatus> = {
      plan_to_watch: "watching",
      watching: "watched",
      watched: "plan_to_watch",
    };
    const next = nextStatus[entry.status];
    await updateStatus(uid, entry.imdbID, next);
    setWatchlist((prev) =>
      prev.map((m) => (m.imdbID === entry.imdbID ? { ...m, status: next } : m)),
    );
  };

  const handleRating = async (imdbID: string, myRating: number) => {
    await updateRating(uid, imdbID, myRating);
    setWatchlist((prev) =>
      prev.map((m) => (m.imdbID === imdbID ? { ...m, myRating } : m)),
    );
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

  return (
    <div style={{ padding: "24px 32px", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
          My <span style={{ color: "#e50914" }}>Watchlist</span>
        </h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          {watchlist.length} titles tracked
        </p>
      </motion.div>

      <StatsDashboard watchlist={watchlist} />

      <FilterBar
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        genreFilter={genreFilter}
        sortBy={sortBy}
        allGenres={allGenres}
        search={search}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        onGenreChange={setGenreFilter}
        onSortChange={setSortBy}
        onSearchChange={setSearch}
      />

      <div style={{ marginBottom: 16, color: "#555", fontSize: 13 }}>
        Showing {filtered.length} of {watchlist.length} titles
      </div>

      {filtered.length === 0 ? (
        <Empty
          description={
            <span style={{ color: "#555" }}>Nothing matches your filters</span>
          }
          style={{ marginTop: 80 }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((entry, i) => (
            <Col key={entry.imdbID} xs={12} sm={8} md={6} lg={4}>
              <MovieCard
                entry={entry}
                index={i}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onRating={handleRating}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
