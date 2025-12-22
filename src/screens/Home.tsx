import { onMount, For, Show } from "solid-js";
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

  onMount(async () => {
    const todayPrayers = await loadTodayPrayers();
    if (!todayPrayers) {
      console.warn("No prayers found for today");
      return;
    }
    timer.setPrayers(todayPrayers);
    timer.startTimer();
  });

  const duhaDate = () => {
    const syuruk = timer.prayers().find(p => p.en === "Syuruk");
    if (!syuruk) return null;
    return new Date(timeToDate(syuruk.time).getTime() + 20 * 60 * 1000);
  };

  return (
    <div class="screen">
      {/* LEFT COLUMN */}
      <div class="left-column">
        <Show when={timer.phase() === "AZAN"} fallback={
          timer.phase() === "BLACKOUT" ? (
            <div style={{ width: "100%", height: "100%", background: "black" }} />
          ) : (
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
          )
        }>
          <>
            <Clock />
            <DateInfo />
            <For each={timer.filteredPrayers()}>
              {p => <PrayerRow prayer={p} active={p === timer.nextPrayer()} />}
            </For>
            {duhaDate() && (
              <DuhaRow
                dateDuha={duhaDate()!}
                dateSyuruk={timeToDate(timer.prayers().find(p => p.en === "Syuruk")!.time)}
              />
            )}
          </>
        </Show>
      </div>

      {/* RIGHT COLUMN */}
      <Show when={timer.phase() !== "BLACKOUT"}>
        <div class="right-column">
          <RightPanel
            phase={timer.phase()}
            countdown={timer.countdown()}
            prayer={timer.nextPrayer()}
          />
        </div>
      </Show>

      {/* DEV PANEL */}
      <div
        style={{
          position: "fixed",
          bottom: "1vh",
          right: "1vw",
          padding: "0.5vw",
          background: "rgba(0,0,0,0.25)",
          color: "yellow",
          fontFamily: "monospace",
          fontSize: "0.95vh",
          zIndex: 10000,
          minWidth: "22vw",
          opacity: 0.7,
        }}
      >
        <div>PHASE: {timer.phase()}</div>
        <div>IQAMAH_DURATION {msToMinutes(IQAMAH_DURATION)} mins</div>
        <div>POST_IQAMAH_DURATION: {POST_IQAMAH_DURATION / 1000} secs</div>
        <div>BLACKOUT_DURATION: {msToMinutes(BLACKOUT_DURATION)} mins</div>
      </div>
    </div>
  );
}
