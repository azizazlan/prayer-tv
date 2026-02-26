import {
  createMemo,
  createSignal,
  onMount,
  onCleanup,
  Show,
  For,
} from "solid-js";

/* ============================================================
   CONFIG
============================================================ */

const SLIDE_MS = 8000;

const DAY_NAMES = [
  "Ahad",
  "Isnin",
  "Selasa",
  "Rabu",
  "Khamis",
  "Jumaat",
  "Sabtu",
];

/* ============================================================
   DATE PARSING (ROBUST)
============================================================ */

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${day} ${month} ${year} 00:00:00`);
};

const parseDateTime = (dateStr: string, time?: string) => {
  const d = parseDate(dateStr);

  if (!time) {
    d.setHours(23, 59, 59, 999);
    return d;
  }

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

const formatDisplayDate = (d: Date) =>
  d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

/* ============================================================
   EVENT TYPE
============================================================ */

export type Event = {
  date: string;
  time?: string;
  title: string;
  speaker?: string;
  speakerCode?: string;
  dateObj?: Date; // Added for futureEvents mapping
};

/* ============================================================
   COMPONENT
============================================================ */

export default function EventsPanel(props: { events: Event[] }) {
  const now = () => new Date();

  /* ============================================================
     FUTURE EVENTS ONLY
  ============================================================ */

  const futureEvents = createMemo<Event[]>(() => {
    return props.events
      .map((e) => ({
        ...e,
        dateObj: parseDateTime(e.date, e.time),
      }))
      .filter((e) => e.dateObj && e.dateObj.getTime() >= now().getTime())
      .sort((a, b) => a.dateObj!.getTime() - b.dateObj!.getTime());
  });

  /* ============================================================
     GROUP BY DATE
  ============================================================ */

  const grouped = createMemo<[string, Event[]][]>(() => {
    const map = new Map<string, Event[]>();

    for (const e of futureEvents()) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }

    return Array.from(map.entries());
  });

  /* ============================================================
     SLIDE TIMER
  ============================================================ */

  const [tick, setTick] = createSignal(0);

  onMount(() => {
    const id = setInterval(() => setTick((t) => t + 1), SLIDE_MS);
    onCleanup(() => clearInterval(id));
  });

  const slideIndex = createMemo(() => tick() % 4);

  /* ============================================================
     NEXT UPCOMING EVENT
  ============================================================ */

  const highlightEvent = createMemo<Event | null>(() =>
    futureEvents().length ? futureEvents()[0] : null,
  );

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* EVENT LIST */}
      <Show when={slideIndex() !== 3 && grouped().length > 0}>
        <div
          style={{
            "margin-top": "3vh",
            display: "flex",
            "flex-direction": "column",
          }}
        >
          <For each={grouped()}>
            {([date, events]) => {
              const d = parseDate(date);

              return (
                <div
                  style={{
                    display: "flex",
                    "border-bottom": "1px solid silver",
                    "padding-left": "2vw",
                  }}
                >
                  <div
                    style={{
                      "min-width": "13vw",
                      "font-size": "3.5vh",
                      "font-weight": 900,
                    }}
                  >
                    <div>{DAY_NAMES[d.getDay()]}</div>
                    <div>{formatDisplayDate(d)}</div>
                  </div>

                  <div style={{ display: "flex", "margin-left": "2vh" }}>
                    <For each={events}>
                      {(e) => (
                        <div style={{ display: "flex", "margin-right": "3vw" }}>
                          {e.speakerCode && (
                            <img
                              style={{ width: "6.5vw" }}
                              src={`/data/speaker-imgs/${e.speakerCode}.png`}
                            />
                          )}

                          <div style={{ "margin-left": "1vh" }}>
                            <div
                              style={{ "font-size": "4vh", "font-weight": 900 }}
                            >
                              {e.time} {e.title}
                            </div>

                            <Show when={e.speaker}>
                              <div style={{ "font-size": "3vh" }}>
                                {e.speaker}
                              </div>
                            </Show>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Show>

      {/* HIGHLIGHT */}
      <Show when={slideIndex() === 3}>
        <Show
          when={highlightEvent()}
          fallback={
            <div
              style={{
                "margin-top": "6vh",
                "font-size": "5vh",
                "text-align": "center",
              }}
            >
              Tiada acara akan datang
            </div>
          }
        >
          {(e) => (
            <div
              style={{
                "margin-top": "6vh",
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
                gap: "4vw",
              }}
            >
              {e().speakerCode && (
                <img
                  style={{ width: "14vw" }}
                  src={`/data/speaker-imgs/${e().speakerCode}.png`}
                />
              )}

              <div>
                <div style={{ "font-size": "6vh", "font-weight": 900 }}>
                  {e().time} {e().title}
                </div>

                <Show when={e().speaker}>
                  <div style={{ "font-size": "4vh" }}>{e().speaker}</div>
                </Show>
              </div>
            </div>
          )}
        </Show>
      </Show>
    </>
  );
}
