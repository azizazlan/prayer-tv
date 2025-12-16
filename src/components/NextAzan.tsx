import { createSignal, onCleanup } from "solid-js";
import { getNextPrayer } from "../services/prayerTime";

const IQAMAH_DURATION = 10 * 1000; // 10 seconds for testing

type Phase = "AZAN" | "IQAMAH" | "POST_IQAMAH";

export default function NextAzan() {
  const [remaining, setRemaining] = createSignal(0);
  const [phase, setPhase] = createSignal<Phase>("AZAN");
  const [prayer, setPrayer] = createSignal({ en: "", ar: "", at: new Date() });
  const [iqamahEnd, setIqamahEnd] = createSignal<number | null>(null);

  const [simulated, setSimulated] = createSignal(false);
  const [simulatedCountdown, setSimulatedCountdown] = createSignal<number>(0);

  function update() {
    const now = Date.now();
    const next = getNextPrayer();
    setPrayer(next);

    if (phase() === "AZAN") {
      let diff = simulated() ? simulatedCountdown() : next.at.getTime() - now;

      if (diff > 0) {
        setRemaining(diff);

        if (simulated()) {
          setSimulatedCountdown(diff - 1000); // decrement 1s
        }
      } else {
        // Switch to IQAMAH
        setPhase("IQAMAH");
        setIqamahEnd(now + IQAMAH_DURATION);
        setRemaining(IQAMAH_DURATION);
        setSimulated(false);
      }
    } else if (phase() === "IQAMAH") {
      const end = iqamahEnd()!;
      const diff = Math.max(0, end - now);
      setRemaining(diff);

      if (diff === 0) {
        setPhase("POST_IQAMAH");
      }
    }
  }

  const timer = setInterval(update, 1000);
  onCleanup(() => clearInterval(timer));

  function format(ms: number) {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  // General simulation for next prayer
  function simulateNextPrayer() {
    setSimulated(true);
    setSimulatedCountdown(10 * 1000); // 10 seconds
    setPhase("AZAN");
  }

  return (
    <div
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
      }}
    >
      {/* AZAN */}
      {phase() === "AZAN" && (
        <>
          <div style={{ direction: "rtl", "font-size": "3.8vh", "font-weight": "bold" }}>
            الأذان القادم • {prayer().ar}
          </div>
          <div style={{ "font-size": "2.6vh", opacity: 0.9, "margin-bottom": "1vh" }}>
            NEXT AZAN • {prayer().en}
          </div>
          <div style={{ "font-size": "9vh", "font-weight": "900", "font-family": "monospace" }}>
            {format(remaining())}
          </div>
        </>
      )}

      {/* IQAMAH */}
      {phase() === "IQAMAH" && (
        <>
          <div style={{ direction: "rtl", "font-size": "3.8vh", "font-weight": "bold" }}>
            الإقامة
          </div>
          <div style={{ "font-size": "2.6vh", opacity: 0.9, "margin-bottom": "1vh" }}>IQAMAH</div>
          <div style={{ "font-size": "9vh", "font-weight": "900", "font-family": "monospace" }}>
            {format(remaining())}
          </div>
        </>
      )}

      {/* POST IQAMAH */}
      {phase() === "POST_IQAMAH" && (
        <div
          style={{
            direction: "rtl",
            "font-size": "5.7vh",
            "margin-top": "2vh",
            "text-align": "center",
            "line-height": "1.4em",
            "padding-left": "2vw",
            "padding-right": "2vw",
          }}
        >
          <div>سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصُّفُوفِ مِنْ إِقَامَةِ الصَّلاَةِ</div>
          <div
            style={{
              "font-size": "3.7vh",
              "margin-top": "2vh",
              "text-align": "center",
              "line-height": "1.4em",
            }}
          >Luruskanlah saf-saf kamu kerana meluruskan saf itu termasuk di dalam mendirikan solat</div>
          <div
            style={{
              "font-size": "2vh",
              "margin-top": "2vh",
              "text-align": "center",
              "line-height": "1.4em",
            }}
          >Riwayat al-Bukhari (723)</div>
        </div>
      )}

      <button
        style={{
          marginTop: "3vh",
          padding: "1vh 2vw",
          "font-size": "2vh",
          cursor: "pointer",
        }}
        onClick={simulateNextPrayer}
      >
        Simulate 10s before next prayer
      </button>
    </div>
  );
}
