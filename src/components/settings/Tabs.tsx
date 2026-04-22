import type { TabKey } from "./types";

const tabs: { key: TabKey; label: string }[] = [
  { key: "iqamah", label: "Iqamah" },
  { key: "prayer-times", label: "Prayer Times" },
  { key: "events", label: "Events" },
  { key: "poster", label: "Poster" },
  { key: "misc", label: "Misc" },
];

export default function Tabs(props: {
  value: TabKey;
  onChange: (v: TabKey) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1vh",
        "margin-bottom": "2vh",
      }}
    >
      {tabs.map((t) => (
        <button
          onClick={() => props.onChange(t.key)}
          style={{
            flex: 1,
            padding: "1.2vh",
            "font-size": "2vh",
            "font-weight": "bold",
            border: "none",
            cursor: "pointer",
            background: props.value === t.key ? "darkgreen" : "#eee",
            color: props.value === t.key ? "white" : "#333",
            "border-radius": "0.8vh",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
