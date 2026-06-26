import { Select, Input } from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";

interface Props {
  statusFilter: string;
  typeFilter: string;
  genreFilter: string;
  sortBy: string;
  allGenres: string[];
  search: string;
  onStatusChange: (val: string) => void;
  onTypeChange: (val: string) => void;
  onGenreChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onSearchChange: (val: string) => void;
}

const selectStyle = { minWidth: 160 };

export default function FilterBar({
  statusFilter,
  typeFilter,
  genreFilter,
  sortBy,
  allGenres,
  search,
  onStatusChange,
  onTypeChange,
  onGenreChange,
  onSortChange,
  onSearchChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
        padding: "16px 20px",
        background: "#141414",
        borderRadius: 12,
        border: "1px solid #2a2a2a",
        marginBottom: 24,
      }}
    >
      <Input
        prefix={<SearchOutlined style={{ color: "#555" }} />}
        placeholder="Search your list..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 8,
          color: "#fff",
          width: 200,
        }}
      />

      <Select
        value={statusFilter}
        onChange={onStatusChange}
        style={selectStyle}
      >
        <Select.Option value="all">All Statuses</Select.Option>
        <Select.Option value="watched">
          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 6 }} />
          Watched
        </Select.Option>
        <Select.Option value="watching">
          <EyeOutlined style={{ color: "#1677ff", marginRight: 6 }} />
          Watching
        </Select.Option>
        <Select.Option value="plan_to_watch">
          <ClockCircleOutlined style={{ color: "#faad14", marginRight: 6 }} />
          Plan to Watch
        </Select.Option>
      </Select>

      <Select value={typeFilter} onChange={onTypeChange} style={selectStyle}>
        <Select.Option value="all">All Types</Select.Option>
        <Select.Option value="movie">
          <VideoCameraOutlined style={{ marginRight: 6 }} />
          Movies
        </Select.Option>
        <Select.Option value="series">
          <DesktopOutlined style={{ marginRight: 6 }} />
          Series
        </Select.Option>
      </Select>

      <Select value={genreFilter} onChange={onGenreChange} style={selectStyle}>
        <Select.Option value="all">All Genres</Select.Option>
        {allGenres.map((g) => (
          <Select.Option key={g} value={g}>
            {g}
          </Select.Option>
        ))}
      </Select>

      <Select
        value={sortBy}
        onChange={onSortChange}
        style={selectStyle}
        suffixIcon={<SortAscendingOutlined style={{ color: "#555" }} />}
      >
        <Select.Option value="dateAdded">Date Added</Select.Option>
        <Select.Option value="imdbRating">IMDB Rating</Select.Option>
        <Select.Option value="myRating">My Rating</Select.Option>
        <Select.Option value="title">Title A–Z</Select.Option>
      </Select>
    </div>
  );
}
