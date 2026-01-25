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
        fill="#198a00"
        stroke="orange"
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

  const hijriDay = () =>
    new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
    }).format(today());

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
      {/* LEFT: Gregorian */}
      <div style={{ display: "flex", "justify-content": "flex-start" }}>
        <HexBadge size={155} value={gregorianDay()} fontSize="5.0vh" />
      </div>

      {/* CENTER: Clock */}
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

      {/* RIGHT: Hijri */}
      <div style={{ display: "flex", "justify-content": "flex-end" }}>
        <HexBadge
          value={hijriDay()}
          fontFamily="Noto Naskh Arabic, serif"
          fontSize="5.7vh"
          size={155}
        />
      </div>
    </div>
  );
}
