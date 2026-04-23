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
    const clamped = Math.max(5, Math.min(60, value)); // ✅ fixed

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
        "max-width": "550px",
      }}
    >
      <label style={{ color: "black", "font-size": "1.7vh" }}>{label}</label>
      <div style={{ display: "flex", "align-items": "center" }}>
        <button
          onClick={() => update(key, safeValues()[key] - 1)}
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            "justify-content": "center",
            border: "2pt solid black",
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
            width: "5vh",
            height: "2vh",
            "font-size": "2.1vh",
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
          }}
        >
          ✚
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "white" }}>
      <h2>Miscellaneous settings</h2>
      {row("Display mode secs", "displayModeSecs")}
    </div>
  );
}
