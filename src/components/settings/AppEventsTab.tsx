import { createSignal } from "solid-js";
import type { AppEvent } from "../../types/app-event";

const generateId = () => crypto.randomUUID();

function getNowDefaults() {
  const now = new Date();

  const date =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const time =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  return { date, time };
}

export const EMPTY_FORM = (): AppEvent => {
  const { date, time } = getNowDefaults();

  return {
    id: "",
    date,
    time,
    title: "Kuliah Maghrib",
    desc: "",
    speaker: "YBhg. Ustaz Nadzmi",
    speakerCode: "nadzmi",
  };
};

const getDayLabel = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", // "Mon", "Tue"
  });
};

export default function AppEventsTab(props: {
  appEvents?: AppEvent[];
  onChange: (appEvents: AppEvent[]) => void;
}) {
  const [form, setForm] = createSignal<AppEvent>(EMPTY_FORM());
  const [editingId, setEditingId] = createSignal<string | null>(null);

  const safeAppEvents = () => props.appEvents ?? [];

  const editAppEvent = (e: AppEvent) => {
    setForm(e);
    setEditingId(e.id);
  };

  const update = (key: keyof AppEvent, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const sortAppEvents = (appEvents: AppEvent[]) =>
    appEvents.sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime(),
    );

  const saveAppEvent = () => {
    const f = form();

    if (!f.date || !f.time || !f.title) {
      alert("Date, time and title are required");
      return;
    }

    const isEditing = editingId() !== null;

    let updated: AppEvent[];

    if (isEditing) {
      updated = safeAppEvents().map((e) =>
        e.id === editingId() ? { ...f, id: e.id } : e,
      );
    } else {
      updated = [...safeAppEvents(), { ...f, id: crypto.randomUUID() }];
    }

    props.onChange(sortAppEvents(updated));

    setForm(EMPTY_FORM());
    setEditingId(null);
  };

  const cancelEdit = () => {
    console.log("Cancel edited");

    setEditingId(null);
    setForm(() => EMPTY_FORM());
  };

  const deleteAppEvent = (id: string) => {
    const updated = safeAppEvents().filter((e) => e.id !== id);
    props.onChange(updated);
  };

  const now = new Date();

  const defaultDate =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const defaultTime =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  return (
    <div
      style={{
        background: "white",
        color: "black",
        display: "flex",
        "flex-direction": "row",
        gap: "2vh",
        width: "100%",
      }}
    >
      <div
        style={{ display: "grid", gap: "1vh", flex: 1, "min-height": "42vh" }}
      >
        <div
          style={{
            display: "flex",
            "flex-direction": "row",
            "align-items": "center",
            position: "relative",
            width: "200px",
          }}
        >
          <div
            style={{
              color: "black",
              "font-size": "2.1vh",
              border: "1pt solid grey",
              "align-items": "center",
              "justify-content": "center",
              height: "3.7vh",
              "min-width": "3.9vh",
              padding: "0.4vh 1vh 0vh 1.0vh",
            }}
          >
            {getDayLabel(form().date)}
          </div>
          <input
            type="date"
            value={form().date}
            defaultValue={defaultDate}
            onInput={(e) => update("date", e.currentTarget.value)}
            style={{
              width: "21vh",
              height: "4vh",
              padding: "0 4vh 0 1vh",
              "font-size": "2.1vh",
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
            "font-size": "2.1vh",
          }}
        />

        <input
          placeholder="Kuliah Maghrib"
          value={form().title}
          onInput={(e) => update("title", e.currentTarget.value)}
          style={{
            height: "2.1vh",
            padding: "0.1vh",
            "font-size": "2.1vh",
          }}
        />

        <input
          placeholder="Speaker name"
          value={form().speaker}
          onInput={(e) => update("speaker", e.currentTarget.value)}
          style={{
            height: "2.1vh",
            padding: "0.1vh",
            "font-size": "2.1vh",
          }}
        />

        <input
          placeholder="Speaker code"
          value={form().speakerCode}
          onInput={(e) => update("speakerCode", e.currentTarget.value)}
          style={{
            height: "2.1vh",
            padding: "0.1vh",
            "font-size": "2.1vh",
          }}
        />
        <code
          style={{
            color: "grey",
            "font-size": "2.1vh",
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
            "font-size": "2.1vh",
          }}
        />
        <button
          style={{
            "min-height": "2.1vh",
            background: "black",
            color: "white",
            "font-size": "1.5vh",
          }}
          onClick={saveAppEvent}
        >
          {editingId() ? "Update Event" : "Add Event"}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          "min-width": "300px",
          "max-height": "40vh",
          overflow: "auto",
          padding: "0.5vh",
          border: "1px solid #e5e5e5",
          "border-radius": "8px",
        }}
      >
        {safeAppEvents().length === 0 && (
          <div
            style={{
              color: "#888",
              "text-align": "center",
              padding: "2vh",
            }}
          >
            No events yet
          </div>
        )}

        {safeAppEvents().map((e) => (
          <div
            onClick={() => editAppEvent(e)}
            style={{
              display: "flex",
              "flex-direction": "column",
              padding: "1vh",
              "margin-bottom": "0.8vh",
              border: "1px solid #eee",
              "border-radius": "6px",
              "background-color": "#fafafa",
              cursor: "pointer",
              background: editingId() === e.id ? "#e8f0ff" : "#fafafa",
              border:
                editingId() === e.id ? "1px solid #3b82f6" : "1px solid #eee",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                "justify-content": "space-between",
                "align-items": "center",
              }}
            >
              <div
                style={{
                  "font-weight": "600",
                  color: "#333",
                }}
              >
                {getDayLabel(e.date)} • {e.date} {e.time}
              </div>

              {editingId() === e.id ? (
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    cancelEdit();
                  }}
                  style={{
                    border: "1px solid #999",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    deleteAppEvent(e.id);
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#c00",
                    cursor: "pointer",
                    "font-size": "1.2em",
                    "line-height": "1",
                  }}
                  title="Delete event"
                >
                  ✕
                </button>
              )}
            </div>
            {/* Title */}
            <div
              style={{
                "margin-top": "0.4vh",
                "font-size": "1.1em",
                "font-weight": "500",
              }}
            >
              {e.title}
            </div>

            {/* Speaker */}
            {(e.speaker || e.speakerCode) && (
              <div
                style={{
                  "margin-top": "0.3vh",
                  color: "#666",
                  "font-size": "0.95em",
                }}
              >
                {e.speaker}
                {e.speaker && e.speakerCode ? " " : ""}
                {e.speakerCode && `[${e.speakerCode}]`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
