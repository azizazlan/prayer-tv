import {
  createResource,
  createSignal,
  onMount,
  onCleanup,
  Show,
} from "solid-js";
import { loadTodayAndTomorrow } from "../services/events";

export default function EventsPanel() {
  const [data] = createResource(loadTodayAndTomorrow);

  const [mode, setMode] = createSignal<"today" | "tomorrow">("today");

  onMount(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev === "today" ? "tomorrow" : "today"));
    }, 10000); // 10 seconds

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="h-full bg-white">
      <Show when={data()}>
        {(d) => {
          const current = () =>
            mode() === "today" ? d().today[0] : d().tomorrow[0];

          return (
            <div class="text-center p-4">
              {/* Title (Hari Ini / Esok) */}
              <div class="text-[5vh] font-black text-black">
                {mode() === "today" ? "Hari Ini" : "Esok"}
              </div>

              {/* Event title */}
              <div class="text-[5vh] font-black text-green-800">
                {current()?.title}
              </div>

              {/* Speaker image (centered) */}
              {current().speakerCode && (
                <div class="flex justify-center my-4">
                  <img
                    class="w-[16vw] rounded-[1vw] object-cover"
                    src={`/data/speaker-imgs/${current().speakerCode}.png`}
                    alt={current().speaker}
                  />
                </div>
              )}

              {/* Speaker name */}
              <Show when={current().speaker}>
                <div class="text-[5vh] font-black text-green-800 text-center">
                  {current().speaker}
                </div>
              </Show>
            </div>
          );
        }}
      </Show>
    </div>
  );
}
