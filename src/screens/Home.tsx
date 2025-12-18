import { createSignal, createEffect, onCleanup, onMount } from "solid-js";

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

import "../styles/home.css";

const images = [image1, image2];

// test override only
let testIQAMAHDuration: number | null = null;

export default function Home() {
  const [prayers, setPrayers] = createSignal<Prayer[]>([]);
  const [nextIndex, setNextIndex] = createSignal(0);
  const [phase, setPhase] = createSignal<Phase>("AZAN");
  const [countdown, setCountdown] = createSignal("00:00:00");
  const [duhaDate, setDuhaDate] = createSignal<Date | null>(null);
  const [imageIndex, setImageIndex] = createSignal(0);
  const [iqamahEnd, setIqamahEnd] = createSignal<Date | null>(null);
  const [testNextPrayerTime, setTestNextPrayerTime] =
    createSignal<Date | null>(null);
  const [postIqamahEnd, setPostIqamahEnd] =
    createSignal<Date | null>(null);

  /* -------------------- load prayers -------------------- */
  onMount(async () => {
    const today = await loadTodayPrayers();
    if (!today) return;

    setPrayers(today);

    const now = new Date();
    const idx = today.findIndex(p => timeToDate(p.time) > now);
    setNextIndex(idx >= 0 ? idx : 0);

    const syuruk = today.find(p => p.en === "Syuruk");
    if (syuruk) {
      const d = timeToDate(syuruk.time);
      setDuhaDate(new Date(d.getTime() + 20 * 60 * 1000));
    }

    const lastIndex = localStorage.getItem("lastImageIndex");
    if (lastIndex !== null) {
      setImageIndex(Number(lastIndex));
    }
  });

  /* -------------------- timer engine -------------------- */
  let timer: number;

  createEffect(() => {
    clearInterval(timer);

    timer = window.setInterval(() => {
      if (!prayers().length) return;

      const now = new Date();

      /* determine next prayer time */
      const isTomorrow =
        nextIndex() === 0 && timeToDate(prayers()[0].time) <= now;

      const nextPrayerTime =
        testNextPrayerTime() ??
        timeToDate(prayers()[nextIndex()].time, isTomorrow ? 1 : 0);

      /* ================= AZAN ================= */
      if (phase() === "AZAN") {
        const diff = nextPrayerTime.getTime() - now.getTime();
        if (diff <= 0) {
          setPhase("IQAMAH");
          setIqamahEnd(null);
        } else {
          setCountdown(formatHMS(diff));
        }
      }

      /* ================= IQAMAH ================= */
      else if (phase() === "IQAMAH") {
        let end = iqamahEnd();
        if (!end) {
          end = new Date(
            now.getTime() + (testIQAMAHDuration ?? 15 * 60) * 1000
          );
          setIqamahEnd(end);
        }

        const diff = end.getTime() - now.getTime();
        if (diff <= 0) {
          setPhase("POST_IQAMAH");
          setIqamahEnd(null);
          setPostIqamahEnd(null);
          testIQAMAHDuration = null;
        } else {
          setCountdown(formatHMS(diff));
        }
      }

      /* ================= POST IQAMAH ================= */
      else if (phase() === "POST_IQAMAH") {
        let end = postIqamahEnd();

        if (!end) {
          // switch image once at start
          setImageIndex(prev => {
            const next = prev === 0 ? 1 : 0;
            localStorage.setItem("lastImageIndex", String(next));
            return next;
          });

          end = new Date(now.getTime() + 15 * 1000); // 15 seconds
          setPostIqamahEnd(end);
        }

        const diff = end.getTime() - now.getTime();
        if (diff <= 0) {
          // reset POST_IQAMAH
          setPostIqamahEnd(null);
          setTestNextPrayerTime(null);
          testIQAMAHDuration = null;

          // return to AZAN
          setPhase("AZAN");
        }
      }
    }, 1000);
  });

  onCleanup(() => clearInterval(timer));

  /* -------------------- render -------------------- */
  return (
    <div class="screen">
      {/* LEFT COLUMN */}
      <div class="left-column">
        {phase() === "AZAN" ? (
          <>
            <Clock />
            <DateInfo />

            <div style={{ padding: "0vw 2vw", flex: 1 }}>
              {prayers().map((p, i) => (
                <PrayerRow prayer={p} active={i === nextIndex()} />
              ))}

              {duhaDate() && <DuhaRow date={duhaDate()!} />}

              {/* TEST BUTTON (DEV ONLY) */}
              <button
                style={{ marginTop: "1vh", fontSize: "2.5vh" }}
                onClick={() => {
                  const now = new Date();
                  setTestNextPrayerTime(new Date(now.getTime() + 10 * 1000));
                  testIQAMAHDuration = 7;
                  setPhase("AZAN");
                }}
              >
                Test Next Prayer
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              width: "125%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={images[imageIndex()]}
              style={{
                width: "130%",
                height: "100%",
                objectFit: "cover",
                animation: "kenburns 20s linear infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div class="right-column">
        <RightPanel
          phase={phase()}
          countdown={countdown()}
          prayer={prayers()[nextIndex()]}
        />
      </div>
    </div>
  );
}
