export type AppEventItem = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  desc?: string;
  speaker?: string;
  speakerCode?: string;
};
