import type { IqamahSettings } from "../../types/settings";

const DEFAULT_VALUES: IqamahSettings = {
  alfajr: 18,
  dhuhr: 10,
  alasr: 10,
  maghrib: 10,
  alisha: 10,
};

export default function IqamahTab(props: {
  values?: IqamahSettings;
  onChange: (v: IqamahSettings) => void;
}) {
  // ✅ SAFE fallback (prevents undefined crash)
  const safeValues = () => props.values ?? DEFAULT_VALUES;

  const update = (key: keyof IqamahSettings, value: number) => {
    const clamped = Math.max(5, Math.min(20, value));

    props.onChange({
      ...safeValues(),
      [key]: clamped,
    });
  };

  const row = (label: string, key: keyof IqamahSettings) => (
    <div
      style={{
        display: "flex",
        "align-items": "center",
        "max-width": "550px",
        "justify-content": "space-between",
        "margin-top": "1vh",
      }}
    >
      <label style={{ color: "black", "font-size": "1.5vh" }}>{label}</label>

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
          min="5"
          max="20"
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
      <div
        style={{
          "font-size": "1.5vh",
          "margin-bottom": "1.5rem",
          color: "black",
        }}
      >
        Duration in minutes
      </div>

      {row("ALFAJR", "alfajr")}
      {row("DHUHR", "dhuhr")}
      {row("ALASR", "alasr")}
      {row("MAGHRIB", "maghrib")}
      {row("ALISHA", "alisha")}
    </div>
  );
}
