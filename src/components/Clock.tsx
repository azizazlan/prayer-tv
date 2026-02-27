import type { Accessor } from "solid-js";

function HexBadge(props: {
  value: string | number;
  size?: number;
  fontSize?: string;
  fontFamily?: string;
}) {
  const size = props.size ?? 140;
  const hexPoints = "50,5 93.3,25 93.3,75 50,95 6.7,75 6.7,25";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon
        points={hexPoints}
        fill="darkgreen"
        stroke="orange"
        stroke-width="5"
      />
      <text
        x="50"
        y="50"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size={props.fontSize ?? "40"}
        font-family={props.fontFamily ?? "inherit"}
        font-weight="bold"
        fill="white"
      >
        {props.value}
      </text>
    </svg>
  );
}

export default function Clock(props: { now: Accessor<Date> }) {
  const today = () => props.now();

  const gregorianDay = () => today().getDate();

  const hijriDay = () => {
    const OFFSET = -1; // adjust if needed

    const adjusted = new Date(today());
    adjusted.setDate(adjusted.getDate() + OFFSET);

    const formatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
    });

    return formatter.format(adjusted);
  };

  return (
    <div
      style={{
        "margin-top": "1vh",
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "align-items": "center",
        padding: "0 3vw",
      }}
    >
      <div style={{ display: "flex", "justify-content": "flex-start" }}>
        <HexBadge size={155} value={gregorianDay()} fontSize="5.0vh" />
      </div>

      <div
        style={{
          "font-size": "7.5vh",
          "font-weight": "bold",
          "font-family": "'Digital-7', sans-serif",
          color: "darkgreen",
          "text-align": "center",
        }}
      >
        {today().toLocaleTimeString([], { hour12: false })}
      </div>

      <div style={{ display: "flex", "justify-content": "flex-end" }}>
        <HexBadge value={hijriDay()} fontSize="5.0vh" size={155} />
      </div>
    </div>
  );
}
