import { Select, Space } from "antd";

interface Props {
  statusFilter: string;
  typeFilter: string;
  genreFilter: string;
  sortBy: string;
  allGenres: string[];
  onStatusChange: (val: string) => void;
  onTypeChange: (val: string) => void;
  onGenreChange: (val: string) => void;
  onSortChange: (val: string) => void;
}

export default function FilterBar({
  statusFilter,
  typeFilter,
  genreFilter,
  sortBy,
  allGenres,
  onStatusChange,
  onTypeChange,
  onGenreChange,
  onSortChange,
}: Props) {
  return (
    <Space wrap style={{ marginBottom: 16 }}>
      <Select
        value={statusFilter}
        onChange={onStatusChange}
        style={{ width: 150 }}
      >
        <Select.Option value="all">All statuses</Select.Option>
        <Select.Option value="watched">Watched</Select.Option>
        <Select.Option value="watching">Watching</Select.Option>
        <Select.Option value="plan_to_watch">Plan to watch</Select.Option>
      </Select>

      <Select value={typeFilter} onChange={onTypeChange} style={{ width: 130 }}>
        <Select.Option value="all">All types</Select.Option>
        <Select.Option value="movie">Movies</Select.Option>
        <Select.Option value="series">Series</Select.Option>
      </Select>

      <Select
        value={genreFilter}
        onChange={onGenreChange}
        style={{ width: 150 }}
      >
        <Select.Option value="all">All genres</Select.Option>
        {allGenres.map((g) => (
          <Select.Option key={g} value={g}>
            {g}
          </Select.Option>
        ))}
      </Select>

      <Select value={sortBy} onChange={onSortChange} style={{ width: 160 }}>
        <Select.Option value="dateAdded">Sort: Date added</Select.Option>
        <Select.Option value="imdbRating">Sort: IMDB rating</Select.Option>
        <Select.Option value="myRating">Sort: My rating</Select.Option>
        <Select.Option value="title">Sort: Title</Select.Option>
      </Select>
    </Space>
  );
}
