// src/services/settings.ts

import { createSignal } from "solid-js";
import type { IqamahSettings } from "../components/SettingsModal";

const STORAGE_KEY = "iqamah-settings";

// const [settings, setSettings] = createSignal<IqamahSettings>({
//   alfajr: 18,
//   dhuhr: 10,
//   alasr: 10,
//   maghrib: 10,
//   alisha: 10,
// });

const [settings, setSettings] = createSignal<IqamahSettings>(loadSettings());

function loadSettings(): IqamahSettings {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fallback if corrupted
    }
  }

  return {
    alfajr: 18,
    dhuhr: 10,
    alasr: 10,
    maghrib: 10,
    alisha: 10,
  };
}

export const useSettings = settings; // 👈 accessor (correct)
// export const saveSettings = (v: IqamahSettings) => setSettings(v);
export function saveSettings(v: IqamahSettings) {
  setSettings(v);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
}

// helper
const msToMin = (ms: number) => Math.round(ms / 60000);
const minToMs = (min: number) => min * 60000;

// helper for your timer logic (returns ms)
export function getIqamahDuration(prayer: keyof IqamahSettings) {
  return minToMs(settings()[prayer]);
}

export function getIqamahDurationInMins(prayer: keyof IqamahSettings) {
  return msToMin(getIqamahDuration(prayer));
}
