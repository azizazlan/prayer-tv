import type { MiscSettings } from "../../types/settings";

const DEFAULT_VALUES: MiscSettings = {
  displayModeSecs: 30,
};

export default function MiscTab(props: {
  values?: MiscSettings;
  onChange: (v: MiscSettings) => void;
}) {
  const safeValues = () => props.values ?? DEFAULT_VALUES;
  const update = (key: keyof MiscSettings, value: number) => {
    const clamped = Math.max(10, Math.min(60, value)); // ✅ fixed

    props.onChange({
      ...safeValues(),
      [key]: clamped,
    });
  };
  const row = (label: string, key: keyof MiscSettings) => (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "margin-bottom": "2vh",
      }}
    >
      <label
        style={{ color: "black", "font-size": "3vh", "font-weight": "bold" }}
      >
        {label}
      </label>

      <div style={{ display: "flex", "align-items": "center" }}>
        <button
          onClick={() => update(key, safeValues()[key] - 1)}
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            "justify-content": "center",
            border: "2pt solid black",
            width: "6vh",
            height: "6vh",
            "font-size": "3vh",
          }}
        >
          ▬
        </button>

        <input
          type="number"
          min="10"
          max="60"
          value={safeValues()[key]}
          onInput={(e) => update(key, Number(e.currentTarget.value))}
          style={{
            width: "10vh",
            height: "6vh",
            "font-size": "3vh",
            "text-align": "center",
            margin: "0 1vh",
          }}
        />

        <button
          onClick={() => update(key, safeValues()[key] + 1)}
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            "justify-content": "center",
            border: "2pt solid black",
            width: "6vh",
            height: "6vh",
            "font-size": "3vh",
          }}
        >
          ✚
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h2>Misc settings</h2>
      <p style={{ opacity: 0.7 }}>Miscellaneous settings</p>
      {row("Display mode (secs)", "displayModeSecs")}
    </div>
  );
}
