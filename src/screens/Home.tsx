import { onMount, For, Show, Switch, Match, createMemo, createEffect } from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerRow from "../components/PrayerRow";
import DuhaRow from "../components/DuhaRow";
import RightPanel from "../components/RightPanel";
import images from "../assets/images";
import {
  useTimer,
  IQAMAH_DURATION,
  POST_IQAMAH_DURATION,
  BLACKOUT_DURATION
} from "../services/timer";
import { loadTodayPrayers } from "../services/takwim";
import { timeToDate, msToMinutes } from "../utils/time";

import "../styles/home.css";
import styles from "./fade.module.css";

export default function Home() {
  const timer = useTimer();

  // Load today's prayers and start timer
  onMount(async () => {
    const todayPrayers = await loadTodayPrayers();
    if (!todayPrayers) {
      console.warn("No prayers found for today");
      return;
    }
    timer.setPrayers(todayPrayers);
    timer.startTimer();
  });

  // Memoized Syuruk prayer
  const syurukPrayer = createMemo(() =>
    timer.prayers().find(p => p.en === "Syuruk")
  );

  // Duha date (20 min after Syuruk)
  const duhaDate = createMemo(() => {
    const syuruk = syurukPrayer();
    if (!syuruk) return null;
    return new Date(timeToDate(syuruk.time).getTime() + 20 * 60 * 1000);
  });

  // Next prayer memo
  const nextPrayer = createMemo(() => timer.nextPrayer());

  return (
    <div class="screen">
      <div class="left-column">
        <Switch>
          <Match when={timer.phase() === "AZAN"}>
            <>
              <Clock now={timer.now} />
              <DateInfo />

              <For each={timer.filteredPrayers()}>
                {p => (
                  <PrayerRow
                    prayer={p}
                    active={p.time === nextPrayer()?.time}
                  />
                )}
              </For>

              <Show when={duhaDate()}>
                <DuhaRow
                  dateDuha={duhaDate()!}
                  dateSyuruk={
                    syurukPrayer()
                      ? timeToDate(syurukPrayer()!.time)
                      : undefined
                  }
                />
              </Show>
            </>
          </Match>

          <Match when={timer.phase() === "IQAMAH" || timer.phase() === "POST_IQAMAH"}>
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <For each={images}>
                {(img, idx) => (
                  <Transition
                    enterActiveClass={styles["fade--active"]}
                    exitActiveClass={styles["fade--active"]}
                    enterClass={styles["opacity-0"]}
                    enterToClass={styles["opacity-1"]}
                    exitToClass={styles["opacity-0"]}
                  >
                    <Show when={idx() === timer.imageIndex()}>
                      <img
                        src={img}
                        style={{
                          width: "100%",
                          height: "110%",
                          objectFit: "cover",
                          position: "absolute",
                        }}
                      />
                    </Show>
                  </Transition>
                )}
              </For>
            </div>
          </Match>

          <Match when={timer.phase() === "BLACKOUT"}>
            <div style={{ width: "100%", height: "100%", background: "black" }} />
          </Match>

        </Switch>
      </div>

      {/* RIGHT COLUMN */}
      <div class="right-column">
        <RightPanel
          phase={timer.phase()}
          countdown={timer.countdown()}
          prayer={nextPrayer()} />

        {/* DEV PANEL */}
        {/* DEV PANEL */}
        <div
          style={{
            position: "fixed",
            bottom: "1vh",
            right: "1vw",
            padding: "0.5vw",
            background: "rgba(0,0,0,0.25)",
            color: "yellow",
            "font-family": "monospace",
            "font-size": "0.95vh",
            "z-index": 10000,
            "min-width": "10vw",
            opacity: 0.8,
          }}
        >
          <div
            style={{
              display: "grid",
              "grid-template-columns": "max-content max-content",
              "row-gap": "0.3vh",
              "column-gap": "1vw",
            }}
          >
            <div>PHASE</div>
            <div style={{ "font-weight": "bold" }}>{timer.phase()}</div>

            <div>IQAMAH</div>
            <div>{msToMinutes(IQAMAH_DURATION)} mins</div>

            <div>POST IQAMAH</div>
            <div>{POST_IQAMAH_DURATION / 1000} secs</div>

            <div>BLACKOUT</div>
            <div>{msToMinutes(BLACKOUT_DURATION)} mins</div>
          </div>
        </div>



      </div>
    </div>
  );
}
