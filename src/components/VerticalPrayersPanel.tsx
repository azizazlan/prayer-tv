import { For, Show } from "solid-js";
import type { Prayer } from "../prayers";
import PrayerRow from "./PrayerRow";
import DuhaRow from "./DuhaRow";
import SiteInfo from "./SiteInfo";

interface VerticalPrayersPanelProps {
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;

  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
}

export default function VerticalPrayersPanel(
  props: VerticalPrayersPanelProps
) {
  return (
    <div class="panel-layer">
      <For each={props.filteredPrayers()}>
        {(p) => (
          <PrayerRow
            prayer={p}
            active={p.time === props.nextPrayer()?.time}
          />
        )}
      </For>

      <Show when={props.duhaDate()}>
        <DuhaRow
          dateDuha={props.duhaDate()!}
          dateSyuruk={props.syurukDate()}
        />
      </Show>

      <SiteInfo />
    </div>
  );
}
