import { For } from "solid-js";
import type { Prayer } from "../prayers";
import logoBg from "../assets/logo2.png";

export type Phase = "BLACKOUT" | "IQAMAH" | "POST_IQAMAH" | "AZAN";

export default function RightPanel(props: {
  phase: Phase;
  countdown: string;
  prayer?: Prayer;
  lastPrayer?: Prayer;
  filteredPrayers?: () => Prayer[]; // For IQAMAH display
}) {
  return (
    <div
      class="right-panel"
      style={{
        "background-image": `url(${logoBg})`,
        backgroundRepeat: "repeat",
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
      {props.phase === "BLACKOUT" && (
        <div style={{ width: "100%", height: "100%", background: "black" }} />
      )}

      {props.phase === "POST_IQAMAH" && (
        <div
          style={{
            direction: "rtl",
            "font-size": "6.5vh",
            "margin-top": "2vh",
            "text-align": "center",
            "line-height": "1.4em",
            "padding-left": "3vw",
            "padding-right": "3vw",
          }}
        >
          <div style={{ "font-size": "7.5vh", "margin-bottom": "1vh" }}>
            سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصُّفُوفِ مِنْ إِقَامَةِ الصَّلاَةِ
          </div>
          <div
            style={{
              "font-size": "3.5vh",
              opacity: "0.7",
              "line-height": "1.3em",
            }}
          >
            Luruskanlah saf-saf kamu kerana meluruskan saf itu termasuk di dalam
            mendirikan solat
          </div>
          <div style={{ "font-size": "2vh", opacity: "0.7" }}>
            Riwayat al-Bukhari (723)
          </div>
        </div>
      )}

      {props.phase === "IQAMAH" && (
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            width: "100%",
            height: "100%", // take full height of RightPanel
            "justify-content": "flex-start",
            "align-items": "center",
          }}
        >
          <div style={{ "min-height": "21vh" }} />
          <div style={{ direction: "rtl", "font-size": "7.5vh", "font-weight": "bold" }}>
            الإقامة
          </div>
          <div style={{ "font-size": "4.5vh", "font-weight": "bold" }}>IQAMAH</div>
          <div class="countdown">{props.countdown}</div>

          {/* Spacer to push prayer list downward */}
          <div style={{ "flex-grow": 1 }} />

          <div
            style={{
              display: "flex",
              gap: "1vw",
              width: "100%",
              "background-color": "#006400",
              "padding-top": "1vh",
              "padding-bottom": "2vh",
            }}
          >
            <For each={props.filteredPrayers?.() || []}>
              {(p) => (
                <div
                  class="prayerCol"
                  style={{
                    padding: "1vh",
                  }}
                >
                  <div style={{
                    "font-size": "1.7vh", color: "white",
                    "font-weight": props.lastPrayer?.time === p.time ? "bold" : "normal",
                    "opacity": props.lastPrayer?.time === p.time ? "1" : "0.5"

                  }}>
                    {p.en} {p.ar}
                  </div>
                  <div style={{
                    "font-size": "2.5vh", color: "white",
                    "font-weight": props.lastPrayer?.time === p.time ? "bold" : "normal",
                    "opacity": props.lastPrayer?.time === p.time ? "1" : "0.5"
                  }}>{p.time}</div>
                </div>
              )}
            </For>
          </div>
        </div >
      )
      }


      {
        props.phase === "AZAN" && (
          <>
            {props.prayer?.en === "Syuruk" ? (
              <>
                <div
                  style={{
                    "font-size": "5vh",
                    "font-weight": "700",
                    color: "lightgreen",
                  }}
                >
                  Syuruk
                </div>
                <div class="countdown">{props.countdown}</div>
              </>
            ) : (
              <>
                <div
                  style={{
                    direction: "rtl",
                    "font-size": "7.5vh",
                    "font-weight": "bold",
                  }}
                >
                  الأذان القادم {props.prayer?.ar}
                </div>
                <div style={{ "font-size": "4.5vh", "font-weight": "bold" }}>
                  AZAN {props.prayer?.en}
                </div>
                <div
                  class="countdown"
                  classList={{
                    "countdown--urgent": (() => {
                      if (!props.countdown) return false;
                      const [h, m, s] = props.countdown.split(":").map(Number);
                      const totalSeconds = h * 3600 + m * 60 + s;
                      return totalSeconds <= 180; // 3 minutes
                    })(),
                  }}
                  style={{ "font-weight": "bold" }}
                >
                  {props.countdown}
                </div>
              </>
            )}
          </>
        )
      }
    </div >
  );
}
