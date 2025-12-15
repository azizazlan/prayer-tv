import { createSignal, onCleanup } from "solid-js";

export default function NextAzan() {
  // Example next azan time (24h format)
  const NEXT_AZAN = "19:11";

  const [remaining, setRemaining] = createSignal(getRemainingTime());

  function getRemainingTime() {
    const now = new Date();

    const [h, m] = NEXT_AZAN.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    // If target already passed, move to next day
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    const diff = Math.max(0, target.getTime() - now.getTime());
    return diff;
  }

  const timer = setInterval(() => {
    setRemaining(getRemainingTime());
  }, 1000);

  onCleanup(() => clearInterval(timer));

  function format(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }

  return (
    <div
      style={{
        background: "#0a4f00",
        color: "white",
        "text-align": "center",
        padding: "2vh 0",
      }}
    >
      <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>
        NEXT AZAN
      </div>

      <div style={{ "font-size": "6.5vh", "font-weight": "bold", "font-family": "monospace" }}>
        {format(remaining())}
      </div>
    </div>
  );
}
