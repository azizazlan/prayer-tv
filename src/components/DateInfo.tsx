export default function DateInfo() {
  const now = new Date();

  // Gregorian
  const gregorianMonth = now.toLocaleString("en", { month: "long" });
  const gregorianYear = now.getFullYear();
  const weekdayEn = now.toLocaleDateString("en", { weekday: "long" });

  // Hijri (Arabic)
  const hijriDayMonthFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
  });

  const hijriYearFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    year: "numeric",
  });

  const hijriDayMonth = hijriDayMonthFormatter.format(now);
  const hijriYear = hijriYearFormatter.format(now);

  // Arabic weekday
  const weekdayAr = new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
  }).format(now);

  return (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
        padding: "0 4vw",
        "font-size": "2.4vh",
        "font-weight": "bold",
      }}
    >
      {/* Gregorian */}
      <div>
        <div>{gregorianMonth}</div>
        <div>{gregorianYear}</div>
      </div>

      {/* Weekday */}
      <div style={{ "text-align": "center" }}>
        <div>{weekdayAr}</div>
        <div>{weekdayEn}</div>
      </div>

      {/* Hijri */}
      <div style={{ "text-align": "right", direction: "rtl" }}>
        <div>{hijriDayMonth}</div>
        <div>{hijriYear}</div>
      </div>
    </div>
  );
}
