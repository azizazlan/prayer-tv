import type { Prayer } from "../prayers";
import { padZero, timeToDate } from "../utils/time";

export default function PrayerRow(props: {
  prayer: Prayer;
  active: boolean;
}) {
  const d = timeToDate(props.prayer.time);

  return (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "font-size": "4.5vh",
        "font-weight": props.active ? "900" : "500",
        color: props.active ? "#0a4f00" : "#000",
        padding: "1vh 0",
      }}
    >
      <div>{props.prayer.en}</div>
      <div>
        {padZero(d.getHours())}:{padZero(d.getMinutes())}
      </div>
      <div style={{ direction: "rtl" }}>
        {props.prayer.ar}
      </div>
    </div>
  );
}
