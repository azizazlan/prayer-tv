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
import HijriDayCountdown from "./HijriDayCountdown";

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
  canShowWeeklyEvents: boolean;
}

export default function LeftPanel(props: LeftPanelProps) {
  const [showPoster, setShowPoster] = createSignal(false);

  createEffect(() => {
    if (!POSTER_PATH || !POSTER_EXPIRE) return;

    setShowPoster(true);
    const currentPrayer = props.lastPrayer();
    if (!currentPrayer) return;

    console.log("Current prayer:", currentPrayer.en);
    console.log("Poster expire at:", POSTER_EXPIRE);

    if (currentPrayer.en === POSTER_EXPIRE) {
      setShowPoster(false);
    }
  });

  return (
    <div class="left-column">
      <Switch>
        <Match when={FORCE_BLACKOUT || props.phase === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>

        <Match when={props.phase === "AZAN" || props.phase === "IQAMAH"}>
          <div style={{ width: "100%" }}>
            <Clock now={props.now} />
            <DateInfo now={props.now} showOneLine={false} />
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
                  <Match when={props.displayMode === "HIJRI_DAY_COUNTDOWN"}>
                    <HijriDayCountdown
                      targetDate={new Date("2026-02-17")}
                      label="Ramadhan"
                      celebrationText="Selamat Hari Raya Aidilfitri 🌙"
                    />
                  </Match>

                  <Match when={props.displayMode === "EVENTS"}>
                    <WeeklyEventsPanel events={props.weeklyEvents} />
                  </Match>

                  <Match when={props.displayMode === "COLLECTIONS"}>
                    <HijriDayCountdown
                      targetDate={new Date("2026-02-17")}
                      label="Ramadhan"
                      celebrationText="Selamat Hari Raya Aidilfitri 🌙"
                    />
                  </Match>

                  <Match
                    when={
                      props.displayMode === "PRAYERS" ||
                      !props.canShowWeeklyEvents
                    }
                  >
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

        {/* <Match when={props.phase === "IQAMAH" || props.phase === "POST_IQAMAH"}> */}
        <Match when={props.phase === "POST_IQAMAH"}>
          {showPoster() && POSTER_PATH ? (
            <MediaPanel imageUrl={POSTER_PATH} />
          ) : (
            <MediaPanel images={props.images} imageIndex={props.imageIndex} />
          )}
        </Match>
      </Switch>
    </div>
  );
}
