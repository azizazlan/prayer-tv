import { createSignal } from "solid-js";
import type { Prayer } from "../prayers";
import { formatHMS, timeToDate } from "../utils/time";

export type Phase = "AZAN" | "IQAMAH" | "POST_IQAMAH" | "BLACKOUT";

export const IQAMAH_DURATION = 15 * 60 * 1000;
export const IQAMAH_IMAGE_DURATION = 10 * 1000;
export const POST_IQAMAH_DURATION = 15 * 1000;
export const BLACKOUT_DURATION = 10 * 60 * 1000;

export function useTimer(imageCount = 14) {
  const [prayers, setPrayers] = createSignal<Prayer[]>([]);
  const [phase, setPhase] = createSignal<Phase>("AZAN");
  const [countdown, setCountdown] = createSignal("00:00:00");
  const [imageIndex, setImageIndex] = createSignal(0);

  let timer: number | undefined;
  let iqamahEnd: Date | null = null;
  let postIqamahEnd: Date | null = null;
  let blackoutEnd: Date | null = null;
  let iqamahImageEnd: Date | null = null;

  const filteredPrayers = () =>
    prayers().filter(p => p.en !== "Syuruk");

  const nextPrayer = () => {
    const now = new Date();
    const fp = filteredPrayers();
    return fp.find(p => timeToDate(p.time) > now) ?? fp[0];
  };

  const startTimer = () => {
    stopTimer();

    timer = window.setInterval(() => {
      if (!prayers().length) return;

      const now = new Date();
      const fp = filteredPrayers();

      const nextIndex = fp.findIndex(p => timeToDate(p.time) > now);
      const isTomorrow = nextIndex === 0 && timeToDate(fp[0].time) <= now;

      const nextPrayerTime = timeToDate(
        fp[nextIndex >= 0 ? nextIndex : 0].time,
        isTomorrow ? 1 : 0
      );

      switch (phase()) {
        case "AZAN": {
          const diff = nextPrayerTime.getTime() - now.getTime();
          if (diff <= 0) {
            setPhase("IQAMAH");
            iqamahEnd = null;
          } else {
            setCountdown(formatHMS(diff));
          }
          break;
        }

        case "IQAMAH": {
          if (!iqamahEnd) {
            iqamahEnd = new Date(now.getTime() + IQAMAH_DURATION);
            iqamahImageEnd = new Date(now.getTime() + IQAMAH_IMAGE_DURATION);
          }

          if (iqamahImageEnd && now >= iqamahImageEnd) {
            setImageIndex(i => (i + 1) % imageCount);
            iqamahImageEnd = new Date(now.getTime() + IQAMAH_IMAGE_DURATION);
          }

          const remaining = iqamahEnd.getTime() - now.getTime();
          if (remaining <= 0) {
            iqamahEnd = null;
            iqamahImageEnd = null;
            postIqamahEnd = null;
            setPhase("POST_IQAMAH");
          } else {
            setCountdown(formatHMS(remaining));
          }
          break;
        }

        case "POST_IQAMAH": {
          if (!postIqamahEnd)
            postIqamahEnd = new Date(now.getTime() + POST_IQAMAH_DURATION);

          const remaining = postIqamahEnd.getTime() - now.getTime();
          setCountdown(formatHMS(remaining));

          if (remaining <= 0) {
            postIqamahEnd = null;
            blackoutEnd = null;
            setPhase("BLACKOUT");
          }
          break;
        }

        case "BLACKOUT": {
          if (!blackoutEnd)
            blackoutEnd = new Date(now.getTime() + BLACKOUT_DURATION);

          const remaining = blackoutEnd.getTime() - now.getTime();
          setCountdown(formatHMS(remaining));

          if (remaining <= 0) {
            blackoutEnd = null;
            setPhase("AZAN");
          }
          break;
        }
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };

  const resetTimer = () => {
    stopTimer();
    iqamahEnd = postIqamahEnd = blackoutEnd = iqamahImageEnd = null;
    setCountdown("00:00:00");
    setImageIndex(0);
    setPhase("AZAN");
  };

  return {
    prayers,
    setPrayers,
    phase,
    countdown,
    imageIndex,
    filteredPrayers,
    nextPrayer,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
