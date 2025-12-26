import { For, Show } from "solid-js";
import type { Event } from "../event";

export default function EventsPanel(props: { events: Event[] }) {
  return (
    <Show when={props.events.length > 0}>
      <div class="events-panel">
        <For each={props.events}>
          {(e) => (
            <div class="event-card">
              {/* Speaker photo (show only if exists) */}
              <div class="event-avatar">
                {e.speakerCode ? (
                  <img
                    src={`/data/speaker-imgs/${e.speakerCode}.png`}
                    alt={e.speaker}
                  />
                ) : (
                  <div class="event-avatar-placeholder" />
                )}
              </div>

              {/* Event details */}
              <div class="event-content">
                <div class="event-time">{e.time}</div>
                <div class="event-title">{e.title}</div>
                <div class="event-desc">{e.desc}</div>
                <div class="event-speaker">{e.speaker}</div>
              </div>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
