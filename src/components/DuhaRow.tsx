import { padZero } from "../utils/time";

export default function DuhaRow(props: { dateDuha: Date; dateSyuruk: Date }) {
  return (
    <div
      style={{
        padding: "0vw 3vw",
        "border-top": "2px solid black",
        "margin-top": "1.5vh",
        "padding-top": "4.0vh",
        display: "flex",
        "flex-direction": "row",
        "font-size": "2.5vh",
        alignItems: "center",
        "justify-content": "space-between",
      }}
    >
      {/* Left column: Duha */}
      <div style={{ display: "flex", "flex-direction": "column", alignItems: "center", "justify-content": "flex-start", "line-height": "1.3" }}>
        <div style={{ "font-weight": 900, direction: "rtl", fontWeight: "900", "font-size": "3.0vh", "font-family": "Cairo", "text-align": "left" }}>
          يبدأ الضحى الساعة
        </div>
        <div>DUHA BERMULA</div>
        <div style={{ "font-size": "5.5vh", "color": "darkgreen" }}>
          {padZero(props.dateDuha.getHours())}:{padZero(props.dateDuha.getMinutes())}
        </div>
      </div>

      {/* Right column: Syuruk */}
      <div style={{ display: "flex", "flex-direction": "column", alignItems: "center", "justify-content": "flex-end", "line-height": "1.3" }}>
        <div style={{ "font-weight": 900, direction: "rtl", "font-size": "3.0vh", "font-family": "Cairo" }}>الشروق</div>
        <div style={{ "text-align": "right" }}>MATAHARI TERBIT</div>
        <div style={{ "text-align": "right", "font-size": "5.5vh", "color": "#c0392b" }}>
          {padZero(props.dateSyuruk.getHours())}:{padZero(props.dateSyuruk.getMinutes())}
        </div>
      </div>
    </div>
  );
}
