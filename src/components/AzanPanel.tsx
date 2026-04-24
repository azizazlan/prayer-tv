import type { Prayer } from "../prayers";
import HorizontalPrayersPanel from "./HorizontalPrayersPanel";

export default function AzanPanel(props: {
  prayer?: Prayer;
  countdown: string;
  filteredPrayers?: () => Prayer[];
  nextPrayer?: () => Prayer | undefined;
  lastPrayer?: () => Prayer | undefined;
}) {
  const isUrgent = () => {
    if (!props.countdown) return false;
    const [h, m, s] = props.countdown.split(":").map(Number);
    return h * 3600 + m * 60 + s <= 180;
  };

  return (
    <div class="flex flex-col w-full h-full items-center justify-start">
      {/* Main content takes remaining space */}
      <div class="flex-1 flex flex-col items-center justify-center">
        {/* Arabic prayer */}
        <div class="text-[7.5vh] font-bold text-center" dir="rtl">
          الأذان القادم {props.prayer?.ar}
        </div>

        {/* English */}
        <div class="text-[7.5vh] font-bold">AZAN {props.prayer?.en}</div>

        {/* countdown */}
        <div
          class={`countdown text-[12.5vh] font-bold ${isUrgent() ? "countdown--urgent" : ""}`}
        >
          {props.countdown}
        </div>
      </div>

      {/* bottom panel */}
      <HorizontalPrayersPanel
        filteredPrayers={props.filteredPrayers}
        nextPrayer={props.nextPrayer}
      />
    </div>
  );
}
