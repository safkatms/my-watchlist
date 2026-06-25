import { useMemo } from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  TrophyOutlined,
  ClockCircleOutlined,
  StarOutlined,
  PlayCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { WatchlistEntry } from "../types";

interface Props {
  watchlist: WatchlistEntry[];
}

export default function StatsDashboard({ watchlist }: Props) {
  const stats = useMemo(() => {
    const watched = watchlist.filter((m) => m.status === "watched");
    const watching = watchlist.filter((m) => m.status === "watching");
    const movies = watched.filter((m) => m.Type === "movie");
    const series = watched.filter((m) => m.Type === "series");

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
      totalWatched: watched.length,
      watching: watching.length,
      movies: movies.length,
      series: series.length,
      hoursWatched: Math.round(totalMins / 60),
      avgRating,
      topGenre,
    };
  }, [watchlist]);

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={8} md={4}>
        <Card>
          <Statistic
            title="Total watched"
            value={stats.totalWatched}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} md={4}>
        <Card>
          <Statistic
            title="Watching now"
            value={stats.watching}
            prefix={<PlayCircleOutlined />}
            valueStyle={{ color: "#1677ff" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} md={4}>
        <Card>
          <Statistic
            title="Hours watched"
            value={stats.hoursWatched}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} md={4}>
        <Card>
          <Statistic
            title="Avg my rating"
            value={stats.avgRating}
            prefix={<StarOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} md={4}>
        <Card>
          <Statistic
            title="Movies"
            value={stats.movies}
            prefix={<EyeOutlined />}
            valueStyle={{ color: "#13c2c2" }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} md={4}>
        <Card>
          <Statistic
            title="Top genre"
            value={stats.topGenre}
            valueStyle={{ color: "#eb2f96", fontSize: 18 }}
          />
        </Card>
      </Col>
    </Row>
  );
}
