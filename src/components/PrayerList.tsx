import { createSignal, onCleanup } from "solid-js";
import { prayers } from "../prayers";

function timeToDate(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function getNextPrayerIndex() {
  const now = new Date();

  for (let i = 0; i < prayers.length; i++) {
    if (timeToDate(prayers[i].time) > now) {
      return i;
    }
  }

  return 0;
}

export default function PrayerList() {
  const [nextIndex, setNextIndex] = createSignal(getNextPrayerIndex());

  const timer = setInterval(() => {
    setNextIndex(getNextPrayerIndex());
  }, 1000);

  onCleanup(() => clearInterval(timer));

  return (
    <div style={{ padding: "1vh 3vw", flex: "1" }}>
      {prayers.map((p, index) => {
        const isNext = index === nextIndex();

        return (
          <div
            style={{
              display: "grid",
              "grid-template-columns": "1fr auto 1fr",
              alignItems: "center",
              padding: "1.2vh 0",
              "font-size": "4.5vh",
              "font-weight": isNext ? "900" : "500",
              color: isNext ? "#0a7a00" : "#000",
              transition: "all 0.3s ease",
            }}
          >
            {/* English (left) */}
            <div style={{ "text-align": "left" }}>
              {p.en}
            </div>

            {/* Time (center) */}
            <div
              style={{
                "text-align": "center",
                "min-width": "6ch",
              }}
            >
              {p.time}
            </div>

            {/* Arabic (right) */}
            <div
              style={{
                "text-align": "right",
                direction: "rtl",
              }}
            >
              {p.ar}
            </div>
          </div>
        );
      })}
    </div>
  );
}
