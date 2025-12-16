import { createSignal } from "solid-js";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerList from "../components/PrayerList";
import Duha from "../components/Duha";
import NextAzan from "../components/NextAzan";
import "../styles/home.css";

export default function Home() {
  const [phase, setPhase] = createSignal<"AZAN" | "IQAMAH" | "POST_IQAMAH">("AZAN");

  return (
    <div class="screen">
      {/* LEFT COLUMN */}
      <div class="left-column">
        {phase() !== "POST_IQAMAH" && (
          <>
            <Clock />
            <DateInfo />
            <PrayerList />
            <Duha />
          </>
        )}

        {/* Display images only during POST_IQAMAH */}
        {phase() === "POST_IQAMAH" && (
          <div style={{ "margin-top": "2vh", display: "flex", "gap": "1vw", "flex-direction": "column" }}>
            <div style={{ display: "flex", "gap": "1vw" }}>
              <img src="/images/1.png" alt="Image 1" style={{ width: "100px", height: "100px" }} />
              <img src="/images/2.png" alt="Image 2" style={{ width: "100px", height: "100px" }} />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div class="right-column">
        <NextAzan setPhase={setPhase} />
      </div>
    </div>
  );
}
