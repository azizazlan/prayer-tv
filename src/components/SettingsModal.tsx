import { createSignal, createEffect } from "solid-js";

export type IqamahSettings = {
  alfajr: number;
  dhuhr: number;
  alasr: number;
  maghrib: number;
  alisha: number;
};

type Props = {
  open: boolean;
  initialValues?: IqamahSettings;
  onClose: () => void;
  onSave: (values: IqamahSettings) => void;
};

export default function SettingsModal(props: Props) {
  const [values, setValues] = createSignal<IqamahSettings>({
    alfajr: 18,
    dhuhr: 10,
    alasr: 10,
    maghrib: 10,
    alisha: 10,
  });

  createEffect(() => {
    if (props.open && props.initialValues) {
      setValues(props.initialValues);
    }
  });

  const update = (key: keyof IqamahSettings, value: number) => {
    const clamped = Math.max(5, Math.min(20, value));
    setValues((prev) => ({ ...prev, [key]: clamped }));
  };

  const handleSave = () => {
    props.onSave(values());
    props.onClose();
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
      <label
        style={{
          "font-size": "3vh",
          "font-weight": "bold",
        }}
      >
        {label}
      </label>

      <div
        style={{
          display: "flex",
          "align-items": "center",
        }}
      >
        {/* Minus button */}
        <button
          onClick={() => update(key, values()[key] - 1)}
          style={{
            width: "6vh",
            height: "6vh",
            "font-size": "3vh",
            "margin-right": "1vh",
          }}
        >
          −
        </button>

        {/* Big input */}
        <input
          type="number"
          min="5"
          max="20"
          value={values()[key]}
          onInput={(e) => update(key, Number(e.currentTarget.value))}
          style={{
            width: "10vh",
            height: "6vh",
            "font-size": "3vh",
            "text-align": "center",
          }}
        />

        {/* Plus button */}
        <button
          onClick={() => update(key, values()[key] + 1)}
          style={{
            width: "6vh",
            height: "6vh",
            "font-size": "3vh",
            "margin-left": "1vh",
          }}
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        "z-index": "100",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          "border-radius": "12px",
          width: "975px",
          "max-width": "90vw",
        }}
      >
        <h1 style={{ "margin-bottom": "1.5rem" }}>
          Iqamah duration in minutes
        </h1>

        {row("ALFAJR", "alfajr")}
        {row("DHUHR", "dhuhr")}
        {row("ALASR", "alasr")}
        {row("MAGHRIB", "maghrib")}
        {row("ALISHA", "alisha")}

        <div
          style={{
            display: "flex",
            "justify-content": "flex-end",
            gap: "10px",
            "margin-top": "1.5rem",
          }}
        >
          <button
            style={{
              width: "12vh",
              height: "6vh",
              "font-size": "1.7vh",
              border: "1pt solid grey",
            }}
            onClick={props.onClose}
          >
            Cancel
          </button>
          <button
            style={{
              width: "12vh",
              height: "6vh",
              background: "darkgreen",
              color: "white",
              "font-size": "1.7vh",
            }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
