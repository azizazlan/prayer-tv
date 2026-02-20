import {
  For,
  Match,
  Show,
  Switch,
  createSignal,
  createEffect,
  onMount,
  onCleanup,
} from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "./Clock";
import DateInfo from "./DateInfo";
import PrayerRow from "./PrayerRow";
import DuhaRow from "./DuhaRow";
import BlackoutPanel from "./BlackoutPanel";
import MediaPanel from "./MediaPanel";
import VerticalPrayersPanel from "./VerticalPrayersPanel";
import type { Prayer } from "../prayers";
import type { Phase } from "./RightPanel";
import type { Event } from "../event";
import styles from "./fade.module.css";
import SiteInfo from "./SiteInfo";
import type { DisplayMode } from "../screens/Home";
import WeeklyEventsPanel from "./WeeklyEventsPanel";
import CollectionsPanel from "./CollectionsPanel";
import Hadiths from "./Hadiths";
import kaabahPhoto from "../assets/image_2.jpg";

const FORCE_BLACKOUT = false; // ← set true to test
const POSTER_PATH = import.meta.env.VITE_POSTER_PATH as string | undefined;
const POSTER_EXPIRE = import.meta.env.VITE_POSTER_EXPIRE as
  | "ALFAJR"
  | "DUHUR"
  | "ALASR"
  | "MAGHRIB"
  | "ALISHA"
  | undefined;

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

  weeklyEvents: Event[];
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
      }}
    >
      <Switch>
        <Match when={FORCE_BLACKOUT || props.phase === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>

        <Match
          when={
            (props.phase === "AZAN" || props.phase === "IQAMAH") &&
            props.phase !== "BLACKOUT"
          }
        >
          <div style={{ width: "100%" }}>
            <Show when={props.displayMode !== "POSTER"}>
              <Clock now={props.now} />
              <DateInfo now={props.now} showOneLine={false} />
            </Show>
            <div
              style={{
                position: "relative",
                width: "100%",
                minHeight: "50vh",
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
                    <WeeklyEventsPanel events={props.weeklyEvents} />
                  </Match>

                  <Match when={props.displayMode === "POSTER"}>
                    <MediaPanel imageUrl={POSTER_PATH} />
                  </Match>

                  <Match when={props.displayMode === "COLLECTIONS"}>
                    <CollectionsPanel />
                  </Match>

                  <Match when={props.displayMode === "PRAYERS"}>
                    <VerticalPrayersPanel
                      filteredPrayers={props.filteredPrayers}
                      nextPrayer={props.nextPrayer}
                      duhaDate={props.duhaDate}
                      syurukDate={props.syurukDate}
                    />
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
