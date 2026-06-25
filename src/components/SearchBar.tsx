import { Input } from "antd";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  return (
    <Input.Search
      placeholder="Search movies or series..."
      onSearch={onSearch}
      enterButton="Search"
      size="large"
      style={{ marginBottom: 24 }}
    />
  );
}
