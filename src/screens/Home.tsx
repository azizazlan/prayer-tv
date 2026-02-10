import {
  onMount,
  Show,
  Switch,
  Match,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerRow from "../components/PrayerRow";
import DuhaRow from "../components/DuhaRow";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import HorizontalPrayersPanel from "../components/HorizontalPrayersPanel";
import MediaPanel from "../components/MediaPanel";
import images from "../assets/images";
import { useTimer } from "../services/timer";
import { loadTodayPrayers } from "../services/takwim";
import { loadWeeklyEvents } from "../services/events";
import type { Event } from "../event";
import { timeToDate, msToMinutes } from "../utils/time";
import "../styles/home.css";

const devMode = import.meta.env.VITE_DEV_MODE === "true";

export type DisplayMode =
  | "EVENTS"
  | "PRAYERS"
  | "COLLECTIONS"
  | "HIJRI_DAY_COUNTDOWN"
  | "POSTER";
const DISPLAY_MODE_DURATION_MS = 45000;
//const DISPLAY_MODE_DURATION_MS = 10000;

const POSTER_PATH = import.meta.env.VITE_WIDE_POSTER_PATH as string | undefined;
const POSTER_EXPIRE = import.meta.env.VITE_POSTER_EXPIRE as
  | "ALFAJR"
  | "DUHUR"
  | "ALASR"
  | "MAGHRIB"
  | "ALISHA"
  | undefined;

export default function Home() {
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>("PRAYERS");
  const [weeklyEvents, setWeeklyEvents] = createSignal<Event[]>([]);
  const timer = useTimer();

  // --- Load prayers and start timer ---
  onMount(async () => {
    const todayPrayers = await loadTodayPrayers();
    if (todayPrayers) {
      timer.setPrayers(todayPrayers);
      timer.startTimer();
    }

    const weekly = await loadWeeklyEvents();
    setWeeklyEvents(weekly ?? []);
  });

  onMount(async () => {
    const todayPrayers = await loadTodayPrayers();
    if (!todayPrayers) {
      console.warn("No prayers found for today");
      return;
    }
    timer.setPrayers(todayPrayers);
    timer.startTimer();
  });

  onMount(() => {
    const ORDER: DisplayMode[] = [
      "PRAYERS",
      "EVENTS",
      "COLLECTIONS",
      "HIJRI_DAY_COUNTDOWN",
      "POSTER",
    ];

    const id = setInterval(() => {
      setDisplayMode((current) => {
        const available = ORDER.filter((m) => {
          if (m === "EVENTS") return weeklyEvents().length > 0;
          return true; // PRAYERS always allowed
          if (m === "COLLECTIONS") return true;
          if (m === "HIJRI_DAY_COUNTDOWN") return true;
          if (m === "POSTER") return true;
        });

        const idx = available.indexOf(current);
        return available[(idx + 1) % available.length];
      });
    }, DISPLAY_MODE_DURATION_MS);

    onCleanup(() => clearInterval(id));
  });
  const dateKey = () => timer.now().toDateString();
  let lastDateKey: string | undefined;

  createEffect(() => {
    const key = dateKey(); // This ensure the code below rerun on midnight or date change

    if (key === lastDateKey) return;
    lastDateKey = key;

    (async () => {
      const weekly = await loadWeeklyEvents();
      // console.log(weekly);
      setWeeklyEvents(weekly ?? []);
    })();
  });

  // Memoized Syuruk prayer
  const syurukPrayer = createMemo(() =>
    timer.prayers().find((p) => p.en === "Syuruk"),
  );

  const syurukDate = createMemo(() => {
    const s = syurukPrayer();
    return s ? timeToDate(s.time) : undefined;
  });

  // Duha date (20 min after Syuruk)
  const duhaDate = createMemo(() => {
    const syuruk = syurukPrayer();
    if (!syuruk) return null;
    return new Date(timeToDate(syuruk.time).getTime() + 20 * 60 * 1000);
  });

  // --- Memoized prayers ---
  const nextPrayer = createMemo(() => timer.nextPrayer());
  const lastPrayer = createMemo(() => timer.lastPrayer());

  return (
    <div class="screen">
      <LeftPanel
        phase={timer.phase()}
        now={timer.now}
        filteredPrayers={timer.filteredPrayers}
        nextPrayer={nextPrayer}
        lastPrayer={lastPrayer}
        duhaDate={duhaDate}
        syurukDate={syurukDate}
        images={images}
        imageIndex={timer.imageIndex}
        displayMode={displayMode()}
        weeklyEvents={weeklyEvents()}
        canShowWeeklyEvents={canShowWeeklyEvents()}
      />
      <RightPanel
        phase={timer.phase()}
        countdown={timer.countdown()}
        prayer={nextPrayer()}
        lastPrayer={lastPrayer}
        nextPrayer={nextPrayer}
        filteredPrayers={timer.filteredPrayers}
      />
    </div>
  );
}
