import type { Accessor } from "solid-js";
import type { Phase } from "../services/timer";

type DevPanelProps = {
  phase: Accessor<Phase>;
  iqamahDuration: number;
  postIqamahDuration: number;
  blackoutDuration: number;
  msToMinutes: (ms: number) => number;
};

export default function DevPanel(props: DevPanelProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1vh",
        right: "1vw",
        padding: "0.5vw",
        background: "rgba(0,0,0,0.25)",
        color: "yellow",
        "font-family": "monospace",
        "font-size": "0.95vh",
        "z-index": 10000,
        "min-width": "9vw",
        opacity: 0.8,
      }}
    >
      <div
        style={{
          display: "grid",
          "grid-template-columns": "max-content max-content",
          "row-gap": "0.3vh",
          "column-gap": "1vw",
        }}
      >
        <div>PHASE</div>
        <div style={{ "font-weight": "bold" }}>{props.phase()}</div>

        <div>IQAMAH</div>
        <div>{props.msToMinutes(props.iqamahDuration)} mins</div>

        <div>POST IQAMAH</div>
        <div>{props.postIqamahDuration / 1000} secs</div>

        <div>BLACKOUT</div>
        <div>{props.msToMinutes(props.blackoutDuration)} mins</div>
      </div>
    </div>
  );
}
