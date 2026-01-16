import {
  onMount,
  Show,
  Switch,
  Match,
  createEffect,
  createMemo,
  createSignal,
  onCleanup
} from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerRow from "../components/PrayerRow";
import DuhaRow from "../components/DuhaRow";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import WeeklyEventsPanel from "../components/WeeklyEventsPanel";
import HorizontalPrayersPanel from "../components/HorizontalPrayersPanel";
import MediaPanel from "../components/MediaPanel";
import images from "../assets/images";
import {
  useTimer,
} from "../services/timer";
import { loadTodayPrayers } from "../services/takwim";
import { loadTodayEvents, loadWeeklyEvents } from "../services/events";
import type { Event } from "../event";
import { timeToDate, msToMinutes } from "../utils/time";
import "../styles/home.css";

const devMode =
  import.meta.env.VITE_DEV_MODE === "true";

export type DisplayMode = "EVENTS" | "PRAYERS";
const DISPLAY_MODE_DURATION_MS = 60000;

const POSTER_PATH = import.meta.env.VITE_WIDE_POSTER_PATH as string | undefined;
const POSTER_EXPIRE =
  import.meta.env.VITE_POSTER_EXPIRE as
  | "ALFAJR"
  | "DUHUR"
  | "ALASR"
  | "MAGHRIB"
  | "ALISHA"
  | undefined;

export default function Home() {

  const [displayMode, setDisplayMode] = createSignal<DisplayMode>("PRAYERS");
  const [todayEvents, setTodayEvents] = createSignal<Event[]>([]);
  const [weeklyEvents, setWeeklyEvents] = createSignal<Event[]>([]);
  const [showPoster, setShowPoster] = createSignal(false);

  const timer = useTimer();

  // Load today's prayers and start timer
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
      "WEEKLY_EVENTS",
      "EVENTS",
    ];

    const id = setInterval(() => {
      setDisplayMode(current => {
        const available = ORDER.filter(m => {
          if (m === "EVENTS") return todayEvents().length > 0;
          if (m === "WEEKLY_EVENTS") return weeklyEvents().length > 0;
          return true; // PRAYERS always allowed
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
      const today = await loadTodayEvents();
      const weekly = await loadWeeklyEvents();
      // console.log(weekly);
      setTodayEvents(today ?? []);
      setWeeklyEvents(weekly ?? []);
    })();
  });

  // Memoized Syuruk prayer
  const syurukPrayer = createMemo(() =>
    timer.prayers().find(p => p.en === "Syuruk")
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

  // Next prayer memo
  const nextPrayer = createMemo(() => timer.nextPrayer());
  const lastPrayer = createMemo(() => timer.lastPrayer());

  const canShowWeeklyEvents = createMemo(() => {
    const next = timer.nextPrayer();
    if (!next) return false;

    const now = timer.now();
    const nextTime = timeToDate(next.time);

    const diffMs = nextTime.getTime() - now.getTime();
    const diffMinutes = diffMs / 6000;

    const result = diffMinutes >= 3;
    // console.log(result);

    return result;
  });

  createEffect(() => {
    if (!POSTER_PATH || !POSTER_EXPIRE) return;

    setShowPoster(true)
    const currentPrayer = lastPrayer();
    if (!currentPrayer) return;

    console.log("Current prayer:", currentPrayer.en);
    console.log("Poster expire at:", POSTER_EXPIRE);

    // if (currentPrayer.en === POSTER_EXPIRE) {
    //   setShowPoster(false);
    // }
  });

  return (
    <div class="screen">
      <Switch>
        {/* Display weekly events */}
        <Match
          when={
            displayMode() === "WEEKLY_EVENTS"
            &&
            timer.phase() === "AZAN"
            &&
            canShowWeeklyEvents()
          }
        >
          <div class="weekly-events-container">
            <Transition
              name="fade"
              appear
              mode="out-in"
            >
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  width: "100vw",
                  height: "100vh",
                  "margin-top": "1.5vh",
                  "margin-right": "0vh",
                }}
              >
                <DateInfo now={timer.now} showOneLine={true} />

                {showPoster() && POSTER_PATH ? (
                  <MediaPanel imageUrl={POSTER_PATH} />
                ) : (
                  <>
                    <WeeklyEventsPanel events={weeklyEvents()} />
                    <div style={{ "flex-grow": 1 }} />
                    <HorizontalPrayersPanel
                      slimMode={true}
                      filteredPrayers={timer.filteredPrayers}
                      nextPrayer={nextPrayer}
                    />
                  </>
                )}
              </div>
            </Transition>
          </div>
        </Match>
        {/* Else display below */}
        <Match when={true}>
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
            todayEvents={todayEvents()}
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
        </Match>
      </Switch>
    </div>
  );
}
