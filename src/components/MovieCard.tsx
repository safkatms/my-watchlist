import { Rate, Button, Tooltip } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { WatchlistEntry, WatchStatus } from "../types";

const statusConfig: Record<
  WatchStatus,
  { color: string; bg: string; icon: any; label: string; next: WatchStatus }
> = {
  watched: {
    color: "#52c41a",
    bg: "#52c41a22",
    icon: <CheckCircleOutlined />,
    label: "Watched",
    next: "plan_to_watch",
  },
  watching: {
    color: "#1677ff",
    bg: "#1677ff22",
    icon: <EyeOutlined />,
    label: "Watching",
    next: "watched",
  },
  plan_to_watch: {
    color: "#faad14",
    bg: "#faad1422",
    icon: <ClockCircleOutlined />,
    label: "Plan to Watch",
    next: "watching",
  },
};

interface Props {
  entry: WatchlistEntry;
  onDelete: (imdbID: string) => void;
  onStatusChange: (entry: WatchlistEntry) => void;
  onRating: (imdbID: string, rating: number) => void;
  index?: number;
}

export default function MovieCard({
  entry,
  onDelete,
  onStatusChange,
  onRating,
  index = 0,
}: Props) {
  const navigate = useNavigate();
  const status = statusConfig[entry.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ position: "relative" }}
    >
      <div
        style={{
          background: "#141414",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #2a2a2a",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        className="movie-card"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 20px 60px rgba(229,9,20,0.25)";
          (e.currentTarget as HTMLElement).style.borderColor = "#e50914";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
          (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
        }}
      >
        {/* Poster */}
        <div
          style={{ position: "relative", overflow: "hidden" }}
          onClick={() => navigate(`/movie/${entry.imdbID}`)}
        >
          <img
            src={
              entry.Poster !== "N/A"
                ? entry.Poster
                : "https://via.placeholder.com/300x450/1a1a1a/555?text=No+Poster"
            }
            alt={entry.Title}
            style={{
              width: "100%",
              height: 280,
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Overlay on hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, #000000cc, transparent)",
            }}
          />
          {/* IMDB rating badge */}
          {entry.imdbRating && entry.imdbRating !== "N/A" && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#f5c518",
                color: "#000",
                fontWeight: 700,
                fontSize: 11,
                padding: "3px 7px",
                borderRadius: 4,
              }}
            >
              ⭐ {entry.imdbRating}
            </div>
          )}
          {/* Type badge */}
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: entry.Type === "movie" ? "#e50914" : "#8b5cf6",
              color: "#fff",
              fontWeight: 600,
              fontSize: 10,
              padding: "3px 7px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {entry.Type}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "12px" }}>
          <div
            onClick={() => navigate(`/movie/${entry.imdbID}`)}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 6,
              lineHeight: 1.3,
              cursor: "pointer",
            }}
          >
            {entry.Title}
          </div>

          <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>
            {entry.Year}
            {entry.totalSeasons && ` • ${entry.totalSeasons} seasons`}
          </div>

          {/* Status badge */}
          <Tooltip
            title={`Click to change to: ${statusConfig[status.next].label}`}
          >
            <div
              onClick={() => onStatusChange(entry)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 20,
                background: status.bg,
                color: status.color,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 8,
                border: `1px solid ${status.color}44`,
              }}
            >
              {status.icon} {status.label}
            </div>
          </Tooltip>

          {/* My rating */}
          <div style={{ marginBottom: 8 }}>
            <Rate
              count={10}
              value={entry.myRating ?? 0}
              onChange={(val) => onRating(entry.imdbID, val)}
              style={{ fontSize: 10, color: "#e50914" }}
            />
          </div>

          {/* Delete */}
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(entry.imdbID)}
            style={{ padding: 0, fontSize: 12, color: "#555" }}
          >
            Remove
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
