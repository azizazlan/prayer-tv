import { createEffect, createSignal } from "solid-js";
import type { Prayer } from "../prayers";
import PrayerHorizList from "./PrayerHorizList";
import { playAlarm } from "../App";

export default function IqamahPanel(props: {
  countdown: string;
  filteredPrayers?: () => Prayer[];
  lastPrayer?: () => Prayer | undefined;
}) {
  const [alarmPlayed, setAlarmPlayed] = createSignal(false);

  createEffect(() => {
    if (!alarmPlayed()) {
      playAlarm();
      setAlarmPlayed(true);
    }
  });

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

      <div
        style={{
          direction: "rtl",
          "font-size": "7.5vh",
          "font-weight": "bold",
        }}
      >
        الإقامة
      </div>
      <div style={{ "font-size": "7.5vh", "font-weight": "bold" }}>IQAMAH</div>

      <div class={`text-[15vh] font-bold`}>{props.countdown}</div>

      <div style={{ "flex-grow": 1 }} />

      <PrayerHorizList
        filteredPrayers={props.filteredPrayers}
        lastPrayer={props.lastPrayer}
      />
    </div>
  );
}
