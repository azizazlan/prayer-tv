import type { IqamahSettings } from "./types";

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
        "justify-content": "space-between",
        "align-items": "center",
        "margin-bottom": "2vh",
      }}
    >
      <label style={{ "font-size": "3vh", "font-weight": "bold" }}>
        {label}
      </label>

      <div style={{ display: "flex", "align-items": "center" }}>
        <button
          onClick={() => update(key, safeValues()[key] - 1)}
          style={{
            width: "6vh",
            height: "6vh",
            "font-size": "3vh",
          }}
        >
          −
        </button>

        <input
          type="number"
          min="5"
          max="20"
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
            width: "6vh",
            height: "6vh",
            "font-size": "3vh",
          }}
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <>
      <h1 style={{ "margin-bottom": "1.5rem" }}>Iqamah Duration (mins)</h1>

      {row("ALFAJR", "alfajr")}
      {row("DHUHR", "dhuhr")}
      {row("ALASR", "alasr")}
      {row("MAGHRIB", "maghrib")}
      {row("ALISHA", "alisha")}
    </>
  );
}
