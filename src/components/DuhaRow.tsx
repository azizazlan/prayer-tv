import { padZero } from "../utils/time";

export default function DuhaRow(props: { dateDuha: Date; dateSyuruk?: Date }) {
  return (
    <div
      style={{
        "margin-top": "0.5rem",
        padding: "0vw 3vw",
        display: "flex",
        "flex-direction": "row",
        "font-size": "2.7vh",
        "align-items": "center",
        "justify-content": "space-between",
      }}
    >
      {/* Left column: Duha */}
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "justify-content": "flex-start",
          "line-height": "1.3",
        }}
      >
        <div
          style={{
            "font-weight": 900,
            direction: "rtl",
            "font-size": "3.7vh",
            "font-family": "Cairo",
            "text-align": "left",
            color: "darkgreen",
          }}
        >
          يبدأ الضحى الساعة
        </div>
        <div style={{ color: "darkgreen" }}>DUHA BERMULA</div>
        <div
          style={{
            "font-size": "6.5vh",
            color: "darkgreen",
            "font-weight": "500",
          }}
        >
          {padZero(props.dateDuha.getHours())}:
          {padZero(props.dateDuha.getMinutes())}
        </div>
      </div>

      {/* Right column: Syuruk */}
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
          "justify-content": "flex-end",
          "line-height": "1.3",
        }}
      >
        <div
          style={{
            "font-weight": 900,
            direction: "rtl",
            "font-size": "3.7vh",
            "font-family": "Cairo",
            color: "darkgreen",
          }}
        >
          الشروق
        </div>
        <div style={{ "text-align": "right", color: "darkgreen" }}>
          MATAHARI TERBIT
        </div>
        <div
          style={{
            "text-align": "right",
            "font-size": "6.5vh",
            color: "#c0392b",
            "font-weight": "500",
          }}
        >
          {props.dateSyuruk
            ? padZero(props.dateSyuruk.getHours()) +
              ":" +
              padZero(props.dateSyuruk.getMinutes())
            : "N/A"}
        </div>
      </div>
    </div>
  );
}
