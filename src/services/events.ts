export type AppEvent = {
  date: string;
  day: string;
  time: string;
  title: string;
  desc: string;
  speaker: string;
  speakerCode: string;
};

/**
 * Convert "29-Dec-2025" → "29/12/2025"
 */
function parseCsvDate(value: string): string | null {
  if (!value) return null;

  const [day, mon, year] = value.split("-");
  if (!day || !mon || !year) return null;

  const months: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const monthIndex = months[mon as keyof typeof months];
  if (monthIndex === undefined) return null;

  const d = new Date(Number(year), monthIndex, Number(day));
  return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
}

/**
 * Load today's events
 */
export async function loadTodayEvents(): Promise<AppEvent[]> {
  try {
    const res = await fetch("/data/events.csv");
    const text = await res.text();

    const today = new Date().toLocaleDateString("en-GB");
    const lines = text.trim().split("\n");

    const events: AppEvent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length < 7) continue;

      const [dateStr, day, time, title, desc, speaker, speakerCode] = cols;

      if (!dateStr) continue;

      const csvDate = parseCsvDate(dateStr);
      if (!csvDate) continue;

      if (csvDate === today) {
        events.push({
          date: dateStr.trim(),
          day: day?.trim() ?? "",
          time: time?.trim() ?? "",
          title: title?.trim() ?? "",
          desc: desc?.trim() ?? "",
          speaker: speaker?.trim() ?? "",
          speakerCode: speakerCode?.trim() ?? "",
        });
      }
    }

    return events;
  } catch (e) {
    console.error("Failed to load today events", e);
    return [];
  }
}

/**
 * Load events for current week (Mon–Sun)
 */
export async function loadWeeklyEvents(): Promise<AppEvent[]> {
  try {
    const res = await fetch("/data/events.csv");
    const text = await res.text();

    const lines = text.trim().split("\n");
    const events: AppEvent[] = [];

    // Normalize today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = today.getDay(); // Sun = 0
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length < 7) continue;

      const [dateStr, dayName, time, title, desc, speaker, speakerCode] = cols;

      if (!dateStr) continue;

      const csvDate = parseCsvDate(dateStr);
      if (!csvDate) continue;

      const [d, m, y] = csvDate.split("/");
      if (!d || !m || !y) continue;

      const eventDate = new Date(Number(y), Number(m) - 1, Number(d));
      eventDate.setHours(0, 0, 0, 0);

      // Keep only events within this week
      if (eventDate < monday || eventDate > sunday) continue;

      events.push({
        date: dateStr.trim() ?? "",
        day: dayName?.trim() ?? "",
        time: time?.trim() ?? "",
        title: title?.trim() ?? "",
        desc: desc?.trim() ?? "",
        speaker: speaker?.trim() ?? "",
        speakerCode: speakerCode?.trim() ?? "",
      });
    }

    return events;
  } catch (e) {
    console.error("Failed to load weekly events", e);
    return [];
  }
}
