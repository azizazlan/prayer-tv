import type { AppEventItem } from "../types/app-event";

type EventGroups = {
  today: AppEventItem[];
  tomorrow: AppEventItem[];
};

export async function loadTodayAndTomorrow(): Promise<EventGroups> {
  const res = await fetch("/data/events.json");
  const events: AppEventItem[] = await res.json();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

  const parse = (d: string) => {
    const [day, mon, year] = d.split("-");

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

    return new Date(Number(year), months[mon], Number(day));
  };

  const todayEvents: AppEventItem[] = [];
  const tomorrowEvents: AppEventItem[] = [];

  for (const e of events) {
    const d = parse(e.date);
    d.setHours(0, 0, 0, 0);

    if (isSameDay(d, today)) {
      todayEvents.push(e);
    } else if (isSameDay(d, tomorrow)) {
      tomorrowEvents.push(e);
    }
  }

  return {
    today: todayEvents,
    tomorrow: tomorrowEvents,
  };
}
