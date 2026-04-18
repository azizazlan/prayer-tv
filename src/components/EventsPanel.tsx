import { createResource } from "solid-js";
import { loadTodayAndTomorrow } from "../services/events";

export default function EventsPanel() {
  const [data] = createResource(loadTodayAndTomorrow);

  return (
    <div style={{ color: "black" }}>
      <Show when={data()}>
        {(d) => (
          <div style={{ "text-align": "center", padding: "1rem" }}>
            <div style={{ "font-size": "5vh" }}>Hari Ini</div>
            <h1>{d().today[0].title}</h1>
            <div style={{ "font-size": "5vh", color: "silver" }}>Esok</div>
            <div style={{ color: "silver", "font-size": "7vh" }}>
              {d().tomorrow[0].title}
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}
