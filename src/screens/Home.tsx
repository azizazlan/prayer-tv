import {
  createSignal,
  createEffect,
  onCleanup,
  onMount,
  For,
  Show,
} from "solid-js";
import { Transition } from "solid-transition-group";

import type { Prayer } from "../prayers";
import { loadTodayPrayers } from "../services/takwim";

import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerRow from "../components/PrayerRow";
import DuhaRow from "../components/DuhaRow";
import RightPanel, { type Phase } from "../components/RightPanel";

import { formatHMS, timeToDate } from "../utils/time";

import image1 from "../assets/image_1.jpg";
import image2 from "../assets/image_2.jpg";
import image3 from "../assets/image_3.jpg";
import image4 from "../assets/image_4.jpg";
import image5 from "../assets/image_5.jpg";
import image6 from "../assets/image_6.jpg";
import image7 from "../assets/image_7.jpg";
import image8 from "../assets/image_8.jpg";
import image9 from "../assets/image_9.jpg";
import image10 from "../assets/image_10.jpg";
import image11 from "../assets/image_11.jpg";
import image12 from "../assets/image_12.jpg";
import image13 from "../assets/image_13.jpg";
import image14 from "../assets/image_14.jpg";

import "../styles/home.css";
import styles from "./fade.module.css";

const images = [
  image1, image2, image3, image4, image5, image6, image7,
  image8, image9, image10, image11, image12, image13, image14,
];

const TEST_IQAMAH_DURATION = 30 * 1000; // 30 secs
const IQAMAH_DURATION = 15 * 60 * 1000;
const IQAMAH_IMAGE_DURATION = 10 * 1000;
const POST_IQAMAH_DURATION = 15 * 1000;
const BLACKOUT_DURATION = 10 * 60 * 1000; // 10 mins

const msToMinutes = (ms: number) => (ms / 60000).toFixed(1);
const msToSeconds = (ms: number) => Math.round(ms / 1000);

const DEV = true;

export default function Home() {
  const [prayers, setPrayers] = createSignal<Prayer[]>([]);
  const [nextIndex, setNextIndex] = createSignal(0);

  const [phase, setPhase] = createSignal<Phase>("AZAN");
  const [countdown, setCountdown] = createSignal("00:00:00");

  const [duhaDate, setDuhaDate] = createSignal<Date | null>(null);
  const [imageIndex, setImageIndex] = createSignal(0);

  const [iqamahEnd, setIqamahEnd] = createSignal<Date | null>(null);
  const [postIqamahEnd, setPostIqamahEnd] = createSignal<Date | null>(null);
  const [blackoutEnd, setBlackoutEnd] = createSignal<Date | null>(null);
  const [iqamahImageEnd, setIqamahImageEnd] = createSignal<Date | null>(null);

  const [testNextPrayerTime, setTestNextPrayerTime] =
    createSignal<Date | null>(null);

  // DEV countdown display
  const [devPhaseRemaining, setDevPhaseRemaining] = createSignal("—");
  const [devImageRemaining, setDevImageRemaining] = createSignal("—");

  let testIQAMAHDuration: number | null = null;
  let timer: number;

  const resetFlow = () => {
    // Clear test overrides
    testIQAMAHDuration = null;
    setTestNextPrayerTime(null);

    // Clear all phase timers
    setIqamahEnd(null);
    setPostIqamahEnd(null);
    setBlackoutEnd(null);
    setIqamahImageEnd(null);

    // Reset displays
    setCountdown("00:00:00");
    setDevPhaseRemaining("—");
    setDevImageRemaining("—");

    // Go back to idle AZAN
    setPhase("AZAN");
  };

  const filteredPrayers = () => prayers().filter(p => p.en !== "Syuruk");

  const nextPrayer = () => {
    const now = new Date();
    const fp = filteredPrayers();
    return fp.find(p => timeToDate(p.time) > now) ?? fp[0];
  };

  onMount(async () => {
    const today = await loadTodayPrayers();
    if (!today) return;

    setPrayers(today);

    const now = new Date();
    const fp = today.filter(p => p.en !== "Syuruk");
    const idx = fp.findIndex(p => timeToDate(p.time) > now);
    setNextIndex(idx >= 0 ? idx : 0);

    const syuruk = today.find(p => p.en === "Syuruk");
    if (syuruk) {
      const d = timeToDate(syuruk.time);
      setDuhaDate(new Date(d.getTime() + 20 * 60 * 1000));
    }

    const saved = localStorage.getItem("lastImageIndex");
    if (saved !== null) setImageIndex(Number(saved));
  });

  createEffect(() => {
    clearInterval(timer);

    timer = window.setInterval(() => {
      if (!prayers().length) return;

      const now = new Date();
      const fp = filteredPrayers();
      const isTomorrow = nextIndex() === 0 && timeToDate(fp[0].time) <= now;

      const nextPrayerTime =
        testNextPrayerTime() ??
        timeToDate(fp[nextIndex()].time, isTomorrow ? 1 : 0);

      /* ---------- AZAN ---------- */
      if (phase() === "AZAN") {
        const diff = nextPrayerTime.getTime() - now.getTime();
        setDevPhaseRemaining(formatHMS(diff));
        if (diff <= 0) {
          setPhase("IQAMAH");
          setIqamahEnd(null);
        } else setCountdown(formatHMS(diff));
      }

      /* ---------- IQAMAH ---------- */
      else if (phase() === "IQAMAH") {
        let end = iqamahEnd();
        let imgEnd = iqamahImageEnd();

        if (!end) {
          end = new Date(now.getTime() + (testIQAMAHDuration ?? IQAMAH_DURATION));
          setIqamahEnd(end);
          setIqamahImageEnd(new Date(now.getTime() + IQAMAH_IMAGE_DURATION));
        }

        setDevPhaseRemaining(formatHMS(end.getTime() - now.getTime()));

        if (imgEnd) {
          setDevImageRemaining(formatHMS(imgEnd.getTime() - now.getTime()));
        }

        if (imgEnd && now >= imgEnd) {
          setImageIndex(prev => {
            const next = (prev + 1) % images.length;
            localStorage.setItem("lastImageIndex", String(next));
            return next;
          });
          setIqamahImageEnd(new Date(now.getTime() + IQAMAH_IMAGE_DURATION));
        }

        if (now >= end) {
          setIqamahEnd(null);
          setIqamahImageEnd(null);
          setPhase("POST_IQAMAH");
        } else setCountdown(formatHMS(end.getTime() - now.getTime()));
      }

      /* ---------- POST IQAMAH ---------- */
      else if (phase() === "POST_IQAMAH") {
        let end = postIqamahEnd();
        if (!end) {
          end = new Date(now.getTime() + POST_IQAMAH_DURATION);
          setPostIqamahEnd(end);
        }

        setDevPhaseRemaining(formatHMS(end.getTime() - now.getTime()));

        if (now >= end) {
          setPostIqamahEnd(null);
          setPhase("BLACKOUT");
        }
      }

      /* ---------- BLACKOUT ---------- */
      else if (phase() === "BLACKOUT") {
        let end = blackoutEnd();
        if (!end) {
          end = new Date(now.getTime() + BLACKOUT_DURATION);
          setBlackoutEnd(end);
        }

        setDevPhaseRemaining(formatHMS(end.getTime() - now.getTime()));

        if (now >= end) {
          setBlackoutEnd(null);
          setTestNextPrayerTime(null);
          testIQAMAHDuration = null;
          setPhase("AZAN");
        }
      }
    }, 1000);
  });

  onCleanup(() => clearInterval(timer));

  return (
    <div class="screen">
      {/* LEFT COLUMN */}
      <div class="left-column">
        {phase() === "AZAN" ? (
          <>
            <Clock />
            <DateInfo />
            {filteredPrayers().map(p => (
              <PrayerRow prayer={p} active={p === nextPrayer()} />
            ))}
            {duhaDate() && (
              <DuhaRow
                dateDuha={duhaDate()!}
                dateSyuruk={timeToDate(
                  prayers().find(p => p.en === "Syuruk")!.time
                )}
              />
            )}
          </>
        ) : phase() === "BLACKOUT" ? (
          <div style={{ width: "100%", height: "100%", "background-color": "black" }} />
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
                  <Show when={idx() === imageIndex()}>
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
        )}
      </div>

      {/* RIGHT COLUMN */}
      {phase() !== "BLACKOUT" ? (
        <div class="right-column">
          <RightPanel
            phase={phase()}
            countdown={countdown()}
            prayer={nextPrayer()}
          />
        </div>
      ) :
        <div style={{ width: "100%", height: "100%", "background-color": "black" }} />
      }

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
          zIndex: 10000,
          minWidth: "22vw",
          "opacity": "0.7",
        }}
      >
        <div><strong>DEV PANEL</strong></div>
        <div>PHASE: {phase()}</div>
        <div>Remaining: {devPhaseRemaining()}</div>
        <div><strong>CONFIG</strong></div>
        <div>IQAMAH: {msToMinutes(IQAMAH_DURATION)} min</div>
        <div>POST IQAMAH: {msToSeconds(POST_IQAMAH_DURATION)} sec</div>
        <div>BLACKOUT: {msToSeconds(BLACKOUT_DURATION)} sec</div>
        <div>IMAGE ROTATE: {msToSeconds(IQAMAH_IMAGE_DURATION)} sec</div>
        <div>TEST IQAMAH: {msToSeconds(TEST_IQAMAH_DURATION)} sec</div>

        <div style={{ "margin-top": "0.5vw", display: "flex", gap: "0.5vw", flexWrap: "wrap" }}>
          <button
            style={{ "opacity": "0.5" }}
            onClick={() => {
              setImageIndex(i => (i + 1) % images.length);
            }}
          >
            Rotate Image
          </button>
          <button
            style={{ "opacity": "0.5" }}
            onClick={() => {
              const now = new Date();
              setTestNextPrayerTime(new Date(now.getTime() + 5_000));
              testIQAMAHDuration = TEST_IQAMAH_DURATION;
              setPhase("AZAN");
            }}
          >
            Test
          </button>
          <button
            style={{ opacity: 0.5 }}
            onClick={resetFlow}
          >
            Clear
          </button>
        </div>
      </div>
    </div >
  );
}
