import type { Prayer } from "../prayers";

export type Phase = "AZAN" | "IQAMAH" | "POST_IQAMAH";

export default function RightPanel(props: {
  phase: Phase;
  countdown: string;
  prayer?: Prayer;
}) {
  return (
    <div
      class="right-panel"
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
        padding: "2vh",
        "font-size": "7vh",
      }}
    >
      {props.phase === "POST_IQAMAH" && (
        <div style={{
          direction: "rtl",
          "font-size": "6.5vh",
          "margin-top": "2vh",
          "text-align": "center",
          "line-height": "1.4em",
          "padding-left": "3vw",
          "padding-right": "3vw",
        }}>
          <div>
            سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصُّفُوفِ مِنْ إِقَامَةِ الصَّلاَةِ
          </div>
          <div style={{ "font-size": "3.5vh", opacity: "0.7", "line-height": "1.3em", }}>
            Luruskanlah saf-saf kamu kerana meluruskan saf itu termasuk di dalam mendirikan solat
          </div>
          <div style={{ "font-size": "2vh", opacity: "0.7" }}>
            Riwayat al-Bukhari (723)
          </div>
        </div>
      )}

      {props.phase === "IQAMAH" && (
        <>
          <div style={{ direction: "rtl", "font-size": "5vh" }}>الإقامة</div>
          <div style={{ "font-size": "4.5vh" }}>Iqamah</div>
          <div class="countdown">{props.countdown}</div>
        </>
      )}

      {props.phase === "AZAN" && (
        props.prayer?.en === "Syuruk" ? (
          <>
            <div style={{ "font-size": "5vh", "font-weight": "700", color: "lightgreen" }}>
              Syuruk
            </div>
            <div class="countdown">{props.countdown}</div>
          </>
        ) : (
          <>
            <div style={{ direction: "rtl", "font-size": "5vh" }}>
              الأذان القادم {props.prayer?.ar}
            </div>
            <div style={{ "font-size": "4.5vh" }}>
              Azan {props.prayer?.en}
            </div>
            <div class="countdown">{props.countdown}</div>
          </>
        )
      )}
    </div>
  );
}
