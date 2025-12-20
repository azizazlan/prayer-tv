export default function DateInfo() {
  const now = new Date();

  // Gregorian
  const gregorianMonth = now.toLocaleString("en", { month: "short" });
  const gregorianYear = now.getFullYear();
  const gregorianDay = now.getDate(); // ✅ day of month
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
        padding: "0 3vw",
        "font-size": "3.0vh",
        "font-weight": "bold",
        color: "green",
        "padding-bottom": "1vh",
        "margin-bottom": "1vh",
        "border-bottom": "2px solid black",
      }}
    >
      {/* Gregorian */}
      <div>
        <div>{gregorianMonth}, {gregorianDay}</div>
        <div>{gregorianYear}</div>
      </div>

      {/* Weekday + Date */}
      <div style={{ "text-align": "center" }}>
        {/* Weekday */}
        <div style={{ "text-align": "center" }}>
          <div>{weekdayAr}</div>
          <div>
            {weekdayEn}
          </div>
        </div>

      </div>

      {/* Hijri */}
      <div style={{ "text-align": "right", direction: "rtl" }}>
        <div>{hijriDayMonth}</div>
        <div>{hijriYear}</div>
      </div>
    </div>
  );
}
