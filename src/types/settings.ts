//src/types/settings.ts

import type { AppEventItem } from "./app-event";

export type IqamahSettings = {
  alfajr: number;
  dhuhr: number;
  alasr: number;
  maghrib: number;
  alisha: number;
};

export type PosterSettings = {
  portraitEnabled: boolean;
  landscapeEnabled: boolean;
  imagePortrait: string | null;
  imageLandscape: string | null;
};

export type MiscSettings = {
  displayModeSecs: number;
};

export type AppSettings = {
  iqamah: IqamahSettings;
  poster: PosterSettings;
  misc: MiscSettings;
  events: AppEventItem[];
};

export type TabKey = "iqamah" | "events" | "poster" | "prayer-times" | "misc";
