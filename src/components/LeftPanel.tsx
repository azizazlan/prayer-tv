import { Match, Show, Switch, createMemo } from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "./Clock";
import BlackoutPanel from "./BlackoutPanel";
import MediaPanel from "./MediaPanel";
import VerticalPrayersPanel from "./VerticalPrayersPanel";
import type { Prayer } from "../prayers";
import type { Phase } from "./RightPanel";
import styles from "./fade.module.css";
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
    <div class="left-column">
      <Switch>
        <Match when={props.phase === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>

        <Match when={props.phase === "AZAN" || props.phase === "IQAMAH"}>
          <div>
            <Show when={props.displayMode !== "POSTER"}>
              <Clock now={props.now} />
            </Show>
            <div>
              <Transition
                enterActiveClass={styles["fade--active"]}
                exitActiveClass={styles["fade--active"]}
                enterClass={styles["opacity-0"]}
                enterToClass={styles["opacity-1"]}
                exitToClass={styles["opacity-0"]}
              >
                <Switch>
                  <Match when={props.displayMode === "HADITHS"}>
                    <Hadiths />
                  </Match>

                  <Match when={props.displayMode === "EVENTS"}>
                    <EventsPanel />
                  </Match>

                  <Match
                    when={
                      props.displayMode === "PRAYERS" ||
                      props.displayMode === "LANDSCAPE_POSTER"
                    }
                  >
                    <VerticalPrayersPanel
                      filteredPrayers={props.filteredPrayers}
                      nextPrayer={props.nextPrayer}
                      duhaDate={props.duhaDate}
                      syurukDate={props.syurukDate}
                    />
                  </Match>

                  <Match when={props.displayMode === "POSTER"}>
                    <MediaPanel imageUrl={imgPortrait()} isLeftPoster={true} />
                  </Match>
                </Switch>
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
