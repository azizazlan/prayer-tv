import {
  onMount,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import DateInfo from "../components/DateInfo";
import PrayerRow from "../components/PrayerRow";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import MediaPanel from "../components/MediaPanel";
import images from "../assets/images";
import { useTimer } from "../services/timer";
import { loadTodayPrayers } from "../services/takwim";
import { loadWeeklyEvents } from "../services/events";
import { timeToDate } from "../utils/time";
import "../styles/home.css";

export type DisplayMode = "PRAYERS" | "EVENTS" | "HADITHS" | "POSTER";
//| "COLLECTIONS";
export const DisplayMode = {
  PRAYERS: "PRAYERS",
  EVENTS: "EVENTS",
  HADITHS: "HADITHS",
  POSTER: "POSTER",
} as const;

const DISPLAY_MODE_DURATION_MS = 35000;

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
      // "SLIDE_1",
      // "SLIDE_2",
      // "SLIDE_3",
      "EVENTS",
      "HADITHS",
      "POSTER",
      // "COLLECTIONS",
    ];

    const id = setInterval(() => {
      setDisplayMode((current) => {
        const available = ORDER.filter((m) => {
          if (m === "PRAYERS") return true;
          // if (m === "SLIDE_1") return true;
          // if (m === "SLIDE_2") return true;
          // if (m === "SLIDE_3") return true;
          if (m === "HADITHS") return true;
          if (m === "EVENTS") return true;
          if (m === "POSTER") return !isNearNextPrayer();
          // if (m === "COLLECTIONS") return true;
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

  const isNearNextPrayer = createMemo(() => {
    const next = nextPrayer();
    if (!next) return false;

    const now = timer.now().getTime();
    const nextTime = timeToDate(next.time).getTime();

    const diff = nextTime - now;

    return diff <= 3 * 60 * 1000; // 3 minutes
  });

  return (
    <div>
      <Show when={displayMode() === DisplayMode.POSTER && !isNearNextPrayer()}>
        <MediaPanel imageUrl={"/poster/poster_wide.jpeg"} />
      </Show>
      <Show when={displayMode() !== DisplayMode.POSTER}>
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
            weeklyEvents={weeklyEvents()}
            displayMode={displayMode()}
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
      </Show>
    </div>
  );
}
