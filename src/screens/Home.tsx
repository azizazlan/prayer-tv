import {
  onMount,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Switch,
  Match,
  Show,
} from "solid-js";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import MediaPanel from "../components/MediaPanel";
import { useTimer } from "../services/timer";
import { loadTodayPrayers } from "../services/takwim";
import { timeToDate } from "../utils/time";
import "../styles/home.css";
import { unlockAudio } from "../App";

const ACTIVATE_LANDSCAPE_POSTER =
  import.meta.env.VITE_ACTIVATE_LANDSCAPE_POSTER === "true";

export type DisplayMode =
  | "BLACKOUT"
  | "PRAYERS"
  | "EVENTS"
  | "HADITHS"
  | "POSTER"
  | "LANDSCAPE_POSTER";
export const DisplayMode = {
  PRAYERS: "PRAYERS",
  EVENTS: "EVENTS",
  HADITHS: "HADITHS",
  POSTER: "POSTER",
  LANDSCAPE_POSTER: "LANDSCAPE_POSTER",
  BLACKOUT: "BLACKOUT",
} as const;

const DISPLAY_MODE_DURATION_MS = 30000;

export default function Home() {
  const [isaudioUnlocked, setIsaudioUnlocked] = createSignal<boolean>(false);
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>("PRAYERS");
  const timer = useTimer();

  const handleUnlockAudio = async () => {
    setIsaudioUnlocked(await unlockAudio());
  };

  // --- Load prayers and start timer ---
  onMount(async () => {
    const todayPrayers = await loadTodayPrayers();
    if (todayPrayers) {
      timer.setPrayers(todayPrayers);
      timer.startTimer();
    }
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
      "HADITHS",
      "POSTER",
      "LANDSCAPE_POSTER",
      "BLACKOUT",
    ];

    const id = setInterval(() => {
      if (timer.phase() === "BLACKOUT") {
        setDisplayMode("BLACKOUT");
        return;
      }

      setDisplayMode((current) => {
        const available = ORDER.filter((m) => {
          if (m === "PRAYERS") return true;
          if (m === "POSTER") return true;
          if (m === "BLACKOUT") {
            return timer.phase() === "BLACKOUT";
          }
          if (m === "HADITHS") return true;
          if (m === "EVENTS") return true;
          if (m === "LANDSCAPE_POSTER") {
            return !isNearNextPrayer() && ACTIVATE_LANDSCAPE_POSTER;
          }
        });

        const idx = available.indexOf(current);
        return available[(idx + 1) % available.length];
      });
    }, DISPLAY_MODE_DURATION_MS);

    onCleanup(() => clearInterval(id));
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
    if (!syuruk) return undefined;
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

    return Math.abs(diff) <= 3 * 60 * 1000; // 3 minutes
  });

  createEffect(() => {
    console.log(`DisplayMode : ${displayMode()} Phase : ${timer.phase()}`);
  });

  return (
    <div class="screen">
      <Show when={!isaudioUnlocked()}>
        <div style={{ "background-color": "orange" }}>
          <button onClick={() => handleUnlockAudio()}>
            AUDIO {isaudioUnlocked().toString()}
          </button>
        </div>
      </Show>

      <Switch
        fallback={
          <div
            style={{
              width: "100%",
              height: "100vh",
              background: "black",
              color: "white",
            }}
          >
            X
          </div>
        }
      >
        <Match when={displayMode() === "BLACKOUT"}>
          <div
            style={{
              width: "100%",
              height: "100vh",
              background: "black",
              color: "white",
            }}
          >
            .
          </div>
        </Match>

        <Match
          when={
            displayMode() === DisplayMode.LANDSCAPE_POSTER &&
            ACTIVATE_LANDSCAPE_POSTER &&
            !isNearNextPrayer() &&
            timer.phase() === "AZAN" &&
            timer.phase() !== "BLACKOUT"
          }
        >
          <MediaPanel
            imageUrl={"/poster/poster_wide.jpeg"}
            isLeftPoster={false}
          />
        </Match>

        <Match
          when={
            displayMode() === DisplayMode.PRAYERS ||
            displayMode() === DisplayMode.POSTER ||
            displayMode() === DisplayMode.LANDSCAPE_POSTER ||
            displayMode() === DisplayMode.HADITHS ||
            displayMode() === DisplayMode.EVENTS ||
            displayMode() === DisplayMode.BLACKOUT
          }
        >
          <div class="screen">
            <LeftPanel
              phase={timer.phase()}
              now={timer.now}
              filteredPrayers={timer.filteredPrayers}
              nextPrayer={nextPrayer}
              lastPrayer={lastPrayer}
              duhaDate={duhaDate}
              syurukDate={syurukDate}
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
        </Match>
      </Switch>
    </div>
  );
}
