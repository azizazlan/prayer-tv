import { Match, Show, Switch } from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "./Clock";
import BlackoutPanel from "./BlackoutPanel";
import MediaPanel from "./MediaPanel";
import VerticalPrayersPanel from "./VerticalPrayersPanel";
import type { Prayer } from "../prayers";
import type { Phase } from "./RightPanel";
import styles from "./fade.module.css";
import type { DisplayMode } from "../screens/Home";
import type { AppEvent } from "../services/events";
import EventsPanel from "./EventsPanel";
import Hadiths from "./Hadiths";
import kaabahPhoto from "../assets/image_2.jpg";

const ACTIVATE_POSTER = import.meta.env.VITE_ACTIVATE_POSTER === "true";
const FORCE_BLACKOUT = false; // ← set true to test
const POSTER_PATH = import.meta.env.VITE_POSTER_PATH as string | "-";

interface LeftPanelProps {
  phase: Phase;
  now: () => Date;
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;
  lastPrayer: () => Prayer | undefined;
  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;
  images: string[];
  imageIndex: () => number;
  displayMode: DisplayMode;
  weeklyEvents: () => AppEvent[];
}

export default function LeftPanel(props: LeftPanelProps) {
  return (
    <div
      class="left-panel"
      style={{
        position: "relative", // 🔑 anchor for poster
        width: "50%",
        height: "100vh",
        overflow: "hidden",
        "flex-grow": 1,
      }}
    >
      <Switch>
        <Match when={FORCE_BLACKOUT || props.phase === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>

        <Match when={props.phase === "AZAN" || props.phase === "IQAMAH"}>
          <div style={{ width: "100%" }}>
            <Show when={props.displayMode !== "POSTER"}>
              <Clock now={props.now} />
            </Show>
            <div
              style={{
                position: "relative",
                width: "100%",
                "min-height": "50vh",
              }}
            >
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
                    <EventsPanel events={props.weeklyEvents()} />
                  </Match>

                  <Match when={props.displayMode === "PRAYERS"}>
                    <VerticalPrayersPanel
                      filteredPrayers={props.filteredPrayers}
                      nextPrayer={props.nextPrayer}
                      duhaDate={props.duhaDate}
                      syurukDate={props.syurukDate}
                    />
                  </Match>

                  <Match
                    when={ACTIVATE_POSTER && props.displayMode === "POSTER"}
                  >
                    <MediaPanel imageUrl={POSTER_PATH} />
                  </Match>
                </Switch>
              </Transition>
            </div>
          </div>
        </Match>
        <Match when={props.phase === "POST_IQAMAH"}>
          <MediaPanel imageUrl={kaabahPhoto} />
        </Match>
      </Switch>
    </div>
  );
}
