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

export type AppSettings = {
  iqamah: IqamahSettings;
  poster: PosterSettings;
};
