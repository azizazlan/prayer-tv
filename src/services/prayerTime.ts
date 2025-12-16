export const prayers = [
  { en: "Subuh", ar: "الفجر", time: "05:47" },
  { en: "Shuruk", ar: "الشروق", time: "الشروق", time: "07:01" },
  { en: "Zuhur", ar: "الظهر", time: "13:00" },
  { en: "Asar", ar: "العصر", time: "16:24" },
  { en: "Maghrib", ar: "المغرب", time: "19:00" },
  { en: "Isha", ar: "العشاء", time: "20:11" },
];

// Convert "HH:mm" string to Date object for today
function timeToDate(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

// Get the next upcoming prayer
export function getNextPrayer(): { en: string; ar: string; at: Date } {
  const now = new Date();

  for (let i = 0; i < prayers.length; i++) {
    const prayerTime = timeToDate(prayers[i].time);
    if (prayerTime > now) {
      return { ...prayers[i], at: prayerTime };
    }
  }

  // All prayers passed → next is tomorrow Subuh
  const tomorrowSubuh = timeToDate(prayers[0].time);
  tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
  return { ...prayers[0], at: tomorrowSubuh };
}
