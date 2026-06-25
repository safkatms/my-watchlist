import { Card, Tag, Rate, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { WatchlistEntry, WatchStatus } from "../types";

const statusColor: Record<WatchStatus, string> = {
  watched: "green",
  watching: "blue",
  plan_to_watch: "orange",
};

const statusLabel: Record<WatchStatus, string> = {
  watched: "Watched",
  watching: "Watching",
  plan_to_watch: "Plan to watch",
};

const nextStatus: Record<WatchStatus, WatchStatus> = {
  plan_to_watch: "watching",
  watching: "watched",
  watched: "plan_to_watch",
};

interface Props {
  entry: WatchlistEntry;
  onDelete: (imdbID: string) => void;
  onStatusChange: (entry: WatchlistEntry) => void;
  onRating: (imdbID: string, rating: number) => void;
}

export default function MovieCard({
  entry,
  onDelete,
  onStatusChange,
  onRating,
}: Props) {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={entry.Title}
          src={
            entry.Poster !== "N/A"
              ? entry.Poster
              : "https://via.placeholder.com/300x450?text=No+Poster"
          }
          style={{ height: 280, objectFit: "cover" }}
        />
      }
      actions={[
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(entry.imdbID)}
        />,
      ]}
    >
      <Card.Meta
        title={<span style={{ fontSize: 13 }}>{entry.Title}</span>}
        description={
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div>
              <Tag>{entry.Year}</Tag>
              <Tag color={entry.Type === "movie" ? "blue" : "purple"}>
                {entry.Type}
              </Tag>
            </div>
            <Tag
              color={statusColor[entry.status]}
              style={{ cursor: "pointer", width: "fit-content" }}
              onClick={() => onStatusChange(entry)}
            >
              {statusLabel[entry.status]} →{" "}
              {statusLabel[nextStatus[entry.status]]}
            </Tag>
            {entry.imdbRating && (
              <span style={{ fontSize: 12 }}>⭐ IMDB: {entry.imdbRating}</span>
            )}
            {entry.totalSeasons && (
              <span style={{ fontSize: 12 }}>
                📺 {entry.totalSeasons} seasons
              </span>
            )}
            <Rate
              count={10}
              value={entry.myRating ?? 0}
              onChange={(val) => onRating(entry.imdbID, val)}
              style={{ fontSize: 10 }}
            />
          </div>
        }
      />
    </Card>
  );
}
