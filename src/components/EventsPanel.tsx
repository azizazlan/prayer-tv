import { createMemo, For } from "solid-js";
import type { AppEvent } from "../services/events"; // adjust path if needed

type AppEventWithDate = AppEvent & {
  dateObj: Date;
};

function parseCsvDateToDate(value: string): Date | null {
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

  return new Date(Number(year), monthIndex, Number(day));
}

// Helpers
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isTomorrow(a: Date, today: Date) {
  const t = new Date(today);
  t.setDate(t.getDate() + 1);
  return isSameDay(a, t);
}

export default function EventsPanel(props: { events: AppEvent[] }) {
  const grouped = createMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const map: {
      today: AppEventWithDate[];
      tomorrow: AppEventWithDate[];
      upcoming: AppEventWithDate[];
    } = {
      today: [],
      tomorrow: [],
      upcoming: [],
    };

    for (const e of props.events) {
      const dateObj = parseCsvDateToDate(e.date);
      if (!dateObj) continue;

      dateObj.setHours(0, 0, 0, 0);

      if (isSameDay(dateObj, today)) {
        map.today.push({ ...e, dateObj });
      } else if (isTomorrow(dateObj, today)) {
        map.tomorrow.push({ ...e, dateObj });
      } else {
        map.upcoming.push({ ...e, dateObj });
      }
    }

    // sort each group
    (Object.keys(map) as (keyof typeof map)[]).forEach((key) => {
      map[key].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    });

    return map;
  });

  return (
    <div>
      {/* TODAY */}
      <Section title="Today" events={grouped().today} />

      {/* TOMORROW */}
      <Section title="Tomorrow" events={grouped().tomorrow} />

      {/* UPCOMING */}
      <Section title="Upcoming" events={grouped().upcoming} />
    </div>
  );
}

// Optional child component (clean UI)
function Section(props: { title: string; events: AppEventWithDate[] }) {
  return (
    <div style={{ "margin-bottom": "1rem" }}>
      <h3>{props.title}</h3>

      <For each={props.events}>
        {(e) => (
          <div>
            <div>{e.title}</div>
            <div>
              {e.day} • {e.time}
            </div>
            <div>{e.speaker}</div>
          </div>
        )}
      </For>
    </div>
  );
}
