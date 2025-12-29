import {
  For,
  Show,
  createMemo,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import SlideProgressCircle from "./SlideProgressCircle";


export type Event = {
  date: string;
  day: string;
  time?: string;
  title: string;
  speaker?: string;
};

const SLIDE_MS = 10000; // use 30000 later

/* ================= HELPERS ================= */

const parseDate = (s: string) =>
  new Date(Date.parse(s.replace(/-/g, " ")));

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
    new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

  /* ---------- GROUP EVENTS BY WEEK ---------- */
  const weeks = createMemo(() => {
    const map = new Map<number, [string, Event[]][]>();

    for (const e of props.events) {
      if (!e.date) continue;

      const weekKey = startOfWeekMonday(parseDate(e.date)).getTime();
      if (!map.has(weekKey)) map.set(weekKey, []);

      const week = map.get(weekKey)!;
      let day = week.find(([d]) => d === e.date);
      if (!day) {
        day = [e.date, []];
        week.push(day);
      }
      day[1].push(e);
    }

    // sort days and events
    for (const week of map.values()) {
      week.sort(
        ([a], [b]) => parseDate(a).getTime() - parseDate(b).getTime()
      );
      week.forEach(([, ev]) =>
        ev.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
      );
    }

    return Array.from(map.values());
  });

  /* ---------- TIMER SIGNAL ---------- */
  const [tick, setTick] = createSignal(0);

  onMount(() => {
    const id = setInterval(() => setTick(t => t + 1), SLIDE_MS);
    onCleanup(() => clearInterval(id));
  });

  /* ---------- SLIDE INDEXES ---------- */
  const slideIndex = createMemo(() => tick() % 3);
  const weekIndex = createMemo(() => {
    const w = weeks().length;
    return w ? Math.floor(tick() / 3) % w : 0;
  });

  /* ---------- VISIBLE DAYS ---------- */
  const visibleDays = createMemo(() => {
    const week = weeks()[weekIndex()];
    if (!week) return [];

    if (slideIndex() === 0) return week.slice(0, 3); // Mon–Wed
    if (slideIndex() === 1) return week.slice(3, 6); // Thu–Sat
    return week.slice(6, 7); // Sunday
  });

  const [progress, setProgress] = createSignal(0);
  onMount(() => {
    const start = Date.now();

    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress((elapsed % SLIDE_MS) / SLIDE_MS);
    }, 100);

    onCleanup(() => clearInterval(id));
  });
  /* ================= RENDER ================= */

  return (
    <Show when={visibleDays().length > 0} fallback={<div>No events</div>}>
      <div style={{ width: "100%", animation: "fadeSlide 0.6s ease" }}>
        <SlideProgressCircle
          progress={progress()}
          visible={slideIndex() < 2}
        />
        <For each={visibleDays()}>
          {([date, events]) => {
            const isToday = date === today();

            return (
              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "275px 1fr",
                  padding: "1.2vh 1vw",
                  "border-bottom": "3px solid #FFE0B2",
                  "background-color": isToday
                    ? "rgba(255,165,0,0.18)"
                    : "white",
                }}
              >
                {/* DATE */}
                <div
                  style={{
                    "font-size": "4.2vh",
                    "font-weight": "900",
                    "text-transform": "uppercase",
                    "line-height": "5.0vh"
                  }}
                >
                  <div>{events[0].day}</div>
                  <div>{date}</div>
                </div>

                {/* EVENTS */}
                <div style={{ "line-height": "5.0vh" }}>
                  <For each={events}>
                    {(e) => (
                      <div style={{ "margin-bottom": "1.4vh" }}>
                        <div
                          style={{
                            "font-size": "4.6vh",
                            "font-weight": "900",
                          }}
                        >
                          {e.time} {e.title}
                        </div>
                        <Show when={e.speaker}>
                          <div style={{ "font-size": "4.0vh" }}>
                            {e.speaker}
                          </div>
                        </Show>
                      </div>
                    )}
                  </For>
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
