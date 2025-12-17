import { createSignal, createEffect, onCleanup, onMount } from "solid-js";
import { defaultPrayers, type Prayer } from "../prayers";
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

let testIQAMAHDuration: number | null = null; // in seconds

type Phase = "AZAN" | "IQAMAH" | "POST_IQAMAH";

const images = [image1, image2, image3, image4, image5, image6];

// Helper: parse "HH:MM" or "H:MM am/pm"
function timeToDate(time: string) {
  const lower = time.toLowerCase().trim();
  let hours = 0,
    minutes = 0;

  if (lower.includes("am") || lower.includes("pm")) {
    const [raw, modifier] = lower.split(" ");
    [hours, minutes] = raw.split(":").map(Number);
    if (modifier === "pm" && hours !== 12) hours += 12;
    if (modifier === "am" && hours === 12) hours = 0;
  } else {
    [hours, minutes] = lower.split(":").map(Number);
  }

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Helper: pad number
function padZero(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Home() {
  const [prayers, setPrayers] = createSignal<Prayer[]>([]);
  const [nextIndex, setNextIndex] = createSignal(0);
  const [phase, setPhase] = createSignal<Phase>("AZAN");
  const [countdown, setCountdown] = createSignal<string>("--:--");
  const [duhaDate, setDuhaDate] = createSignal<Date | null>(null);
  const [imageIndex, setImageIndex] = createSignal(0);
  const [iqamahEndTime, setIqamahEndTime] = createSignal<Date | null>(null);

  // Load today's prayers
  onMount(async () => {
    const today = await loadTodayPrayers();
    if (today) {
      setPrayers(today);

      // Compute next prayer index
      const now = new Date();
      const next = today.findIndex(p => timeToDate(p.time) > now);
      setNextIndex(next >= 0 ? next : 0);

      // Compute Duha (+20 min after Syuruk)
      const syuruk = today.find(p => p.en === "Syuruk");
      if (syuruk) {
        const syurukD = timeToDate(syuruk.time);
        setDuhaDate(new Date(syurukD.getTime() + 20 * 60 * 1000));
      }
    }
  });

  // Countdown logic
  let interval: any;
  createEffect(() => {
    clearInterval(interval);
    interval = setInterval(() => {
      const now = new Date();
      if (!prayers().length) {
        setCountdown("--:--");
        return;
      }

      const nextPrayer = timeToDate(prayers()[nextIndex()].time);

      if (phase() === "AZAN") {
        const diff = nextPrayer.getTime() - now.getTime();
        if (diff <= 0) {
          // Enter IQAMAH
          setPhase("IQAMAH");
          setIqamahEndTime(null); // will be set in next tick
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setCountdown(`${padZero(m)}:${padZero(s)}`);
        }
      } else if (phase() === "IQAMAH") {
        let iqEnd = iqamahEndTime();
        if (!iqEnd) {
          iqEnd = new Date(now.getTime() + (testIQAMAHDuration ?? 15 * 60) * 1000);
          setIqamahEndTime(iqEnd);
        }
        const diff = iqEnd.getTime() - now.getTime();
        if (diff <= 0) {
          setPhase("POST_IQAMAH");
          setIqamahEndTime(null);
          testIQAMAHDuration = null; // reset test
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setCountdown(`${padZero(m)}:${padZero(s)}`);
        }
      }

    }, 1000);
  });

  onCleanup(() => clearInterval(interval));

  // Random image for POST_IQAMAH
  function pickRandomImage() {
    const r = Math.floor(Math.random() * images.length);
    setImageIndex(r);
  }

  createEffect(() => {
    if (phase() === "POST_IQAMAH") pickRandomImage();
  });

  return (
    <div class="screen">
      {/* LEFT COLUMN */}
      <div class="left-column">
        {phase() !== "POST_IQAMAH" && (
          <>
            <Clock />
            <DateInfo />

            {/* Prayer List */}
            <div
              style={{
                flex: 1,
                display: "flex",
                "flex-direction": "column",
                "justify-content": "center",
                padding: "0 3vw",
                "font-size": "3.7vh",
              }}
            >
              {prayers().map((p, i) => {
                const isNext = i === nextIndex();
                return (
                  <div
                    style={{
                      display: "grid",
                      "grid-template-columns": "minmax(0,1fr) auto minmax(0,1fr)",
                      "align-items": "center",
                      "font-size": "4.5vh",
                      "font-weight": isNext ? "900" : "500",
                      color: isNext ? "#0a4f00" : "#000",
                      padding: "1vh 0",
                    }}
                  >
                    <div style={{ "text-align": "left" }}>{p.en}</div>
                    <div style={{ "text-align": "center" }}>
                      {padZero(timeToDate(p.time).getHours())}:{padZero(timeToDate(p.time).getMinutes())}
                    </div>
                    <div
                      style={{
                        direction: "rtl",
                        "min-width": "0",
                        display: "block",
                        "justify-self": "end",
                        overflow: "visible",
                      }}
                    >
                      {p.ar}
                    </div>
                  </div>
                );
              })}

              {/* Duha row */}
              {duhaDate() && (
                <div
                  style={{
                    display: "grid",
                    "grid-template-columns": "minmax(0,1fr) auto minmax(0,1fr)",
                    "align-items": "center",
                    "font-size": "4.5vh",
                    "font-weight": "bold",
                    color: "#0a4f00",
                    padding: "1vh 0",
                    "border-top": "2px solid #ccc",
                  }}
                >
                  <div style={{ "text-align": "left" }}>Duha</div>
                  <div style={{ "text-align": "center" }}>
                    {padZero(duhaDate()!.getHours())}:{padZero(duhaDate()!.getMinutes())}
                  </div>
                  <div style={{ direction: "rtl", "justify-self": "end" }}>الضحى</div>
                </div>
              )}

              {/* Test Button */}
              <button
                style={{
                  margin: "1vh 3vw",
                  padding: "1vh 2vw",
                  fontSize: "2.5vh",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const now = new Date();

                  // Set next prayer to 10 seconds from now
                  const testPrayer = new Date(now.getTime() + 10 * 1000);
                  const newPrayers = [...prayers()];
                  newPrayers[nextIndex()] = {
                    ...newPrayers[nextIndex()],
                    time: `${padZero(testPrayer.getHours())}:${padZero(testPrayer.getMinutes())}`,
                  };
                  setPrayers(newPrayers);

                  // Set IQAMAH duration 7 seconds for test
                  testIQAMAHDuration = 7;
                  setPhase("AZAN");
                }}
              >
                Test Next Prayer
              </button>

            </div>
          </>
        )}

        {/* POST IQAMAH */}
        {phase() === "POST_IQAMAH" && (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={images[imageIndex()]}
              alt="Luruskan Saf"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div
        class="right-column"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "6vh",
          fontWeight: "bold",
          position: "relative",
        }}
      >
        {phase() === "POST_IQAMAH" ? (
          <div style={{ fontSize: "5vh", fontWeight: "bold" }}>Luruskan saf-saf...</div>
        ) : prayers().length > 0 ? (
          phase() === "IQAMAH"
            ? `Iqamah: ${countdown()}`
            : `Next Azan: ${prayers()[nextIndex()].en} in ${countdown()}`
        ) : (
          "Loading..."
        )}

      </div>
    </div>
  );
}
