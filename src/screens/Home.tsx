import { createSignal } from "solid-js";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerList from "../components/PrayerList";
import Duha from "../components/Duha";
import NextAzan from "../components/NextAzan";
import image1 from "../assets/image_1.jpg";
import "../styles/home.css";

export default function Home() {
  const [phase, setPhase] = createSignal<"AZAN" | "IQAMAH" | "POST_IQAMAH">("AZAN");

  return (
    <div class="screen">
      {/* LEFT COLUMN */}
      <div class="left-column">
        {/* NORMAL MODE */}
        {phase() !== "POST_IQAMAH" && (
          <>
            <Clock />
            <DateInfo />
            <PrayerList />
            <Duha />
          </>
        )}

        {/* POST IQAMAH MODE */}
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
              src={image1}
              alt="Saf"
              style={{
                width: "100%",
                height: "100%",
                "object-fit": "cover", // fills entire column
              }}
            />
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
