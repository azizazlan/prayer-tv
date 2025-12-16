import { createSignal, createEffect } from "solid-js";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerList from "../components/PrayerList";
import Duha from "../components/Duha";
import NextAzan from "../components/NextAzan";

import image1 from "../assets/image_1.jpg";
import image2 from "../assets/image_2.jpg";
import image3 from "../assets/image_3.jpg";
import image4 from "../assets/image_4.jpg";
import image5 from "../assets/image_5.jpg";
import image6 from "../assets/image_6.jpg";

import "../styles/home.css";

type Phase = "AZAN" | "IQAMAH" | "POST_IQAMAH";

const images = [image1, image2, image3, image4, image5, image6];

export default function Home() {
  const [phase, setPhase] = createSignal<Phase>("AZAN");
  const [imageIndex, setImageIndex] = createSignal(0);

  // 🔀 RANDOM (Production behavior)
  function pickRandomImage() {
    const random = Math.floor(Math.random() * images.length);
    setImageIndex(random);
  }

  // 🔁 ROTATE (Testing behavior)
  function nextImage() {
    setImageIndex((i) => (i + 1) % images.length);
  }

  // When entering POST_IQAMAH → RANDOM image
  createEffect(() => {
    if (phase() === "POST_IQAMAH") {
      pickRandomImage();
    }
  });

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
              src={images[imageIndex()]}
              alt="Luruskan Saf"
              style={{
                width: "100%",
                height: "100%",
                "object-fit": "cover",
              }}
            />

            {/* TEST BUTTON (safe to remove in prod) */}
            <button
              style={{
                position: "absolute",
                bottom: "2vh",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "1vh 2vw",
                "font-size": "1vh",
                cursor: "pointer",
                opacity: 0.85,
              }}
              onClick={nextImage}
            >
              Change Image
            </button>
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
