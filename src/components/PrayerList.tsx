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

export default function PrayerList(props: VerticalPrayersPanelProps) {
  return (
    <div class="flex flex-col bg-white h-full pb-5">
      {/* Prayer list (centered) */}
      <div class="flex-1 flex items-center justify-center">
        <div class="w-full">
          <For each={props.filteredPrayers()}>
            {(p) => (
              <PrayerRow
                prayer={p}
                active={p.time === props.nextPrayer()?.time}
              />
            )}
          </For>
        </div>
      </div>

      {/* Duha row stays at bottom */}
      <Show when={props.duhaDate()}>
        <DuhaRow dateDuha={props.duhaDate()!} dateSyuruk={props.syurukDate()} />
      </Show>
    </div>
  );
}
