import type { Prayer } from "../prayers";
import HorizontalPrayersPanel from "./HorizontalPrayersPanel";

export default function AzanPanel(props: {
  prayer?: Prayer;
  countdown: string;
  filteredPrayers?: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
}) {
  const isUrgent = () => {
    if (!props.countdown) return false;
    const [h, m, s] = props.countdown.split(":").map(Number);
    return h * 3600 + m * 60 + s <= 180;
  };

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        width: "100%",
        height: "100%",
        "justify-content": "flex-start",
        "align-items": "center",
      }}
    >
      {props.prayer?.en === "Syuruk" ? (
        <>
          <div
            style={{
              "font-size": "5vh",
              "font-weight": "700",
              color: "lightgreen",
            }}
          >
            Syuruk
          </div>
          <div class="countdown">{props.countdown}</div>
        </>
      ) : (
        <>
          <div style={{ "min-height": "21vh" }} />

          <div
            style={{
              direction: "rtl",
              "font-size": "7.5vh",
              "font-weight": "bold",
            }}
          >
            الأذان القادم {props.prayer?.ar}
          </div>

          <div style={{ "font-size": "7.5vh", "font-weight": "bold" }}>
            AZAN {props.prayer?.en}
          </div>

          <div
            class="countdown"
            classList={{ "countdown--urgent": isUrgent() }}
            style={{ "font-weight": "bold" }}
          >
            {props.countdown}
          </div>

          <div style={{ "flex-grow": 1 }} />

          <HorizontalPrayersPanel
            filteredPrayers={props.filteredPrayers}
            nextPrayer={props.nextPrayer}
          />
        </>
      )}
    </div>
  );
}
