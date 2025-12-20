import { padZero } from "../utils/time";

export default function DuhaRow(props: { date: Date }) {
  return (
    <div
      style={{
        padding: "0vw 3vw",
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "font-size": "4.1vh",
        "font-weight": "bold",
        "border-top": "1px solid green",
        "padding-top": "3vh",
        "padding-bottom": "2vh",
        color: "green"
      }}
    >
      <div>DUHA STARTS AT</div>
      <div style={{ "font-weight": "900" }}>
        {padZero(props.date.getHours())}:
        {padZero(props.date.getMinutes())}
      </div>
      <div style={{ direction: "rtl" }}>الضحى</div>
    </div>
  );
}
