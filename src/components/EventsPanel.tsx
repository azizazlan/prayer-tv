import {
  createMemo,
  createSignal,
  onMount,
  onCleanup,
  Show,
  For,
} from "solid-js";

const SLIDE_MS = 8000;

/* ============================================================
   DATE HELPERS
============================================================ */

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const parseDate = (dateStr: string) => {
  const [dayStr, monthStr, yearStr] = dateStr.split("-");
  return new Date(
    parseInt(yearStr, 10),
    MONTHS[monthStr],
    parseInt(dayStr, 10),
    0,
    0,
    0,
    0,
  );
};

const parseDateTime = (dateStr: string, time?: string) => {
  const d = parseDate(dateStr);

  if (!time) return d;

  const hasAMPM =
    time.toUpperCase().includes("AM") || time.toUpperCase().includes("PM");

  if (hasAMPM) {
    const [clock, ap] = time.split(" ");
    let [h, m] = clock.split(":").map(Number);
    if (ap.toUpperCase() === "PM" && h !== 12) h += 12;
    if (ap.toUpperCase() === "AM" && h === 12) h = 0;
    d.setHours(h, m || 0, 0, 0);
  } else {
    const [h, m] = time.split(":").map(Number);
    d.setHours(h, m || 0, 0, 0);
  }

  return d;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const tomorrow = () => {
  const d = new Date(today());
  d.setDate(d.getDate() + 1);
  return d;
};

/* ============================================================
   EVENT TYPE
============================================================ */

export type Event = {
  date: string;
  time?: string;
  title: string;
  speaker?: string;
  speakerCode?: string;
  dateObj?: Date;
};

/* ============================================================
   COMPONENT
============================================================ */

export default function EventsPanel(props: { events: Event[] }) {
  // Group events for today and tomorrow
  const groupedByDay = createMemo(() => {
    const map: Record<"today" | "tomorrow", Event[]> = {
      today: [],
      tomorrow: [],
    };

    props.events.forEach((e) => {
      const dateObj = parseDateTime(e.date, e.time);
      if (isSameDay(dateObj, today())) map.today.push({ ...e, dateObj });
      else if (isSameDay(dateObj, tomorrow()))
        map.tomorrow.push({ ...e, dateObj });
    });

    // Sort each day's events by time
    for (const key of ["today", "tomorrow"] as const) {
      map[key].sort((a, b) => a.dateObj!.getTime() - b.dateObj!.getTime());
    }

    return map;
  });

  const daysToShow = createMemo(() => {
    const map = groupedByDay();
    const result: { label: string; events: Event[] }[] = [];
    if (map.today.length) result.push({ label: "Hari ini", events: map.today });
    if (map.tomorrow.length)
      result.push({ label: "Esok", events: map.tomorrow });
    return result;
  });

  const [tick, setTick] = createSignal(0);

  onMount(() => {
    const id = setInterval(() => setTick((t) => t + 1), SLIDE_MS);
    onCleanup(() => clearInterval(id));
  });

  const slideIndex = createMemo(() => {
    const days = daysToShow();
    return days.length ? tick() % days.length : 0;
  });

  const currentDay = createMemo(() => {
    const days = daysToShow();
    if (!days.length) return null;
    return days[slideIndex()];
  });

  return (
    <>
      <Show
        when={currentDay()}
        fallback={
          <div
            style={{
              "margin-top": "3vh",
              "font-size": "5vh",
              "text-align": "center",
            }}
          >
            Tiada acara untuk hari ini dan esok
          </div>
        }
      >
        {(day) => (
          <div
            style={{
              "margin-top": "3vh",
              display: "flex",
              "flex-direction": "column",
              "justify-content": "center",
              "align-items": "center",
              gap: "2vh",
              animation: "fadeSlide 0.6s ease",
            }}
          >
            <For each={day().events}>
              {(e) => (
                <div
                  style={{
                    display: "flex",
                    "flex-direction": "column",
                    "justify-content": "center",
                    "align-items": "center",
                    gap: "0.5vh",
                  }}
                >
                  <div
                    style={{
                      "font-size": "6vh",
                      "font-weight": 900,
                      color: "darkgreen",
                      "text-align": "center",
                    }}
                  >
                    <div>
                      {day().label} {e.time}
                    </div>
                    <div>{e.title}</div>
                  </div>

                  {e.speakerCode && (
                    <img
                      style={{ width: "13.5vw", "border-radius": "1vw" }}
                      src={`/data/speaker-imgs/${e.speakerCode}.png`}
                      alt={e.speaker}
                    />
                  )}
                  <Show when={e.speaker}>
                    <div style={{ "font-size": "5vh", "font-weight": 900 }}>
                      {e.speaker}
                    </div>
                  </Show>
                </div>
              )}
            </For>
          </div>
        )}
      </Show>

      <style>
        {`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
}
