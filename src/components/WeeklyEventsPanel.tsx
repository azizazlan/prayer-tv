import { For, Show, createMemo } from "solid-js";
import type { Event } from "../event";

export default function WeeklyEventsPanel(props: { events: Event[] }) {
  const groupedByDate = createMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of props.events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return Array.from(map.entries());
  });

  return (
    <Show when={groupedByDate().length > 0}>
      <div style={{ padding: "0vh 3vw", background: "white" }}>
        <For each={groupedByDate()}>
          {([date, events]) => (
            <div style={{ "margin-bottom": "1vh", "border-bottom": "1px solid #0b3d2e", "padding-bottom": "1vh" }}>
              <For each={events}>
                {(e) => (
                  <div>
                    {/* LEFT: DAY */}
                    <div
                      style={{
                        "font-size": "2.5vh",
                        "font-weight": "bold",
                        "text-transform": "uppercase",
                        color: "#0b3d2e",
                      }}
                    >
                      {e.day} - {date}
                    </div>

                    {/* RIGHT: Event info */}
                    <div>
                      <div
                        style={{
                          "font-size": "2.7vh",
                          "font-weight": "900",
                          color: "green",
                        }}
                      >
                        {e.title}
                      </div>

                      <Show when={e.desc && e.desc !== "-"}>
                        <div
                          style={{
                            "font-size": "2.2vh",
                            color: "#3f5f52",
                          }}
                        >
                          {e.desc}
                        </div>
                      </Show>

                      <div
                        style={{
                          "font-size": "3vh",
                          color: "#355e4b",
                        }}
                      >
                        {e.speaker}
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
