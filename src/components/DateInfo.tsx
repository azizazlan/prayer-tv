export default function DateInfo() {
  const now = new Date();

  // Gregorian
  const gregorianMonth = now.toLocaleString("ms-MY", { month: "long" });
  const gregorianYear = now.getFullYear();
  const weekdayEn = now.toLocaleDateString("ms-MY", { weekday: "long" });

  // Hijri (Arabic)
  const hijriDayMonthFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
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
        "line-height": "1.2em",
        "margin-bottom": "3.0vh",
      }}
    >
      {/* Gregorian */}
      <div>
        <div>{gregorianMonth}</div>
        <div>{gregorianYear}</div>
      </div>

      {/* Weekday + Date */}
      <div style={{ "text-align": "center" }}>
        {/* Weekday */}
        <div style={{ "text-align": "center" }}>
          <div style={{ "font-family": "Cairo", "font-weight": "900" }}>{weekdayAr}</div>
          <div>
            {weekdayEn}
          </div>
        </div>

      </div>

      {/* Hijri */}
      <div style={{ "text-align": "right", direction: "rtl", "font-size": "3.9vh", "font-weight": "900", "font-family": "Cairo" }}>
        <div>{hijriDayMonth}</div>
        <div>{hijriYear}</div>
      </div>
    </div>
  );
}
