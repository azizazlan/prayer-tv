import { createSignal, onCleanup, onMount, createEffect } from "solid-js";
import { defaultPrayers, type Prayer } from "../prayers";
import { loadTodayPrayers } from "../services/takwim";

/**
 * Supports:
 *  - "05:47"
 *  - "5:48 am"
 *  - "7:09 pm"
 */
function timeToDate(time: string) {
  const lower = time.toLowerCase().trim();

  let hours = 0;
  let minutes = 0;

  if (lower.includes("am") || lower.includes("pm")) {
    const [raw, modifier] = lower.split(" ");
    [hours, minutes] = raw.split(":").map(Number);

    if (modifier === "pm" && hours !== 12) hours += 12;
    if (modifier === "am" && hours === 12) hours = 0;
  } else {
    [hours, minutes] = lower.split(":").map(Number);
  }

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export default function PrayerList() {
  // ✅ prayers must be a signal
  const [prayers, setPrayers] = createSignal<Prayer[]>(defaultPrayers);
  const [nextIndex, setNextIndex] = createSignal(0);

  // ✅ load CSV from public/
  onMount(async () => {
    const today = await loadTodayPrayers();
    if (today) {
      setPrayers(today);
    }
  });

  // ✅ recalc next prayer every second using CURRENT prayers
  const timer = setInterval(() => {
    const now = new Date();
    const list = prayers();

    for (let i = 0; i < list.length; i++) {
      if (timeToDate(list[i].time) > now) {
        setNextIndex(i);
        return;
      }
    }

    // fallback → first prayer tomorrow
    setNextIndex(0);
  }, 1000);

  onCleanup(() => clearInterval(timer));

  return (
    <div
      style={{
        flex: 1,              // 🔥 THIS pushes Duha down
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center", // optional
        padding: "0 3vw",
        "font-size": "3.7vh",
      }}
    >
      {prayers().map((p, index) => {
        const isNext = index === nextIndex();

        return (
          <div
            style={{
              display: "grid",
              "grid-template-columns": "minmax(0, 1fr) auto minmax(0, 1fr)",
              "align-items": "center",
              "font-size": "4.5vh",
              "font-weight": isNext ? "900" : "500",
              color: isNext ? "#0a4f00" : "#000",
              padding: "1vh 0",
            }}
          >
            {/* English */}
            <div style={{ "text-align": "left" }}>{p.en}</div>

            {/* Time */}
            <div style={{ "text-align": "center" }}>
              {p.time}
            </div>

            {/* Arabic */}
            <div
              style={{
                direction: "rtl",
                "min-width": "0",
                display: "block",
                "justify-self": "end",   // ⭐ THIS FIXES IT
                overflow: "visible",
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

