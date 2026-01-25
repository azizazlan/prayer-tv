import {
  For,
  Show,
  createMemo,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";

/* ================= TYPES ================= */

export type Event = {
  date: string; // "29-Dec-2025"
  day: string;  // "Isnin"
  time?: string;
  title: string;
  speaker?: string;
};

/* ================= CONFIG ================= */

const SLIDE_MS = 4000; // change to 30000 later

const DAY_NAMES = [
  "Ahad",
  "Isnin",
  "Selasa",
  "Rabu",
  "Khamis",
  "Jumaat",
  "Sabtu",
];

/* ================= HELPERS ================= */

const parseDate = (s: string) =>
  new Date(Date.parse(s.replace(/-/g, " ")));

const formatDate = (d: Date) =>
  d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",

    })
    .replace(/ /g, "-");

const dayNameFromDate = (dateStr: string) =>
  DAY_NAMES[parseDate(dateStr).getDay()];

const startOfWeekMonday = (d: Date) => {
  const day = d.getDay(); // Sun=0
  const diff = (day === 0 ? -6 : 1) - day;
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
  m.setHours(0, 0, 0, 0);
  return m;
};

const timeToMinutes = (t?: string) => {
  if (!t) return 0;
  const [time, ap] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

/* ================= COMPONENT ================= */

export default function WeeklyEventsPanel(props: { events: Event[] }) {
  /* ---------- TODAY ---------- */
  const today = () =>
    formatDate(new Date());

  /* ---------- CURRENT WEEK (MONDAY) ---------- */
  const currentWeekKey = createMemo(() =>
    startOfWeekMonday(new Date()).getTime()
  );

  /* ---------- BUILD WEEKS (MON–SUN ALWAYS EXISTS) ---------- */
  const weeks = createMemo(() => {
    const map = new Map<number, [string, Event[]][]>();

    for (const e of props.events) {
      if (!e.date) continue;

      const dateObj = parseDate(e.date);
      const weekKey = startOfWeekMonday(dateObj).getTime();

      // Create week if missing
      if (!map.has(weekKey)) {
        const days: [string, Event[]][] = [];
        const monday = startOfWeekMonday(dateObj);

        for (let i = 0; i < 7; i++) {
          const d = new Date(monday);
          d.setDate(d.getDate() + i);
          days.push([formatDate(d), []]);
        }

        map.set(weekKey, days);
      }

      // Insert event into correct day
      const week = map.get(weekKey)!;
      const day = week.find(([date]) => date === e.date);
      if (day) day[1].push(e);
    }

    // Sort events by time
    for (const week of map.values()) {
      week.forEach(([, events]) =>
        events.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
      );
    }

    return map;
  });

  /* ---------- SLIDE TIMER ---------- */
  const [tick, setTick] = createSignal(0);

  onMount(() => {
    const id = setInterval(() => setTick(t => t + 1), SLIDE_MS);
    onCleanup(() => clearInterval(id));
  });

  /* ---------- SLIDE INDEX ---------- */
  const slideIndex = createMemo(() => tick() % 3);

  /* ---------- VISIBLE DAYS ---------- */
  const visibleDays = createMemo(() => {
    const week = weeks().get(currentWeekKey());
    if (!week) return [];

    if (slideIndex() === 0) return week.slice(0, 3); // Isnin–Rabu
    if (slideIndex() === 1) return week.slice(3, 5); // Khamis–Sabtu
    return week.slice(5, 7); // Ahad
  });

  /* ---------- PROGRESS ---------- */
  const [progress, setProgress] = createSignal(0);

  onMount(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setProgress(((Date.now() - start) % SLIDE_MS) / SLIDE_MS);
    }, 100);
    onCleanup(() => clearInterval(id));
  });

  /* ================= RENDER ================= */

  return (
    <Show when={visibleDays().length > 0} fallback={<div>No events</div>}>
      <div style={{ width: "100%", animation: "fadeSlide 0.6s ease", display: "flex", "flex-direction": "column" }}>

        <For each={visibleDays()}>
          {([date, events]) => {
            const isToday = date === today();

            return (
              <div
                style={{
                  display: "flex",
                  "flex-direction": "row",
                  "border-bottom": "1px solid silver",
                  "background-color": isToday
                    ? "black"
                    : "white",
                  "padding-left": "2.0vw",
                }}
              >
                {/* DATE */}
                <div
                  style={{
                    "min-width": "13vw",
                    "font-size": "3.5vh",
                    "font-weight": "900",
                    "text-transform": "uppercase",
                    "line-height": "5.0vh",
                    color: isToday ? "white" : "black",
                  }}
                >
                  <div>{dayNameFromDate(date)}</div>
                  <div>{date}</div>
                </div>

                {/* EVENTS */}
                <div style={{ "line-height": "5.0vh", display: "flex", "flex-direction": "row", "margin-left": "2vh" }}>
                  <Show
                    when={events.length > 0}
                    fallback={
                      <div
                        style={{
                          "font-size": "4.0vh",
                          opacity: 0.35,
                          "font-style": "italic",
                          color: isToday ? "white" : "black",
                        }}
                      >
                        Tiada acara
                      </div>
                    }
                  >
                    <For each={events}>
                      {(e) => (
                        <div style={{ "margin-bottom": "1.35vh", display: "flex", "flex-direction": "row" }}>
                          <div>
                            <div style={{ "margin-right": "1vh" }}>
                              {e.speakerCode ? (
                                <img
                                  style={{ "width": "6.5vw", height: "auto" }}
                                  src={`/data/speaker-imgs/${e.speakerCode}.png`}
                                  alt={e.speaker}
                                />
                              ) : (
                                <div class="" />
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", "flex-direction": "column" }}>
                            <div
                              style={{
                                "font-size": "4.0vh",
                                "font-weight": "900",
                                color: isToday ? "white" : "black"
                              }}
                            >
                              {e.time} {e.title}
                            </div>
                            <Show when={e.speaker}>
                              <div style={{
                                "font-size": "3.0vh",
                                color: isToday ? "white" : "black"
                              }}>
                                {e.speaker}
                              </div>
                            </Show>
                          </div>
                        </div>
                      )}
                    </For>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <style>
        {`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Show>
  );
}
