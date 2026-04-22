//src/types/settings.ts
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
  image: string | null;
};

export type MiscSettings = {
  displayModeSecs: number;
};

export type AppSettings = {
  iqamah: IqamahSettings;
  poster: PosterSettings;
  misc: MiscSettings;
};

export type TabKey = "iqamah" | "events" | "poster" | "prayer-times" | "misc";
