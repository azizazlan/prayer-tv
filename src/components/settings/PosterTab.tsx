import type { PosterSettings } from "../../types/settings";

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
      <span style={{ "font-size": "1vh", color: "black" }}>{label}</span>

      {/* Kiosk-friendly toggle */}
      <button
        onClick={() =>
          update({ [key]: !props.value[key] } as Partial<PosterSettings>)
        }
        style={{
          width: "2.5vh",
          height: "1.5vh",
          border: "none",
          cursor: "pointer",
          background: props.value[key] ? "darkgreen" : "#ccc",
          color: "white",
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
          <div style={{ "font-size": "1vh", "margin-right": "1.7vh" }}>
            Potrait
          </div>
          {toggleRow("", "portraitEnabled")}

          <input
            type="file"
            accept="image/*"
            onChange={handlePortraitFile}
            style={{ "margin-top": "0vh", "font-size": "1vh" }}
          />

          {props.value.imagePortrait && (
            <img
              src={props.value.imagePortrait}
              style={{
                width: "auto",
                height: "12vh",
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
          <div style={{ "font-size": "1vh", "margin-right": "0vh" }}>
            Landscape
          </div>
          {toggleRow("", "landscapeEnabled")}

          <input
            type="file"
            accept="image/*"
            onChange={handleLandscapeFile}
            style={{ "margin-top": "0vh", "font-size": "1vh" }}
          />

          {props.value.imageLandscape && (
            <img
              src={props.value.imageLandscape}
              style={{
                width: "auto",
                height: "12vh",
                border: "1pt solid black",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
