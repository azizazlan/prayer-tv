import type { Prayer } from "../prayers";
import { padZero, timeToDate } from "../utils/time";

export default function PrayerRow(props: {
  prayer: Prayer;
  active: boolean;
}) {
  const d = timeToDate(props.prayer.time);

  const isSyuruk = props.prayer.en === "Syuruk";

  const textColor = props.active
    ? "#0a4f00"          // deep green (active)
    : isSyuruk
      ? "#f1c40f"        // light orange (Syuruk)
      : "black";          // default

  const textTimeColor = props.active
    ? "#0a4f00"          // deep green (active)
    : isSyuruk
      ? "#f1c40f"        // light orange (Syuruk)
      : "#c0392b";          // default

  return (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "font-weight": props.active ? "900" : "500",
        color: textColor,
        padding: "1.0vh 3vw",
      }}
    >
      <div
        style={{
          "font-size": "4.1vh",
          "padding-top": "1.1vh"
        }}
      >{props.prayer.en}</div>
      <div style={{
        "text-align": "center",
        "font-size": "5.5vh",
        "padding-bottom": "0.5vh",
        "font-weight": props.active ? "900" : "500",
        color: textTimeColor
      }}>
        {padZero(d.getHours())}:{padZero(d.getMinutes())}
      </div>
      <div style={{
        direction: "rtl",
        "font-weight": "900",
        "font-size": "5.0vh",
        "font-family": "Cairo"
      }}>
        {props.prayer.ar}
      </div>
    </div>
  );
}
