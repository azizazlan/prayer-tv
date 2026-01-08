import type { Accessor } from "solid-js";

export default function DateInfo(props: { now: Accessor<Date>, showOneLine?}) {
  const now = () => props.now();

  // Gregorian
  const gregorianDay = now().getDate();
  const gregorianMonth = now().toLocaleString("ms-MY", { month: "long" });
  const gregorianYear = now().getFullYear();
  const weekdayEn = now().toLocaleDateString("ms-MY", { weekday: "long" });

  // Hijri (Arabic)
  const hijriDayMonthFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    month: "long",
  });

  const hijriYearFormatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    year: "numeric",
  });
  const hijriDay = () =>
    new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
    }).format(now());
  const hijriDayMonth = hijriDayMonthFormatter.format(now());
  const hijriYear = hijriYearFormatter.format(now());

  // Arabic weekday
  const weekdayAr = new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
  }).format(now());

  if (props.showOneLine) {
    return (
      <div
        style={{
          display: "flex",
          "justify-content": "space-between",
          "font-size": "3.7vh",
          "font-weight": "bold",
          "line-height": "1.2em",
          "padding-top": "1.0vh",
          "padding-bottom": "0.3vh",
          "padding-left": "2.5vh",
          "padding-right": "6.5vh",
          "border-bottom": "1px solid #5C3A00"
        }}
      >
        {/* Gregorian */}
        <div style={{ "display": "flex", "flex-direction": "row" }}>
          <div style={{ "font-size": "4.8vh", "font-weight": "900", "font-family": "'Digital-7', sans-serif", color: "darkgreen", "margin-right": "3vh" }}>
            {now().toLocaleTimeString([], { hour12: false })}
          </div>
          <div style={{ "font-size": "4.5vh", "font-weight": "bold", "font-family": "'Digital-7', sans-serif", }}>
            {weekdayEn} {gregorianDay} {gregorianMonth} {gregorianYear}
          </div>
        </div>

        {/* Hijri */}
        <div style={{ "text-align": "right", direction: "rtl", "font-size": "4.7vh", "font-weight": "900", "font-family": "Cairo" }}>
          <div> {hijriYear} {hijriDayMonth} {hijriDay}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
        padding: "0 3vw",
        "font-size": "3.7vh",
        "font-weight": "bold",
        "line-height": "1.2em",
        "margin-bottom": "1.0vh",
      }}
    >
      {/* Gregorian */}
      <div style={{ "text-align": "center", "line-height": "1.1em", "font-size": "4.3vh" }}>
        <div>{gregorianMonth}</div>
        <div>{gregorianYear}</div>
      </div>

      {/* Weekday + Date */}
      {/* Weekday */}
      <div style={{ "text-align": "center", "line-height": "1.3em", }}>
        <div style={{ "font-size": "4.5vh", "font-family": "Cairo", "font-weight": "900" }}>
          {weekdayAr}
        </div>
        <div style={{ "font-size": "4.7vh" }}>
          {weekdayEn}
        </div>

      </div>

      {/* Hijri */}
      <div style={{ "line-height": "1.2em", "text-align": "right", "font-size": "4.5vh", "font-weight": "900", }}>
        <div style={{ "font-family": "Cairo" }}>
          {hijriDayMonth}
        </div>
        <div style={{ "font-family": "Cairo" }}>
          {hijriYear}
        </div>
      </div>
    </div>
  );
}
