import { createSignal, createEffect, onCleanup, onMount } from "solid-js";

import type { Prayer } from "../prayers";
import { loadTodayPrayers } from "../services/takwim";

import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerRow from "../components/PrayerRow";
import DuhaRow from "../components/DuhaRow";
import SiteInfo from "../components/SiteInfo";
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

/* ===================== CONSTANTS ===================== */

const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14];

const POST_IQAMAH_DURATION = 15 * 1000; // 5s
const BLACKOUT_DURATION = 5 * 1000;    // 5s
const DEV = true;

/* ===================== COMPONENT ===================== */

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

  const [testNextPrayerTime, setTestNextPrayerTime] =
    createSignal<Date | null>(null);

  let testIQAMAHDuration: number | null = null;

  /* ===================== LOAD PRAYERS ===================== */

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

    const saved = localStorage.getItem("lastImageIndex");
    if (saved !== null) {
      setImageIndex(Number(saved));
    }
  });

  /* ===================== TIMER ENGINE ===================== */

  let timer: number;

  createEffect(() => {
    clearInterval(timer);

    timer = window.setInterval(() => {
      if (!prayers().length) return;

      const now = new Date();

      const isTomorrow =
        nextIndex() === 0 &&
        timeToDate(prayers()[0].time) <= now;

      const nextPrayerTime =
        testNextPrayerTime() ??
        timeToDate(prayers()[nextIndex()].time, isTomorrow ? 1 : 0);

      /* ---------- AZAN ---------- */
      if (phase() === "AZAN") {
        const diff = nextPrayerTime.getTime() - now.getTime();

        if (diff <= 0) {
          setPhase("IQAMAH");
          setIqamahEnd(null);
        } else {
          setCountdown(formatHMS(diff));
        }
      }

      /* ---------- IQAMAH ---------- */
      else if (phase() === "IQAMAH") {
        let end = iqamahEnd();

        if (!end) {
          end = new Date(
            now.getTime() +
            (testIQAMAHDuration ?? 15 * 60 * 1000)
          );
          setIqamahEnd(end);
        }

        if (now >= end) {
          setIqamahEnd(null);
          setPostIqamahEnd(null);
          setPhase("POST_IQAMAH");
        } else {
          setCountdown(formatHMS(end.getTime() - now.getTime()));
        }
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

        if (!end) {
          end = new Date(now.getTime() + BLACKOUT_DURATION);
          setBlackoutEnd(end);
        }

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

  /* ===================== RENDER ===================== */

  return (
    <div class="screen">
      {/* LEFT COLUMN */}
      <div class="left-column">
        {phase() === "AZAN" ? (
          <>
            <Clock />
            <DateInfo />
            {prayers().map((p, i) => (
              <PrayerRow prayer={p} active={i === nextIndex()} />
            ))}
            {duhaDate() && <DuhaRow date={duhaDate()!} />}
            {/* <SiteInfo /> */}
          </>
        ) : phase() === "BLACKOUT" ? (
          <div style={{ width: "100%", height: "100%", "background-color": "black" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <img
              src={images[imageIndex()]}
              style={{
                width: "100%",
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
        {phase() === "AZAN" ? (
          <RightPanel
            phase={phase()}
            countdown={countdown()}
            prayer={prayers()[nextIndex()]}
          />
        ) : phase() === "BLACKOUT" ? (
          <div style={{ width: "100%", height: "100%", "background-color": "black" }} />
        ) : (
          <RightPanel
            phase={phase()}
            countdown={countdown()}
            prayer={prayers()[nextIndex()]}
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
              testIQAMAHDuration = 7;
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
