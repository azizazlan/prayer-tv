import { createSignal, onCleanup } from "solid-js";

export default function Clock() {
  const [time, setTime] = createSignal(new Date());

  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);

  onCleanup(() => clearInterval(timer));

  return (
    <div
      style={{
        "min-height": "12vh",        // ✅ minimum height
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        color: "#0a4f00",
        "font-size": "7vh",
        "font-weight": "bold",
        "font-family": "monospace",
      }}
    >
      {time().toLocaleTimeString()}
    </div>
  );
}
