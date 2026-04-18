import {
  createResource,
  createSignal,
  onMount,
  onCleanup,
  Show,
} from "solid-js";
import { loadTodayAndTomorrow } from "../services/events";

export default function EventsPanel() {
  const [data] = createResource(loadTodayAndTomorrow);

  const [mode, setMode] = createSignal<"today" | "tomorrow">("today");

  onMount(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev === "today" ? "tomorrow" : "today"));
    }, 10000); // 10 seconds

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div>
      <Show when={data()}>
        {(d) => {
          const current = () =>
            mode() === "today" ? d().today[0] : d().tomorrow[0];

          return (
            <div style={{ "text-align": "center", padding: "1rem" }}>
              <div
                style={{
                  "font-size": "5.0vh",
                  "font-weight": 900,
                  color: "black",
                }}
              >
                {mode() === "today" ? "Hari Ini" : "Esok"}
              </div>

              <div
                style={{
                  "font-size": "5vh",
                  "font-weight": 900,
                  color: "darkgreen",
                }}
              >
                {current()?.title}
              </div>
              {current().speakerCode && (
                <img
                  style={{ width: "16vw", "border-radius": "1vw" }}
                  src={`/data/speaker-imgs/${current().speakerCode}.png`}
                  alt={current().speaker}
                />
              )}

              <Show when={current().speaker}>
                <div
                  style={{
                    color: "darkgreen",
                    "font-size": "5vh",
                    "font-weight": 900,
                    "text-align": "center",
                  }}
                >
                  {current().speaker}
                </div>
              </Show>
            </div>
          );
        }}
      </Show>
    </div>
  );
}
