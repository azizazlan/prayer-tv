import { Match, Show, Switch, createMemo } from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "./Clock";
import BlackoutPanel from "./BlackoutPanel";
import MediaPanel from "./MediaPanel";
import PrayerList from "./PrayerList";
import type { Prayer } from "../prayers";
import type { Phase } from "./RightPanel";
import type { DisplayMode } from "../screens/Home";
import EventsPanel from "./EventsPanel";
import Hadiths from "./Hadiths";
import kaabahPhoto from "../assets/image_2.jpg";
import { useSettings } from "../services/settings";

interface LeftPanelProps {
  phase: Phase;
  now: () => Date;
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
  lastPrayer: () => Prayer | undefined;
  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
  displayMode: DisplayMode;
}

export default function LeftPanel(props: LeftPanelProps) {
  const settings = useSettings;

  const imgPortraitPath = () => {
    const s = settings();
    return s.poster?.imagePortrait ?? "";
  };

  const imgPortrait = createMemo(() => imgPortraitPath());

  return (
    <div class="left-column w-full h-full flex flex-col overflow-hidden">
      <Switch>
        <Match when={props.phase === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>

        <Match when={props.phase === "AZAN" || props.phase === "IQAMAH"}>
          <div class="flex flex-col w-full h-full overflow-hidden">
            {/* Clock */}
            <Show when={props.displayMode !== "POSTER"}>
              <Clock now={props.now} />
            </Show>

            {/* CONTENT AREA (IMPORTANT FIX) */}
            <div class="flex-1 min-h-0 overflow-hidden relative">
              <Transition
                enterActiveClass="transition-opacity duration-300"
                exitActiveClass="transition-opacity duration-300"
                enterClass="opacity-0"
                enterToClass="opacity-100"
                exitToClass="opacity-0"
              >
                <div class="w-full h-full min-h-0 overflow-hidden">
                  <Switch>
                    <Match when={props.displayMode === "HADITHS"}>
                      <Hadiths />
                    </Match>

                    <Match when={props.displayMode === "EVENTS"}>
                      {/* IMPORTANT: isolate scroll here */}
                      <div class="h-full overflow-hidden">
                        <EventsPanel />
                      </div>
                    </Match>

                    <Match
                      when={
                        props.displayMode === "PRAYERS" ||
                        props.displayMode === "LANDSCAPE_POSTER"
                      }
                    >
                      <div class="h-full overflow-hidden">
                        <PrayerList
                          filteredPrayers={props.filteredPrayers}
                          nextPrayer={props.nextPrayer}
                          duhaDate={props.duhaDate}
                          syurukDate={props.syurukDate}
                        />
                      </div>
                    </Match>

                    <Match when={props.displayMode === "POSTER"}>
                      <MediaPanel
                        imageUrl={imgPortrait()}
                        isLeftPoster={true}
                      />
                    </Match>
                  </Switch>
                </div>
              </Transition>
            </div>
          </div>
        </Match>

        <Match when={props.phase === "POST_IQAMAH"}>
          <MediaPanel imageUrl={kaabahPhoto} isLeftPoster={true} />
        </Match>
      </Switch>
    </div>
  );
}
