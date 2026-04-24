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
import SettingsModal from "../components/settings/SettingsModal";
import { useTimer } from "../services/timer";
import { loadTodayPrayers } from "../services/takwim";
import { timeToDate } from "../utils/time";
import { unlockAudio } from "../App";
import { useSettings, saveSettings } from "../services/settings";

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

export default function Home() {
  const [openSettings, setOpenSettings] = createSignal<boolean>(false);
  const [isaudioUnlocked, setIsaudioUnlocked] = createSignal<boolean>(false);
  const [displayMode, setDisplayMode] = createSignal<DisplayMode>("PRAYERS");
  const timer = useTimer();

  const settings = useSettings;

  const imgLandscapePath = () => {
    const s = settings();
    return s.poster?.imageLandscape ?? "";
  };

  const imgLandscape = createMemo(() => imgLandscapePath());

  const isPortraitEnabled = () => {
    const s = settings();
    return s.poster?.portraitEnabled ?? false;
  };

  const isLandscapeEnabled = () => {
    const s = settings();
    return s.poster?.landscapeEnabled ?? false;
  };

  const displayModeSecs = () => {
    const s = settings();
    return s.misc?.displayModeSecs ?? 30;
  };

  const displaySecs = createMemo(() => displayModeSecs());

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

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

  createEffect(() => {
    const secs = displayModeSecs(); // ✅ reactive dependency

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
          if (m === "POSTER") return isPortraitEnabled();
          if (m === "BLACKOUT") return timer.phase() === "BLACKOUT";
          if (m === "HADITHS") return true;
          if (m === "EVENTS") return true;
          if (m === "LANDSCAPE_POSTER") {
            return !isNearNextPrayer() && isLandscapeEnabled();
          }
          return false;
        });

        const idx = available.indexOf(current);
        return available[(idx + 1) % available.length];
      });
    }, secs * 1000);

    onCleanup(() => clearInterval(id)); // ✅ clears old interval before re-running
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

  // createEffect(() => {
  //   console.log(`DisplayMode : ${displayMode()} Phase : ${timer.phase()}`);
  // });

  return (
    <div class="flex w-full h-screen bg-black text-white">
      {/* SETTINGS PANEL (top overlay) */}
      <div class="absolute top-2 right-3 flex items-center gap-2 opacity-60 z-50">
        <div class="mr-2">{displaySecs()} secs</div>

        <button onClick={handleOpenSettings} class="hover:opacity-100">
          ⚙️
        </button>

        <Show when={!isaudioUnlocked()}>
          <button onClick={handleUnlockAudio} class="hover:opacity-100">
            🔔
          </button>
        </Show>
      </div>

      {/* MODAL */}
      <Show when={openSettings()}>
        <SettingsModal
          open={openSettings()}
          initialValues={useSettings()}
          onClose={() => setOpenSettings(false)}
          onSave={(values) => saveSettings(values)}
        />
      </Show>

      <Switch
        fallback={
          <div class="w-full h-full flex items-center justify-center bg-black text-white">
            X
          </div>
        }
      >
        {/* BLACKOUT */}
        <Match when={displayMode() === "BLACKOUT"}>
          <div class="w-full h-full bg-black" />
        </Match>

        {/* LANDSCAPE POSTER */}
        <Match
          when={
            displayMode() === DisplayMode.LANDSCAPE_POSTER &&
            isLandscapeEnabled() &&
            !isNearNextPrayer() &&
            timer.phase() === "AZAN" &&
            timer.phase() !== "BLACKOUT"
          }
        >
          <MediaPanel imageUrl={imgLandscape()} isLeftPoster={false} />
        </Match>

        {/* MAIN SPLIT VIEW */}
        <Match
          when={
            displayMode() === DisplayMode.PRAYERS ||
            displayMode() === DisplayMode.POSTER ||
            displayMode() === DisplayMode.LANDSCAPE_POSTER ||
            displayMode() === DisplayMode.HADITHS ||
            displayMode() === DisplayMode.EVENTS
          }
        >
          <div class="flex w-full h-full">
            {/* LEFT */}
            <div class="flex-1 h-full">
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
            </div>

            {/* DIVIDER (optional) */}
            <div class="w-px bg-gray-700" />

            {/* RIGHT */}
            <div class="flex-1 h-full">
              <RightPanel
                phase={timer.phase()}
                countdown={timer.countdown()}
                prayer={nextPrayer()}
                lastPrayer={lastPrayer}
                nextPrayer={nextPrayer}
                filteredPrayers={timer.filteredPrayers}
              />
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
