import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");

  return (
    <div style={{ display: "flex", gap: 0, width: "100%" }}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={() => onSearch(value)}
        onBlur={() => onSearch(value)}
        onKeyUp={() => onSearch(value)}
        placeholder={value || "Search movies or series..."}
        prefix={<SearchOutlined style={{ color: "#ffffff" }} />}
        size="large"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRight: "none",
          borderRadius: "8px 0 0 8px",
          color: "#fff",
          fontSize: 15,
          height: 50,
        }}
      />
      <Button
        size="large"
        onClick={() => onSearch(value)}
        style={{
          background: "#e50914",
          border: "none",
          color: "#fff",
          borderRadius: "0 8px 8px 0",
          fontWeight: 600,
          fontSize: 15,
          height: 50,
          paddingInline: 28,
          letterSpacing: 0.3,
        }}
      >
        Search
      </Button>
    </div>
  );
}
