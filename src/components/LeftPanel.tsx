import { For, Match, Show, Switch, createSignal, onMount, onCleanup } from "solid-js";
import { Transition } from "solid-transition-group";

import Clock from "./Clock";
import DateInfo from "./DateInfo";
import PrayerRow from "./PrayerRow";
import DuhaRow from "./DuhaRow";
import EventsPanel from "./EventsPanel";

import type { Prayer } from "../prayers";
import type { Phase } from "./RightPanel";

import { loadTodayEvents } from "../services/events";
import type { Event } from "../event";

import styles from "./fade.module.css";

type DisplayMode = "EVENTS" | "PRAYERS";


interface LeftPanelProps {
  phase: Phase;
  now: () => Date;
  filteredPrayers: () => Prayer[];
  nextPrayer: () => Prayer | undefined;

  duhaDate: () => Date | undefined;
  syurukDate: () => Date | undefined;

  images: string[];
  imageIndex: () => number;
}


export default function LeftPanel(props: LeftPanelProps) {
  const [mode, setMode] = createSignal<DisplayMode>("EVENTS");

  const [todayEvents, setTodayEvents] = createSignal<Event[]>([]);

  onMount(async () => {
    const events = await loadTodayEvents();
    setTodayEvents(events);
  });

  onMount(() => {
    const id = setInterval(() => {
      setMode(m => (m === "EVENTS" ? "PRAYERS" : "EVENTS"));
    }, 15000);

    onCleanup(() => clearInterval(id));
  });

  return (
    <div class="left-column">
      <Switch>
        {/* ================= AZAN ================= */}

        <Match when={props.phase === "AZAN"}>
          <div>
            <Clock now={props.now} />
            <DateInfo />
            <Transition
              enterActiveClass={styles["fade--active"]}
              exitActiveClass={styles["fade--active"]}
              enterClass={styles["opacity-0"]}
              enterToClass={styles["opacity-1"]}
              exitToClass={styles["opacity-0"]}
            >
              <Switch>
                {/* ================= EVENTS ================= */}
                <Match when={mode() === "EVENTS"}>
                  <EventsPanel events={todayEvents()} />
                </Match>

                {/* ============== PRAYERS + DUHA ============== */}
                <Match when={mode() === "PRAYERS"}>
                  <div>
                    <For each={props.filteredPrayers()}>
                      {p => (
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
                  </div>
                </Match>
              </Switch>
            </Transition>
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

        {/* ================= BLACKOUT ================= */}
        <Match when={props.phase === "BLACKOUT"}>
          <div style={{ width: "100%", height: "100%", background: "black" }} />
        </Match>
      </Switch>
    </div>
  );
}
