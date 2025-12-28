import { For, Show } from "solid-js";
import type { Event } from "../event";

export default function EventsPanel(props: { events: Event[] }) {
  return (
    <Show when={props.events.length > 0}>
      <div class="events-panel">
        {props.events.length === 1 ? (
          // Large single event layout
          <div class="event-single">
            <div class="event-avatar-single">
              {props.events[0].speakerCode ? (
                <img
                  src={`/data/speaker-imgs/${props.events[0].speakerCode}.png`}
                  alt={props.events[0].speaker}
                />
              ) : (
                <div class="event-avatar-placeholder-large" />
              )}
            </div>
            <div class="event-content-single">
              <div class="event-speaker">{props.events[0].speaker}</div>
              <div class="event-title">{props.events[0].title}</div>
              <div class="event-desc">{props.events[0].desc}</div>
            </div>
          </div>
        ) : (
          // Multiple events layout
          <For each={props.events}>
            {(e) => (
              <div class="event-card">
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

                <div class="event-content">
                  <div class="event-time">{e.time}</div>
                  <div class="event-title">{e.title}</div>
                  <div class="event-desc">{e.desc}</div>
                  <div class="event-speaker">{e.speaker}</div>
                </div>
              </div>
            )}
          </For>
        )}
      </div>
    </Show>
  );
}
