import { createSignal, onCleanup } from "solid-js";


function HexBadge(props: {
  value: string | number;
  size?: number;
  fontSize?: string;
  fontFamily?: string;
}) {
  const size = props.size ?? 140;

  // Regular hexagon points inside 100x100 viewBox
  const hexPoints = "50,5 93.3,25 93.3,75 50,95 6.7,75 6.7,25";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block" }}
    >
      {/* Hexagon border */}
      <polygon
        points={hexPoints}
        fill="none"
        stroke="silver"
        stroke-width="3"
        stroke-width="5"
      />
      {/* Centered text */}
      <text
        x="50"
        y="43"
        dy="0.1em"
        text-anchor="middle"
        alignment-baseline="central"
        font-size={props.fontSize ?? "40"}
        font-family={props.fontFamily ?? "inherit"}
        font-weight="bold"
        fill="#f1c40f"
      >
        {props.value}
      </text>
    </svg>
  );
}




export default function Clock() {
  const [time, setTime] = createSignal(new Date());

  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  onCleanup(() => clearInterval(timer));

  const today = () => time();

  const gregorianDay = () => today().getDate();

  const hijriDay = () =>
    new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
    }).format(today());


  return (
    <div
      style={{
        height: "12vh",
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "align-items": "center",
        padding: "0 3vw",
      }}
    >
      {/* LEFT: Gregorian (hexagon aligned LEFT) */}
      <div style={{ display: "flex", "justify-content": "flex-start" }}>
        <HexBadge size={115} value={gregorianDay()} fontSize="5vh" />
      </div>

      {/* CENTER: Clock */}
      <div
        style={{
          "font-size": "6vh",
          "font-weight": "bold",
          "font-family": "'Digital-7', sans-serif",
          color: "#0a4f00",
          "text-align": "center",
        }}
      >
        {time().toLocaleTimeString([], { hour12: false })}
      </div>

      {/* RIGHT: Hijri (hexagon aligned RIGHT) */}
      <div style={{ display: "flex", "justify-content": "flex-end" }}>
        <HexBadge
          value={hijriDay()}
          fontFamily="Noto Naskh Arabic, serif"
          fontSize="5.5vh"
          size={115}
        />
      </div>
    </div>
  );
}
