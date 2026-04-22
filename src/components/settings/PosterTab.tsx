import type { PosterSettings } from "./types";

export default function PosterTab(props: {
  value: PosterSettings;
  onChange: (v: PosterSettings) => void;
}) {
  const update = (patch: Partial<PosterSettings>) => {
    props.onChange({
      ...props.value,
      ...patch,
    });
  };

  const handlePortraitFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update({ imagePortrait: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLandscapeFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      update({ imageLandscape: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const toggleRow = (label: string, key: keyof PosterSettings) => (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
        "align-items": "center",
        "background-color": "white",
      }}
    >
      <span style={{ "font-size": "2.8vh", color: "black" }}>{label}</span>

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
    <div style={{ background: "white" }}>
      <div style={{ "margin-top": "0vh" }}>
        <div
          style={{
            display: "flex",
            "flex-direction": "row",
            "align-items": "center",
            "justify-content": "flex-start",
          }}
        >
          <div style={{ "font-size": "2.1vh", "margin-right": "1vh" }}>
            Potrait
          </div>
          {toggleRow("", "potraitEnabled")}

          <input
            type="file"
            accept="image/*"
            onChange={handlePortraitFile}
            style={{ "margin-top": "0vh", "font-size": "1.5vh" }}
          />

          {props.value.imagePortrait && (
            <img
              src={props.value.imagePortrait}
              style={{
                width: "auto",
                height: "21vh",
                border: "1pt solid black",
              }}
            />
          )}
        </div>
      </div>

      <div style={{ "margin-top": "1vh" }}>
        <div
          style={{
            display: "flex",
            "flex-direction": "row",
            "align-items": "center",
            "justify-content": "flex-start",
          }}
        >
          <div style={{ "font-size": "2.1vh", "margin-right": "0vh" }}>
            Landscape
          </div>
          {toggleRow("", "landscapeEnabled")}

          <input
            type="file"
            accept="image/*"
            onChange={handleLandscapeFile}
            style={{ "margin-top": "0vh", "font-size": "1.5vh" }}
          />

          {props.value.imageLandscape && (
            <img
              src={props.value.imageLandscape}
              style={{
                width: "auto",
                height: "21vh",
                border: "1pt solid black",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
