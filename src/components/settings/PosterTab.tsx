import type { PosterSettings } from "./types";

export default function PosterTab(props: {
  value: PosterSettings;
  onChange: (v: PosterSettings) => void;
}) {
  console.log(props.value);
  const update = (patch: Partial<PosterSettings>) => {
    props.onChange({
      ...props.value,
      ...patch,
    });
  };

  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update({ image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const toggleRow = (label: string, key: keyof PosterSettings) => (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "margin-bottom": "2vh",
      }}
    >
      <span style={{ "font-size": "2.8vh", "font-weight": "bold" }}>
        {label}
      </span>

      {/* Kiosk-friendly toggle */}
      <button
        onClick={() =>
          update({ [key]: !props.value[key] } as Partial<PosterSettings>)
        }
        style={{
          width: "10vh",
          height: "5vh",
          "font-size": "2vh",
          "font-weight": "bold",
          border: "none",
          cursor: "pointer",
          background: props.value[key] ? "darkgreen" : "#ccc",
          color: "white",
          "border-radius": "2vh",
        }}
      >
        {props.value[key] ? "ON" : "OFF"}
      </button>
    </div>
  );

  return (
    <div>
      <h2 style={{ "font-size": "3vh", "margin-bottom": "2vh" }}>
        Poster Settings
      </h2>

      {toggleRow("Enable Portrait Poster", "portraitEnabled")}
      {toggleRow("Enable Landscape Poster", "landscapeEnabled")}

      <div style={{ "margin-top": "3vh" }}>
        <h3 style={{ "font-size": "2.5vh" }}>Upload Poster</h3>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ "margin-top": "1vh", "font-size": "2vh" }}
        />
      </div>

      {props.value.image && (
        <img
          src={props.value.image}
          style={{
            width: "100%",
            "margin-top": "2vh",
            "border-radius": "1vh",
          }}
        />
      )}
    </div>
  );
}
