import { createSignal } from "solid-js";
import type { Prayer } from "../prayers";
import logoBg from "../assets/logo2.png";
import BlackoutPanel from "./BlackoutPanel";
import PostIqamahPanel from "./PostIqamahPanel";
import IqamahPanel from "./IqamahPanel";
import AzanPanel from "./AzanPanel";
import { unlockAudio, isAudioUnlocked } from "../App";

const FORCE_BLACKOUT = false; // ← set true to test

export type Phase = "BLACKOUT" | "IQAMAH" | "POST_IQAMAH" | "AZAN";

export default function RightPanel(props: {
  phase: Phase;
  countdown: string;
  prayer?: Prayer;
  lastPrayer?: () => Prayer | undefined;
  filteredPrayers?: () => Prayer[]; // For IQAMAH display
  nextPrayer: () => Prayer | undefined;
}) {
  const [unlocked, setUnlocked] = createSignal(isAudioUnlocked());

  const handleUnlock = async () => {
    const success = await unlockAudio();
    if (success) {
      setUnlocked(true);
    }
  };

  return (
    <div
      class="right-column"
      style={{
        "background-image": `url(${logoBg})`,
        "background-repeat": "repeat",
        color: "white",
        height: "100%",
        width: "100%",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "text-align": "center",
        "font-size": "7vh",
      }}
      onClick={unlockAudio}
      onTouchStart={unlockAudio}
    >
      {(FORCE_BLACKOUT || props.phase === "BLACKOUT") && <BlackoutPanel />}
      {props.phase === "POST_IQAMAH" && <PostIqamahPanel />}
      {props.phase === "IQAMAH" && (
        <IqamahPanel
          countdown={props.countdown}
          filteredPrayers={props.filteredPrayers}
          lastPrayer={props.lastPrayer}
        />
      )}
      {props.phase === "AZAN" && (
        <AzanPanel
          prayer={props.prayer}
          countdown={props.countdown}
          filteredPrayers={props.filteredPrayers}
          nextPrayer={props.nextPrayer}
        />
      )}

      {!unlocked() && (
        <button
          onClick={handleUnlock}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "4px 8px",
            "font-size": "10px",
            opacity: 0.7,
            "background-color": "transparent",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            cursor: "pointer",
          }}
        >
          🔔ALARM
        </button>
      )}
    </div>
  );
}
