export default function Duha() {
  const duhaTime = "07:20";
  const sunriseTime = "06:50";

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "row",
        "justify-content": "space-between",
        padding: "0 4vw",
      }}
    >
      {/* Left column - Duha */}
      < div style={{ display: "flex", "flex-direction": "column" }}>
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>
          يبدأ الضحى في
        </div>
        <br />
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>DUHA STARTS AT</div>
        <div style={{ "font-size": "4.1vh", "font-weight": "bold", "font-family": "monospace" }}>{duhaTime}</div>
      </div >

      {/* Right column - Sunrise */}
      < div style={{ display: "flex", "flex-direction": "column", "text-align": "right" }}>
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>لشروق</div>
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>SUNRISE</div>
        <div style={{ "font-size": "4.1vh", "font-weight": "bold", color: "#c0392b" }}>{sunriseTime}</div>
      </div >
    </div >
  );
}
