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
