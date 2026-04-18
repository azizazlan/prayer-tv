export type AppEvent = {
  date: string; // "2026-04-01" or "01-Apr-2026" (pick one format and stay consistent)
  day: string; // "Rabu", "Khamis", etc.
  time: string; // "07:45 PM" or empty string ""
  title: string; // event title
  desc: string; // optional description
  speaker: string; // speaker name
  speakerCode: string; // short identifier (e.g. "azmi")
};
