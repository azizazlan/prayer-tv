import { fallbackPrayers } from "../data/fallbackPrayers";

type Prayer = {
  en: string;
  ar: string;
  time: string;
};

const PRAYER_META = [
  { en: "Subuh", ar: "الفجر", key: "subuh" },
  { en: "Shuruk", ar: "الشروق", key: "syuruk" },
  { en: "Zuhur", ar: "الظهر", key: "zohor" },
  { en: "Asar", ar: "العصر", key: "asar" },
  { en: "Maghrib", ar: "المغرب", key: "maghrib" },
  { en: "Isha", ar: "العشاء", key: "isyak" },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function parseCSV(text: string) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map(line => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h.trim()] = values[i]?.trim()));
    return row;
  });
}

export async function getTodaysPrayers(): Promise<Prayer[]> {
  try {
    const res = await fetch("/jadual_waktu_solat_JAKIM.csv");
    const csvText = await res.text();

    const rows = parseCSV(csvText);
    const today = rows.find(r => r.date === todayKey());

    if (!today) return fallbackPrayers;

    return PRAYER_META.map(p => ({
      en: p.en,
      ar: p.ar,
      time: today[p.key],
    }));
  } catch (e) {
    console.warn("Using fallback prayer times", e);
    return fallbackPrayers;
  }
}
