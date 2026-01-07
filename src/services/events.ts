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

function isWithinNext7Days(csvDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setDate(today.getDate() + 4);

  const [d, m, y] = csvDate.split("/");
  const date = new Date(Number(y), Number(m) - 1, Number(d));

  return date >= today && date <= end;
}

export async function loadWeeklyEvents(): Promise<Event[]> {
  try {
    const res = await fetch("/data/events.csv");
    const text = await res.text();

    const lines = text.trim().split("\n");
    const events: Event[] = [];

    // TODAY → find Monday & Sunday
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = today.getDay(); // Sun=0
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // skip CSV header
    for (let i = 1; i < lines.length; i++) {
      const [dateStr, dayName, time, title, desc, speaker, speakerCode] =
        lines[i].split(",");

      const csvDate = parseCsvDate(dateStr); // DD/MM/YYYY
      if (!csvDate) continue;

      const [d, m, y] = csvDate.split("/");
      const eventDate = new Date(Number(y), Number(m) - 1, Number(d));
      eventDate.setHours(0, 0, 0, 0);

      // ✅ keep MON–SUN only
      if (eventDate < monday || eventDate > sunday) continue;

      events.push({
        date: dateStr.trim(),   // keep "29-Dec-2025"
        day: dayName.trim(),    // Isnin / Selasa / ...
        time: time?.trim(),
        title: title?.trim(),
        desc: desc?.trim(),
        speaker: speaker?.trim(),
        speakerCode: speakerCode?.trim(),
      });
    }

    return events;
  } catch (e) {
    console.error("Failed to load weekly events", e);
    return [];
  }
}

