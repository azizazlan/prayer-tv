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
import WeeklyEventsPanel from "./WeeklyEventsPanel";
import { loadWeeklyEvents } from "../services/events";
import type { Event } from "../event";
import styles from "./fade.module.css";
import SiteInfo from "./SiteInfo";

type DisplayMode = "EVENTS" | "WEEKLY_EVENTS" | "PRAYERS";

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
  const [weeklyEvents, setWeeklyEvents] = createSignal<Event[]>([]);


  onMount(async () => {
    const today = await loadTodayEvents();
    const weekly = await loadWeeklyEvents();

    setTodayEvents(today ?? []);
    setWeeklyEvents(weekly ?? []);
  });

  onMount(() => {
    const ORDER: DisplayMode[] = [
      "EVENTS",
      "WEEKLY_EVENTS",
      "PRAYERS",
    ];

    const id = setInterval(() => {
      setMode(current => {
        const available = ORDER.filter(m => {
          if (m === "EVENTS") return todayEvents().length > 0;
          if (m === "WEEKLY_EVENTS") return weeklyEvents().length > 0;
          return true; // PRAYERS always allowed
        });

        const idx = available.indexOf(current);
        return available[(idx + 1) % available.length];
      });
    }, 15000); // 15s per screen (TV-friendly)

    onCleanup(() => clearInterval(id));
  });


  return (
    <div class="left-column">
      <Switch>
        {/* ================= AZAN ================= */}
        <Match when={props.phase === "AZAN"}>
          <div style={{ width: "100%" }}>
            <Clock now={props.now} />
            <DateInfo now={props.now} />

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
                  <Match when={mode() === "EVENTS"}>
                    <div class="panel-layer">
                      <EventsPanel events={todayEvents()} />
                    </div>
                  </Match>

                  {/* ===== WEEKLY EVENTS ===== */}
                  <Match when={mode() === "WEEKLY_EVENTS"}>
                    <div class="panel-layer">
                      <WeeklyEventsPanel events={weeklyEvents()} />
                    </div>
                  </Match>

                  {/* ===== PRAYERS ===== */}
                  <Match when={mode() === "PRAYERS"}>
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
        {/* ================= BLACKOUT ================= */}
        <Match when={props.phase === "BLACKOUT"}>
          <div style={{ width: "100%", height: "100%", background: "black" }} />
        </Match>
      </Switch>
    </div>
  );
}
