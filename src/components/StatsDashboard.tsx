import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  FieldTimeOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { WatchlistEntry } from "../types";

interface Props {
  watchlist: WatchlistEntry[];
}

function StatCard({ label, value, icon, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: "#141414",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 22, color, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#555",
          marginTop: 6,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

export default function StatsDashboard({ watchlist }: Props) {
  const stats = useMemo(() => {
    const watched = watchlist.filter((m) => m.status === "watched");
    const watching = watchlist.filter((m) => m.status === "watching");
    const planned = watchlist.filter((m) => m.status === "plan_to_watch");

    const totalMins = watched.reduce((acc, m) => {
      const mins = parseInt(m.Runtime ?? "0");
      return acc + (isNaN(mins) ? 0 : mins);
    }, 0);

    const rated = watched.filter((m) => m.myRating);
    const avgRating = rated.length
      ? (
          rated.reduce((a, m) => a + (m.myRating ?? 0), 0) / rated.length
        ).toFixed(1)
      : "N/A";

    const genreCount: Record<string, number> = {};
    watched.forEach((m) =>
      m.genres.forEach((g) => {
        genreCount[g] = (genreCount[g] ?? 0) + 1;
      }),
    );
    const topGenre =
      Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    return {
      total: watchlist.length,
      watched: watched.length,
      watching: watching.length,
      planned: planned.length,
      hours: Math.round(totalMins / 60),
      avgRating,
      topGenre,
    };
  }, [watchlist]);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard
          label="Total"
          value={stats.total}
          icon={<PlayCircleOutlined />}
          color="#e50914"
          delay={0}
        />
        <StatCard
          label="Watched"
          value={stats.watched}
          icon={<CheckCircleOutlined />}
          color="#52c41a"
          delay={0.05}
        />
        <StatCard
          label="Watching"
          value={stats.watching}
          icon={<EyeOutlined />}
          color="#1677ff"
          delay={0.1}
        />
        <StatCard
          label="Planned"
          value={stats.planned}
          icon={<ClockCircleOutlined />}
          color="#faad14"
          delay={0.15}
        />
        <StatCard
          label="Hours"
          value={stats.hours}
          icon={<FieldTimeOutlined />}
          color="#8b5cf6"
          delay={0.2}
        />
        <StatCard
          label="Avg Rating"
          value={stats.avgRating}
          icon={<StarOutlined />}
          color="#f5c518"
          delay={0.25}
        />
        <StatCard
          label="Top Genre"
          value={stats.topGenre}
          icon={<TrophyOutlined />}
          color="#e50914"
          delay={0.3}
        />
      </div>
    </div>
  );
}
