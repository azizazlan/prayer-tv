import type { Accessor } from "solid-js";
import type { Phase } from "../services/timer";
import {
  IQAMAH_DURATION,
  ALFAJR_IQAMAH_DURATION,
  ALASR_IQAMAH_DURATION,
  MAGHRIB_IQAMAH_DURATION,
  IQAMAH_IMAGE_DURATION,
  POST_IQAMAH_DURATION,
  BLACKOUT_DURATION,
} from "../config/timings";


type DevPanelProps = {
  phase: Accessor<Phase>;
  effectiveIqamahDuration: Accessor<number>;
  msToMinutes: (ms: number) => number;
};

export default function DevPanel(props: DevPanelProps) {
  return (
    <div style={{
      position: "fixed", bottom: "13vh", right: "1vw", padding: "0.5vw",
      background: "rgba(0,0,0,0.25)", color: "yellow",
      "font-family": "monospace", "font-size": "1.0vh",
      "z-index": 10000, "min-width": "7vw", opacity: 0.8
    }}
    >
      <div style={{
        display: "grid",
        "grid-template-columns": "max-content max-content",
        "row-gap": "0.3vh",
        "column-gap": "1vw",
      }}>
        <div>PHASE</div>
        <div style={{ "font-weight": "bold" }}>{props.phase()}</div>

        <div>IQAMAH (effective)</div>
        <div>{props.msToMinutes(props.effectiveIqamahDuration())} mins</div>

        <div>POST IQAMAH</div>
        <div>{POST_IQAMAH_DURATION / 1000} secs</div>

        <div>BLACKOUT</div>
        <div>{props.msToMinutes(BLACKOUT_DURATION)} mins</div>

        <div>ENV IQAMAH</div>
        <div>{props.msToMinutes(IQAMAH_DURATION)} mins</div>

        <div>ENV FAJR</div>
        <div>{props.msToMinutes(ALFAJR_IQAMAH_DURATION)} mins</div>

        <div>ENV ASR</div>
        <div>{props.msToMinutes(ALASR_IQAMAH_DURATION)} mins</div>

        <div>ENV MAGHRIB</div>
        <div>{props.msToMinutes(MAGHRIB_IQAMAH_DURATION)} mins</div>

        <div>ENV IQ IMAGE</div>
        <div>{IQAMAH_IMAGE_DURATION / 1000} secs</div>
      </div>
    </div>
  );
}

