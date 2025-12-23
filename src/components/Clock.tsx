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
        fill="none"
        stroke="silver"
        stroke-width="5"
      />
      <text
        x="50"
        y="43"
        dy="0.1em"
        text-anchor="middle"
        alignment-baseline="central"
        font-size={props.fontSize ?? "40"}
        font-family={props.fontFamily ?? "inherit"}
        font-weight="bold"
        fill="#f39c12"
      >
        {props.value}
      </text>
    </svg>
  );
}

export default function Clock(props: { now: Accessor<Date> }) {
  const today = () => props.now();

  const gregorianDay = () => today().getDate();

  const hijriDay = () =>
    new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
    }).format(today());

  return (
    <div
      style={{
        "margin-top": "3vh",
        height: "12vh",
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "align-items": "center",
        padding: "0 3vw",
      }}
    >
      {/* LEFT: Gregorian */}
      <div style={{ display: "flex", "justify-content": "flex-start" }}>
        <HexBadge size={115} value={gregorianDay()} fontSize="3.5vh" />
      </div>

      {/* CENTER: Clock */}
      <div
        style={{
          "font-size": "7vh",
          "font-weight": "bold",
          "font-family": "'Digital-7', sans-serif",
          color: "darkgreen",
          "text-align": "center",
        }}
      >
        {today().toLocaleTimeString([], { hour12: false })}
      </div>

      {/* RIGHT: Hijri */}
      <div style={{ display: "flex", "justify-content": "flex-end" }}>
        <HexBadge
          value={hijriDay()}
          fontFamily="Noto Naskh Arabic, serif"
          fontSize="3.7vh"
          size={115}
        />
      </div>
    </div>
  );
}
