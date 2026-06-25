import { useEffect, useState, useMemo } from "react";
import { Row, Col, Empty, Spin } from "antd";
import {
  getWatchlist,
  removeFromWatchlist,
  updateStatus,
  updateRating,
} from "../services/watchlist";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import type { WatchlistEntry, WatchStatus } from "../types";
import StatsDashboard from "../components/StatsDashboard";

interface Props {
  uid: string;
}

export default function Watchlist({ uid }: Props) {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dateAdded");

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
  }, [watchlist, statusFilter, typeFilter, genreFilter, sortBy]);

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
      <Spin size="large" style={{ display: "block", margin: "80px auto" }} />
    );

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: 16 }}>My Watchlist ({filtered.length})</h2>
      <StatsDashboard watchlist={watchlist} />
      <FilterBar
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        genreFilter={genreFilter}
        sortBy={sortBy}
        allGenres={allGenres}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        onGenreChange={setGenreFilter}
        onSortChange={setSortBy}
      />

      {filtered.length === 0 ? (
        <Empty
          description="Nothing matches your filters"
          style={{ marginTop: 60 }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((entry) => (
            <Col key={entry.imdbID} xs={12} sm={8} md={6} lg={4}>
              <MovieCard
                entry={entry}
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
