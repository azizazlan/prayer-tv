import { createSignal } from "solid-js";
import type { AppEvent } from "../../types/app-event";

const EMPTY_FORM = (): AppEvent => ({
  id: crypto.randomUUID(),
  date: "",
  time: "",
  title: "",
  desc: "",
  speaker: "",
  speakerCode: "",
});

export default function EventsTab(props: {
  appEvents?: AppEvent[];
  onChange: (appEvents: AppEvent[]) => void;
}) {
  const [form, setForm] = createSignal<AppEvent>(EMPTY_FORM());

  const safeAppEvents = () => props.appEvents ?? [];

  const update = (key: keyof AppEvent, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sortAppEvents = (appEvents: AppEvent[]) =>
    appEvents.sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime(),
    );

  const addAppEvent = () => {
    const f = form();

    if (!f.date || !f.time || !f.title) {
      alert("Date, time and title are required");
      return;
    }

    const updated = sortAppEvents([...safeAppEvents(), f]);
    props.onChange(updated);

    setForm(EMPTY_FORM());
  };

  const deleteAppEvent = (id: string) => {
    const updated = safeAppEvents().filter((e) => e.id !== id);
    props.onChange(updated);
  };

  return (
    <div
      style={{
        background: "white",
        color: "black",
        display: "flex",
        "flex-direction": "column",
      }}
    >
      <div style={{ display: "grid", gap: "1vh", "max-width": "500px" }}>
        <div style={{ position: "relative", width: "200px" }}>
          <input
            type="date"
            value={form().date}
            onInput={(e) => update("date", e.currentTarget.value)}
            style={{
              width: "21vh",
              height: "4vh",
              padding: "0 4vh 0 1vh",
              "font-size": "2.5vh",
            }}
          />
        </div>

        <input
          type="time"
          value={form().time}
          onInput={(e) => update("time", e.currentTarget.value)}
          style={{
            width: "21vh",
            height: "4vh",
            padding: "0 4vh 0 1vh",
            "font-size": "2.5vh",
          }}
        />

        <input
          placeholder="Kuliah Maghrib"
          value={form().title}
          onInput={(e) => update("title", e.currentTarget.value)}
          style={{
            height: "2.5vh",
            padding: "0.1vh",
            "font-size": "2.0vh",
          }}
        />

        <input
          placeholder="Speaker name"
          value={form().speaker}
          onInput={(e) => update("speaker", e.currentTarget.value)}
          style={{
            height: "2.5vh",
            padding: "0.1vh",
            "font-size": "2.0vh",
          }}
        />

        <input
          placeholder="Speaker code"
          value={form().speakerCode}
          onInput={(e) => update("speakerCode", e.currentTarget.value)}
          style={{
            height: "2.5vh",
            padding: "0.1vh",
            "font-size": "2.0vh",
          }}
        />
        <code
          style={{
            color: "grey",
            "font-size": "2.0vh",
          }}
        >
          asyari azmi syakir hazwan nadzmi liswan wan nazrin{" "}
        </code>

        <textarea
          placeholder="Description"
          value={form().desc}
          onInput={(e) => update("desc", e.currentTarget.value)}
          style={{
            color: "black",
            "font-size": "2.0vh",
          }}
        />

        <button onClick={addAppEvent}>Add Event</button>
      </div>

      <div>
        <ul>
          {safeAppEvents().map((e) => (
            <li style={{ "margin-bottom": "1vh" }}>
              <strong>
                {e.date} {e.time}
              </strong>{" "}
              - {e.title} ({e.speaker})
              <button
                onClick={() => deleteAppEvent(e.id)}
                style={{ margin: "0 1vh" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
