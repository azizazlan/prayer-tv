import { padZero } from "../utils/time";

export default function DuhaRow(props: { dateDuha: Date; dateSyuruk: Date }) {
  return (
    <div
      style={{
        padding: "0vw 3vw",
        "border-top": "2px solid black",
        "padding-top": "4.0vh",
        display: "flex",
        "flex-direction": "row",
        "font-size": "2.5vh",
        "font-weight": "bold",
        alignItems: "center",
        "justify-content": "space-between",
      }}
    >
      {/* Left column: Duha */}
      <div style={{ display: "flex", "flex-direction": "column", alignItems: "center", "justify-content": "flex-start", "line-height": "1.1" }}>
        <div>DUHA STARTS AT</div>
        <div style={{ direction: "", fontWeight: "900", "font-size": "3.0vh" }}>الضحى</div>
        <div style={{ fontWeight: "900", "font-size": "4.7vh", "color": "#0a4f00" }}>
          {padZero(props.dateDuha.getHours())}:{padZero(props.dateDuha.getMinutes())}
        </div>
      </div>

      {/* Right column: Syuruk */}
      <div style={{ display: "flex", "flex-direction": "column", alignItems: "center", "justify-content": "flex-end", "line-height": "1.1" }}>
        <div style={{ "text-align": "right" }}>SUNRISE</div>
        <div style={{ direction: "rtl", fontWeight: "900", "font-size": "3.0vh" }}>الشروق</div>
        <div style={{ fontWeight: "900", "text-align": "right", "font-size": "4.7vh", "color": "#c0392b" }}>
          {padZero(props.dateSyuruk.getHours())}:{padZero(props.dateSyuruk.getMinutes())}
        </div>
      </div>
    </div>
  );
}
