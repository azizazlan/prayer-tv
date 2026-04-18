export type AppEvent = {
  date: string; // e.g. "2026-04-01"
  day: string;
  time: string;
  title: string;
  desc: string;
  speaker: string;
  speakerCode: string;
};

async function loadEvents(): Promise<AppEvent[]> {
  try {
    const res = await fetch("/data/events.json");
    const data: AppEvent[] = await res.json();
    return data;
  } catch (e) {
    console.error("Failed to load events.json", e);
    return [];
  }
}

export async function loadTodayEvents(): Promise<AppEvent[]> {
  const events = await loadEvents();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter((e) => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate.getTime() === today.getTime();
  });
}

export async function loadWeeklyEvents(): Promise<AppEvent[]> {
  const events = await loadEvents();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const day = today.getDay(); // Sun = 0
  const diffToMonday = (day === 0 ? -6 : 1) - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(0, 0, 0, 0);

  return events.filter((e) => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate >= monday && eventDate <= sunday;
  });
}
