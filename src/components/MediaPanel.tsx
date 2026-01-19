// MediaPanel.tsx
import { For, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import styles from "./fade.module.css";

type MediaPanelProps =
  | {
    imageUrl: string; // SINGLE IMAGE MODE
  }
  | {
    images: string[]; // SLIDESHOW MODE
    imageIndex: () => number;
  };

export default function MediaPanel(props: MediaPanelProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* SINGLE IMAGE MODE */}
      <Show when={"imageUrl" in props}>
        <img
          src={props.imageUrl}
          style={{
            width: "100%",
            height: "100%",
            "object-fit": "cover",
            position: "absolute",
          }}
        />
      </Show>

      {/* SLIDESHOW MODE */}
      <Show when={"images" in props}>
        <For each={props.images}>
          {(img, idx) => (
            <Transition
              enterActiveClass={styles["fade--active"]}
              exitActiveClass={styles["fade--active"]}
              enterClass={styles["opacity-0"]}
              enterToClass={styles["opacity-1"]}
              exitToClass={styles["opacity-0"]}
            >
              <Show when={idx() === props.imageIndex()}>
                <img
                  src={img}
                  style={{
                    width: "100%",
                    height: "110%",
                    "object-fit": "cover",
                    position: "absolute",
                  }}
                />
              </Show>
            </Transition>
          )}
        </For>
      </Show>
    </div>
  );
}
