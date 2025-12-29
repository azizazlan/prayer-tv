import { For } from "solid-js";
import type { Prayer } from "../prayers";
import logoBg from "../assets/logo2.png";
import BlackoutPanel from "./BlackoutPanel";
import PostIqamahPanel from "./PostIqamahPanel";
import IqamahPanel from "./IqamahPanel";
import AzanPanel from "./AzanPanel";

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
    </div >
  );
}
