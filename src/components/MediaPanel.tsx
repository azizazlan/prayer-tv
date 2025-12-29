// MediaPanel.tsx
import { For, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import styles from "./fade.module.css";

export default function MediaPanel(props: {
  images: string[];
  imageIndex: () => number;
}) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
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
    </div>
  );
}
