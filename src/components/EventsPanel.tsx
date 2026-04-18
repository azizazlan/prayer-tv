import { createResource } from "solid-js";
import { loadTodayAndTomorrow } from "../services/events";

export default function EventsPanel() {
  const [data] = createResource(loadTodayAndTomorrow);

  return (
    <div style={{ "margin-top": "3.0vh", color: "black" }}>
      <Show when={data()}>
        {(d) => (
          <div style={{ "text-align": "center", padding: "1rem" }}>
            <div
              style={{
                "font-size": "5.5vh",
                "font-weight": 700,
                color: "darkgreen",
              }}
            >
              Hari Ini
            </div>
            <div
              style={{
                "font-size": "7.5vh",
                color: "darkgreen",
                "font-weight": 900,
              }}
            >
              {d().today[0].title}
            </div>
            <div
              style={{
                "margin-top": "3vh",
                "font-size": "5.0vh",
                color: "grey",
                "font-weight": 700,
              }}
            >
              Esok
            </div>
            <div
              style={{
                color: "grey",
                "font-size": "6.5vh",
                "font-weight": 900,
              }}
            >
              {d().tomorrow[0].title}
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}
