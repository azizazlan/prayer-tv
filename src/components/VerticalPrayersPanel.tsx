import { For, Show } from "solid-js";
import type { Prayer } from "../prayers";
import PrayerRow from "./PrayerRow";
import DuhaRow from "./DuhaRow";

interface VerticalPrayersPanelProps {
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;

  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
}

export default function VerticalPrayersPanel(props: VerticalPrayersPanelProps) {
  return (
    <div style={{ display: "flex", "flex-direction": "column" }}>
      <div
        style={{
          border: "0pt solid blue",
          "padding-top": "1.5rem",
          "padding-bottom": "1.5rem",
        }}
      >
        <For each={props.filteredPrayers()}>
          {(p) => (
            <PrayerRow
              prayer={p}
              active={p.time === props.nextPrayer()?.time}
            />
          )}
        </For>
      </div>

      <hr
        style={{
          "background-color": "darkgreen",
          "min-height": "0.03rem",
        }}
      />

      <Show when={props.duhaDate()}>
        <DuhaRow dateDuha={props.duhaDate()!} dateSyuruk={props.syurukDate()} />
      </Show>
    </div>
  );
}
