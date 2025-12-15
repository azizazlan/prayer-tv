const prayers = [
  { en: "ALFAJR", time: "05:11", ar: "الفجر" },
  { en: "DUHUR", time: "12:06", ar: "الظهر" },
  { en: "ALASR", time: "03:23", ar: "العصر" },
  { en: "MAGHRIB", time: "05:42", ar: "المغرب" },
  { en: "ALISHA", time: "07:11", ar: "العشاء" },
];

export default function PrayerList() {
  return (
    <div
      style={{
        flex: 1,              // 🔥 THIS pushes Duha down
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center", // optional
        padding: "0 4vw",
        "font-size": "4.1vh",
      }}
    >
      {prayers.map(p => (
        <div
          style={{
            display: "grid",
            "grid-template-columns": "1fr 1fr 1fr",
            margin: "1.2vh 0",
          }}
        >
          <span>{p.en}</span>
          <strong style={{ "text-align": "center" }}>{p.time}</strong>
          <span style={{ "text-align": "right", direction: "rtl" }}>
            {p.ar}
          </span>
        </div>
      ))}
    </div>
  );
}
