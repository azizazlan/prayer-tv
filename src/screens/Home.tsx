import { createSignal, createEffect, onCleanup, onMount, For, Show } from "solid-js";
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
import styles from './fade.module.css';

const images = [
  image1, image2, image3, image4, image5, image6, image7,
  image8, image9, image10, image11, image12, image13, image14
];

const IQAMAH_IMAGE_DURATION = 10 * 1000;
const POST_IQAMAH_DURATION = 15 * 1000;
const BLACKOUT_DURATION = 5 * 1000;
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

  const [testNextPrayerTime, setTestNextPrayerTime] = createSignal<Date | null>(null);

  let testIQAMAHDuration: number | null = null;

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

  let timer: number;

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
          end = new Date(now.getTime() + (testIQAMAHDuration ?? 15 * 60 * 1000));
          setIqamahEnd(end);
          setIqamahImageEnd(new Date(now.getTime() + IQAMAH_IMAGE_DURATION));
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
          setPostIqamahEnd(null);
          setPhase("POST_IQAMAH");
        } else setCountdown(formatHMS(end.getTime() - now.getTime()));
      }

      /* ---------- POST IQAMAH ---------- */
      else if (phase() === "POST_IQAMAH") {
        let end = postIqamahEnd();
        if (!end) {
          setImageIndex(prev => {
            const next = (prev + 1) % images.length;
            localStorage.setItem("lastImageIndex", String(next));
            return next;
          });
          end = new Date(now.getTime() + POST_IQAMAH_DURATION);
          setPostIqamahEnd(end);
        }

        if (now >= end) {
          setPostIqamahEnd(null);
          setBlackoutEnd(null);
          setPhase("BLACKOUT");
        }
      }

      /* ---------- BLACKOUT ---------- */
      else if (phase() === "BLACKOUT") {
        let end = blackoutEnd();
        if (!end) end = new Date(now.getTime() + BLACKOUT_DURATION);

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

            {/* Render all prayers except Syuruk */}
            {filteredPrayers().map(p => (
              <PrayerRow prayer={p} active={p === nextPrayer()} />
            ))}

            {/* DuhaRow with both Duha and Syuruk times */}
            {duhaDate() && (
              <DuhaRow
                dateDuha={duhaDate()!}
                dateSyuruk={
                  prayers().find(p => p.en === "Syuruk")
                    ? timeToDate(prayers().find(p => p.en === "Syuruk")!.time)
                    : new Date()
                }
              />
            )}
          </>
        ) : phase() === "BLACKOUT" ? (
          <div style={{ width: "100%", height: "100%", backgroundColor: "black" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
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
                        top: 0,
                        left: 0,
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
      <div class="right-column">
        {phase() === "AZAN" || phase() === "POST_IQAMAH" ? (
          <RightPanel
            phase={phase()}
            countdown={countdown()}
            prayer={nextPrayer()}
          />
        ) : phase() === "BLACKOUT" ? (
          <div style={{ width: "100%", height: "100%", backgroundColor: "black" }} />
        ) : (
          <RightPanel
            phase={phase()}
            countdown={countdown()}
            prayer={nextPrayer()}
          />
        )}
      </div>

      {/* DEV BUTTONS */}
      {DEV && (
        <div
          style={{
            position: "fixed",
            bottom: "2vh",
            left: "2vw",
            display: "flex",
            gap: "1vw",
            zIndex: 10000,
          }}
        >
          <button
            style={{ fontSize: "2.5vh" }}
            onClick={() => {
              setImageIndex(prev => {
                const next = (prev + 1) % images.length;
                localStorage.setItem("lastImageIndex", String(next));
                return next;
              });
            }}
          >
            Test Image Layout
          </button>

          <button
            style={{ fontSize: "2.5vh" }}
            onClick={() => {
              const now = new Date();
              setTestNextPrayerTime(new Date(now.getTime() + 5 * 1000));
              testIQAMAHDuration = 3 * 60 * 1000;
              setPhase("AZAN");
            }}
          >
            Test Next Prayer
          </button>
        </div>
      )}
    </div>
  );
}
