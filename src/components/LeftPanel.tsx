import { For, Match, Show, Switch, createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "./Clock";
import DateInfo from "./DateInfo";
import PrayerRow from "./PrayerRow";
import DuhaRow from "./DuhaRow";
import EventsPanel from "./EventsPanel";
import BlackoutPanel from "./BlackoutPanel";
import VerticalPrayersPanel from "./VerticalPrayersPanel";
import type { Prayer } from "../prayers";
import type { Phase } from "./RightPanel";
import type { Event } from "../event";
import styles from "./fade.module.css";
import SiteInfo from "./SiteInfo";
import type { DisplayMode } from "../screens/Home";

const FORCE_BLACKOUT = false; // ← set true to test

interface LeftPanelProps {
  phase: Phase;
  now: () => Date;
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;

  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;

  images: string[];
  imageIndex: () => number;

  displayMode: DisplayMode;
  todayEvents: Event[];

  canShowWeeklyEvents: boolean;
}

export default function LeftPanel(props: LeftPanelProps) {

  return (
    <div class="left-column">
      <Switch>
        <Match when={FORCE_BLACKOUT || props.phase === "BLACKOUT"}>
          <BlackoutPanel />
        </Match>

        <Match when={props.phase === "AZAN"}>
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
                  <Match when={props.displayMode === "EVENTS"}>
                    <EventsPanel events={props.todayEvents} />
                  </Match>

                  <Match when={props.displayMode === "PRAYERS" || !props.canShowWeeklyEvents}>
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

        <Match when={props.phase === "IQAMAH" || props.phase === "POST_IQAMAH"}>
          <MediaPanel
            images={props.images}
            imageIndex={props.imageIndex}
          />
        </Match>
      </Switch>
    </div>
  );
}
