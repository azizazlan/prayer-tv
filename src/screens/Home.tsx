import { createSignal, createEffect, onCleanup, onMount } from "solid-js";

import type { Prayer } from "../prayers";
import { loadTodayPrayers } from "../services/takwim";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";

import image1 from "../assets/image_1.jpg";
import image2 from "../assets/image_2.jpg";
import image3 from "../assets/image_3.jpg";
import image4 from "../assets/image_4.jpg";
import image5 from "../assets/image_5.jpg";
import image6 from "../assets/image_6.jpg";

import "../styles/home.css";

type Phase = "AZAN" | "IQAMAH" | "POST_IQAMAH";

const images = [image1, image2, image3, image4, image5, image6];

// test override
let testIQAMAHDuration: number | null = null;

/* -------------------- helpers -------------------- */

const padZero = (n: number) => n.toString().padStart(2, "0");

function formatHMS(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${padZero(h)}:${padZero(m)}:${padZero(s)}`;
}

function timeToDate(time: string, dayOffset = 0) {
  const lower = time.toLowerCase().trim();
  let hours = 0;
  let minutes = 0;

  if (lower.includes("am") || lower.includes("pm")) {
    const [raw, meridiem] = lower.split(" ");
    const [h, m] = raw.split(":").map(Number);
    hours = h;
    minutes = m;
    if (meridiem === "pm" && hours !== 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
  } else {
    const [h, m] = lower.split(":").map(Number);
    hours = h;
    minutes = m;
  }

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  d.setDate(d.getDate() + dayOffset);
  return d;
}

/* -------------------- small components -------------------- */

function PrayerRow(props: {
  prayer: Prayer;
  active: boolean;
}) {
  const d = timeToDate(props.prayer.time);

  return (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "font-size": "4.5vh",
        "font-weight": props.active ? "900" : "500",
        color: props.active ? "#0a4f00" : "#000",
        padding: "1vh 0",
      }}
    >
      <div>{props.prayer.en}</div>
      <div>
        {padZero(d.getHours())}:{padZero(d.getMinutes())}
      </div>
      <div style={{ direction: "rtl" }}>
        {props.prayer.ar}
      </div>
    </div>
  );
}

function DuhaRow(props: { date: Date }) {
  return (
    <div
      style={{
        "margin-top": "3vh",
        "padding-top": "3vh",
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "font-size": "4.5vh",
        "font-weight": "bold",
        "border-top": "3px solid #ccc",
      }}
    >
      <div>Duha begins at</div>
      <div
        style={{ "font-weight": "900" }}
      >
        {padZero(props.date.getHours())}:{padZero(props.date.getMinutes())}
      </div>
      <div style={{ direction: "rtl" }}>الضحى</div>
    </div>
  );
}

/* -------------------- main component -------------------- */

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

  /* ---------- load prayers ---------- */

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
  });

  /* ---------- timer engine ---------- */

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

      if (phase() === "AZAN") {
        const diff = nextPrayerTime.getTime() - now.getTime();
        if (diff <= 0) {
          setPhase("IQAMAH");
          setIqamahEnd(null);
        } else {
          setCountdown(formatHMS(diff));
        }
      }

      if (phase() === "IQAMAH") {
        let end = iqamahEnd();
        if (!end) {
          end = new Date(
            now.getTime() +
            (testIQAMAHDuration ?? 15 * 60) * 1000
          );
          setIqamahEnd(end);
        }

        const diff = end.getTime() - now.getTime();
        if (diff <= 0) {
          setPhase("POST_IQAMAH");
          setIqamahEnd(null);
          setTestNextPrayerTime(null);
          testIQAMAHDuration = null;
        } else {
          setCountdown(formatHMS(diff));
        }
      }
    }, 1000);
  });

  onCleanup(() => clearInterval(timer));

  createEffect(() => {
    if (phase() === "POST_IQAMAH") {
      setImageIndex(Math.floor(Math.random() * images.length));
    }
  });

  /* -------------------- render -------------------- */

  return (
    <div class="screen">
      {/* LEFT */}
      <div class="left-column">
        {phase() === "AZAN" ? (
          <>
            <Clock />
            <DateInfo />

            <div style={{ padding: "1vw 3vw", flex: 1 }}>
              {prayers().map((p, i) => (
                <PrayerRow
                  prayer={p}
                  active={i === nextIndex()}
                />
              ))}

              {duhaDate() && <DuhaRow date={duhaDate()!} />}

              <button
                style={{ marginTop: "1vh", fontSize: "2.5vh" }}
                onClick={() => {
                  const now = new Date();
                  setTestNextPrayerTime(
                    new Date(now.getTime() + 10 * 1000)
                  );
                  testIQAMAHDuration = 7;
                  setPhase("AZAN");
                }}
              >
                Test Next Prayer
              </button>
            </div>
          </>
        ) : (
          <img
            src={images[imageIndex()]}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      {/* RIGHT */}
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

/* -------------------- right panel -------------------- */

function RightPanel(props: {
  phase: Phase;
  countdown: string;
  prayer?: Prayer;
}) {
  return (
    <div class="right-panel"
      style={{
        background: "#0a4f00",
        color: "white",
        height: "100%",
        width: "100%",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "text-align": "center",
        transition: "background 0.5s ease",
        padding: "2vh",
        "font-size": "7.0vh",
      }}>
      {props.phase === "POST_IQAMAH" && (
        <div
          style={{
            direction: "rtl",
            "margin-top": "2vh",
            "text-align": "center",
            "line-height": "1.4em",
            "padding-left": "3vw",
            "padding-right": "3vw",
          }}
        >
          <div>سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصُّفُوفِ مِنْ إِقَامَةِ الصَّلاَةِ</div>
          <div
            style={{
              "font-size": "3.5vh",
              "margin-top": "1vh",
              "text-align": "center",
              "line-height": "1.4em",
              "opacity": "0.7",
            }}
          >
            Luruskanlah saf-saf kamu kerana meluruskan saf itu termasuk di dalam mendirikan solat
          </div>
          <div
            style={{
              "font-size": "2vh",
              "margin-top": "1vh",
              "text-align": "center",
              "line-height": "1.4em",
              "opacity": "0.7",
            }}
          >
            Riwayat al-Bukhari (723)
          </div>
        </div>
      )}

      {props.phase === "IQAMAH" && (
        <>
          <div style={{ direction: "rtl", fontSize: "5vh" }}>الإقامة</div>
          <div>Iqamah</div>
          <div class="countdown">{props.countdown}</div>
        </>
      )}

      {props.phase === "AZAN" && (
        props.prayer?.en === "Syuruk" ? (
          <>
            <div style={{ "font-size": "5vh", "font-weight": "700", color: "lightGreen" }}>
              Syuruk
            </div>
            <div class="countdown">{props.countdown}</div>
          </>
        ) : (
          <>
            <div style={{ direction: "rtl", "font-size": "5vh" }}>
              الأذان القادم {props.prayer?.ar}
            </div>
            <div style={{ "font-size": "4.5vh" }}>
              Next Azan {props.prayer?.en}
            </div>
            <div class="countdown">{props.countdown}</div>
          </>
        )
      )}

    </div>
  );
}
