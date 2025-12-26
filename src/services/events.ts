import type { Event } from "../event";

function parseCsvDate(value: string): string | null {
  const [day, mon, year] = value.split("-");
  if (!day || !mon || !year) return null;

  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3,
    May: 4, Jun: 5, Jul: 6, Aug: 7,
    Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const d = new Date(
    Number(year),
    months[mon],
    Number(day)
  );

  return d.toLocaleDateString("en-GB");
}


export async function loadTodayEvents(): Promise<Event[]> {
  try {
    const res = await fetch("/data/events.csv");
    const text = await res.text();

    const today = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY
    const lines = text.trim().split("\n");

    const events: Event[] = [];

    // skip CSV header
    for (let i = 1; i < lines.length; i++) {
      const [dateStr, day, time, title, desc, speaker, speakerCode] =
        lines[i].split(",");

      const csvDate = parseCsvDate(dateStr);
      if (!csvDate) continue;

      if (csvDate === today) {
        events.push({
          date: dateStr.trim(),
          day: day.trim(),
          time: time.trim(),
          title: title.trim(),
          desc: desc.trim(),
          speaker: speaker.trim(),
          speakerCode: speakerCode.trim(),
        });
      }
    }

    return events;
  } catch (e) {
    console.error("Failed to load events", e);
    return [];
  }
}
