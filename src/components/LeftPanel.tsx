import { For, Match, Show, Switch, createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "./Clock";
import DateInfo from "./DateInfo";
import PrayerRow from "./PrayerRow";
import DuhaRow from "./DuhaRow";
import EventsPanel from "./EventsPanel";
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
        {/* ================= BLACKOUT ================= */}
        <Match when={FORCE_BLACKOUT || props.phase === "BLACKOUT"}>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgb(2, 2, 2)", // NOT pure black
              position: "relative",
            }}
          >
            {/* anti-sleep blinking dot */}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                width: "0.5vh",
                height: "0.5vh",
                "border-radius": "50%",
                background: "orange",
                animation: "blink 2s infinite",
              }}
            />
          </div>
        </Match>

        {/* ================= AZAN ================= */}
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
                  {/* ===== TODAY EVENTS ===== */}
                  <Match when={props.displayMode === "EVENTS"}>
                    <div class="panel-layer">
                      <EventsPanel events={props.todayEvents} />
                    </div>
                  </Match>

                  {/* ===== PRAYERS ===== */}
                  <Match when={props.displayMode === "PRAYERS" || !props.canShowWeeklyEvents}>
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
                  </Match>
                </Switch>
              </Transition>
            </div>
          </div>
        </Match>

        {/* ============== IQAMAH / POST ================= */}
        <Match
          when={
            props.phase === "IQAMAH" ||
            props.phase === "POST_IQAMAH"
          }
        >
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <For each={props.images}>
              {(img, idx) => (
                <Transition
                  enterActiveClass={styles["fade--active"]}
                  exitActiveClass={styles["fade--active"]}
                  enterClass={styles["opacity-0"]}
                  enterToClass={styles["opacity-1"]}
                  exitToClass={styles["opacity-0"]}
                >
                  <Show when={idx() === props.imageIndex()}>
                    <img
                      src={img}
                      style={{
                        width: "100%",
                        height: "110%",
                        "object-fit": "cover",
                        position: "absolute",
                      }}
                    />
                  </Show>
                </Transition>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
