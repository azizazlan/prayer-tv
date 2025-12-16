export default function Duha() {
  const duhaTime = "07:20";
  const sunriseTime = "06:50";

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "row",
        "justify-content": "space-between",
        padding: "0 3vw",
        "padding-top": "1.5vh",
        "border-top": "2px solid #ccc",
      }}
    >
      {/* Left column - Duha */}
      <div style={{ display: "flex", "flex-direction": "column" }}>
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}> يبدأ الضحى في</div>
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>Duha starts at</div>
        <div style={{ "font-size": "4.7vh", "font-weight": "bold" }}>{duhaTime}</div>
      </div >

      {/* Right column - Sunrise */}
      < div style={{ display: "flex", "flex-direction": "column", "text-align": "right" }}>
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>لشروق</div>
        <div style={{ "font-size": "2.1vh", "font-weight": "bold" }}>Sunrise</div>
        <div style={{ "font-size": "4.7vh", "font-weight": "bold", color: "#c0392b" }}>{sunriseTime}</div>
      </div >
    </div >
  );
}
