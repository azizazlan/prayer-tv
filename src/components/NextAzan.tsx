import { createSignal, onCleanup } from "solid-js";
import { getNextPrayer } from "../services/prayerTime";

const IQAMAH_DURATION = 15 * 1000; // 15s for testing

type Phase = "AZAN" | "IQAMAH" | "POST_IQAMAH";

export default function NextAzan(props: { setPhase: (phase: Phase) => void }) {
  const [remaining, setRemaining] = createSignal(0);
  const [phase, setLocalPhase] = createSignal<Phase>("AZAN");
  const [prayer, setPrayer] = createSignal({ en: "", ar: "", at: new Date() });
  const [iqamahEnd, setIqamahEnd] = createSignal<number | null>(null);

  const [simulate, setSimulate] = createSignal(false);

  function update() {
    const now = Date.now();
    const next = getNextPrayer();
    setPrayer(next);

    // Determine remaining time until prayer
    let diff = simulate() ? remaining() : next.at.getTime() - now;

    // AZAN phase
    if (phase() === "AZAN") {
      if (diff > 0) {
        setRemaining(diff);
        if (simulate()) setRemaining(diff - 1000); // countdown simulation
      } else {
        // Start IQAMAH
        setLocalPhase("IQAMAH");
        props.setPhase("IQAMAH");
        setIqamahEnd(now + IQAMAH_DURATION);
        setRemaining(IQAMAH_DURATION);
        setSimulate(false);
      }
    }

    // IQAMAH phase
    if (phase() === "IQAMAH") {
      if (iqamahEnd()) {
        const iqDiff = Math.max(0, iqamahEnd()! - now);
        setRemaining(iqDiff);
        if (iqDiff === 0) {
          setLocalPhase("POST_IQAMAH");
          props.setPhase("POST_IQAMAH");
          setIqamahEnd(null);
        }
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

  function simulatePrayer() {
    setSimulate(true);
    setRemaining(10000); // 10s for testing any prayer
    setLocalPhase("AZAN");
    props.setPhase("AZAN");
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
          <div style={{ direction: "rtl", "font-size": "3.8vh", "font-weight": "bold" }}>الإقامة</div>
          <div style={{ "font-size": "2.6vh", opacity: 0.9, "margin-bottom": "1vh" }}>IQAMAH</div>
          <div style={{ "font-size": "9vh", "font-weight": "900", "font-family": "monospace" }}>
            {format(remaining())}
          </div>
        </>
      )}

      <button
        style={{ marginTop: "3vh", padding: "1vh 2vw", "font-size": "2vh", cursor: "pointer" }}
        onClick={simulatePrayer}
      >
        Simulate 10s before any prayer
      </button>
    </div>
  );
}
