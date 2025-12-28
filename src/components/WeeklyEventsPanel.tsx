import { For, Show, createMemo } from "solid-js";

export type Event = {
  date: string; // e.g. "29-Dec-2025"
  day: string;  // e.g. "Isnin"
  time?: string; // e.g. "11:00 AM"
  title: string;
  speaker?: string;
};

export default function WeeklyEventsPanel(props: { events: Event[] }) {
  // Get today's date in the same format as CSV
  const today = createMemo(() => {
    const d = new Date();
    return d
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/ /g, "-");
  });

  // Helper: convert "11:00 AM" to minutes for sorting
  const timeToMinutes = (timeStr?: string) => {
    if (!timeStr) return 0;
    const [time, meridiem] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Group events by date and sort by time
  const groupedByDate = createMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of props.events) {
      if (!e.date) continue; // skip invalid rows
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }

    for (const events of map.values()) {
      events.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    }

    return Array.from(map.entries());
  });

  return (
    <Show
      when={props.events.length > 0}
      fallback={<div>No events to display</div>}
    >
      <div style={{ width: "100%", "box-sizing": "border-box" }}>
        <For each={groupedByDate()}>
          {([date, events]) => {
            const isToday = () => date === today();

            return (
              <div
                style={{
                  width: "100%",
                  "margin-top": "1.0vh",
                  display: "grid",
                  "grid-template-columns": "minmax(220px, 320px) 1fr",
                  gap: "0vw",
                  "border-bottom": "3px solid #FFF3E0",
                  padding: "1vh 2.0vw",
                  "box-sizing": "border-box",
                  "background-color": isToday() ? "darkgreen" : "white",
                }}
              >
                {/* LEFT COLUMN — Date */}
                <div
                  style={{
                    "flex-direction": "column",
                    "font-size": "4.3vh",
                    "font-weight": isToday() ? "900" : "normal",
                    color: isToday() ? "white" : "#0b3d2e",
                    "text-transform": "uppercase",
                    "line-height": "5.0vh"
                  }}
                >
                  <div>
                    {events[0].day}
                  </div>
                  <div>
                    {date}
                  </div>
                </div>

                {/* RIGHT COLUMN — Events */}
                <div>
                  <For each={events}>
                    {(e) => (
                      <div
                        style={{
                          "margin-bottom": "1.5vh",
                          "padding-left": "1vw",
                          "border-left": "0px solid #2ecc71",
                          color: isToday() ? "white" : "#0b3d2e",
                        }}
                      >
                        <div
                          style={{
                            "font-size": "4.5vh",
                            "font-weight": isToday() ? "900" : "500",
                            color: isToday() ? "white" : "darkgreen",
                            "line-height": "1.2",
                          }}
                        >
                          {e.time}.  {e.title}
                        </div>

                        {e.speaker && (
                          <div
                            style={{
                              "font-size": "4.1vh",
                              color: isToday() ? "white" : "#0b3d2e",
                            }}
                          >
                            {e.speaker}
                          </div>
                        )}
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
  );
}
