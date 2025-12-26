import { onMount, For, Show, Switch, Match, createMemo } from "solid-js";
import { Transition } from "solid-transition-group";
import Clock from "../components/Clock";
import DateInfo from "../components/DateInfo";
import PrayerRow from "../components/PrayerRow";
import DuhaRow from "../components/DuhaRow";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import DevPanel from "../components/DevPanel";
import images from "../assets/images";
import {
  useTimer,
} from "../services/timer";
import { loadTodayPrayers } from "../services/takwim";
import { timeToDate, msToMinutes } from "../utils/time";

import "../styles/home.css";

const devMode =
  import.meta.env.VITE_DEV_MODE === "true";

export default function Home() {
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

  return (
    <div class="screen">
      <LeftPanel
        phase={timer.phase()}
        now={timer.now}
        filteredPrayers={timer.filteredPrayers}
        nextPrayer={nextPrayer}
        duhaDate={duhaDate}
        syurukDate={syurukDate}
        images={images}
        imageIndex={timer.imageIndex}
      />
      <RightPanel
        phase={timer.phase()}
        countdown={timer.countdown()}
        prayer={nextPrayer()}
        lastPrayer={lastPrayer()}
        filteredPrayers={timer.filteredPrayers}
      />
    </div>
  );

}
