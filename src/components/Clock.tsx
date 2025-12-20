import { createSignal, onCleanup } from "solid-js";
import logo from "../assets/logo.jpg";

export default function Clock() {
  const [time, setTime] = createSignal(new Date());

  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  onCleanup(() => clearInterval(timer));

  return (
    <div
      style={{
        height: "12vh",                 // single reference height
        display: "flex",
        "align-items": "center",         // vertical centering
      }}
    >
      {/* LEFT: Logo */}
      <div
        style={{
          height: "100%",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            "margin-left": "3vw",
            height: "90%",              // relative to row height
            "object-fit": "contain",
          }}
        />
      </div>

      {/* CENTER: Clock */}
      <div
        style={{
          flex: 1,
          height: "100%",
          "padding-top": "5vh",
          display: "flex",
          "align-items": "center",       // same center line
          "justify-content": "center",
          "font-size": "6.0vh",
          "font-weight": "bold",
          "font-family": "'Digital-7', sans-serif",
          color: "green",
        }}
      >
        {time().toLocaleTimeString()}
      </div>

      {/* RIGHT: Spacer */}
      <div style={{ width: "27vh" }} />
    </div>
  );
}
