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
      : "#000";          // default

  return (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "font-size": "4.5vh",
        "font-weight": props.active ? "900" : "500",
        color: textColor,
        padding: "1vh 3vw",
      }}
    >
      <div>{props.prayer.en}</div>
      <div>
        {padZero(d.getHours())}:{padZero(d.getMinutes())}
      </div>
      <div style={{ direction: "rtl", "font-size": "larger" }}>
        {props.prayer.ar}
      </div>
    </div>
  );
}
