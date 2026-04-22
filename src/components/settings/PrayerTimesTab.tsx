export default function PrayerTimesTab() {
  return (
    <div>
      <h2 style={{ "font-size": "3vh", "margin-bottom": "2vh" }}>
        Prayer Times Settings
      </h2>

      <p style={{ opacity: 0.7, "font-size": "2vh" }}>
        Configure prayer schedule source and offsets here.
      </p>

      {/* Future controls */}
      <div style={{ "margin-top": "2vh" }}>
        <label style={{ "font-size": "2.5vh" }}>Time Source</label>

        <select
          style={{
            width: "100%",
            height: "6vh",
            "font-size": "2.5vh",
            "margin-top": "1vh",
          }}
        >
          <option>Local Calculation</option>
          <option>API Sync</option>
          <option>Manual Override</option>
        </select>
      </div>
    </div>
  );
}
