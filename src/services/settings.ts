// src/services/settings.ts
import { createSignal } from "solid-js";

const STORAGE_KEY = "iqamah-settings";

export type IqamahSettings = {
  alfajr: number;
  dhuhr: number;
  alasr: number;
  maghrib: number;
  alisha: number;
};

export type AppSettings = {
  iqamah: IqamahSettings;
  poster: string | null;
};

function loadSettings(): AppSettings {
  const raw = localStorage.getItem(STORAGE_KEY);

  const DEFAULT: AppSettings = {
    iqamah: {
      alfajr: 18,
      dhuhr: 10,
      alasr: 10,
      maghrib: 10,
      alisha: 10,
    },
    poster: {
      portraitEnabled: true,
      landscapeEnabled: true,
      image: null,
    },
  };

  if (raw) {
    try {
      const parsed = JSON.parse(raw);

      return {
        ...DEFAULT,
        ...parsed,
        iqamah: {
          ...DEFAULT.iqamah,
          ...(parsed.iqamah || {}),
        },
        poster: {
          ...DEFAULT.poster,
          ...(parsed.poster || {}),
        },
      };
    } catch {}
  }

  return DEFAULT;
}
const [settings, setSettings] = createSignal<AppSettings>(loadSettings());

export const useSettings = settings;

export function saveSettings(v: AppSettings) {
  setSettings(v);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
}

// helpers
const msToMin = (ms: number) => Math.round(ms / 60000);
const minToMs = (min: number) => min * 60000;

export function getIqamahDuration(prayer: keyof IqamahSettings) {
  return minToMs(settings().iqamah[prayer]);
}

export function getIqamahDurationInMins(prayer: keyof IqamahSettings) {
  return msToMin(getIqamahDuration(prayer));
}
