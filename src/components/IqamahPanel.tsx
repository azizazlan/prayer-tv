import type { Prayer } from "../prayers";
import HorizontalPrayersPanel from "./HorizontalPrayersPanel";

export default function IqamahPanel(props: {
  countdown: string;
  filteredPrayers?: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
}) {
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
      <div style={{ "min-height": "21vh" }} />

      <div style={{ direction: "rtl", "font-size": "7.5vh", "font-weight": "bold" }}>
        الإقامة
      </div>
      <div style={{ "font-size": "7.5vh", "font-weight": "bold" }}>
        IQAMAH
      </div>

      <div class="countdown">{props.countdown}</div>

      <div style={{ "flex-grow": 1 }} />

      <HorizontalPrayersPanel
        filteredPrayers={props.filteredPrayers}
        nextPrayer={props.nextPrayer}
      />
    </div>
  );
}
