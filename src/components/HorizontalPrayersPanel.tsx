import { For, createMemo } from "solid-js";
import type { Prayer } from "../prayers";

type Props = {
  filteredPrayers?: () => Prayer[];
  nextPrayer?: () => Prayer | undefined;
  slimMode?: boolean;
};

export default function HorizontalPrayersPanel(props: Props) {
  const isNext = (p: Prayer) =>
    props.nextPrayer?.()?.time === p.time;

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "row",
        "justify-content": "flex-end",
        width: "100%",
        "background-color": "#006400",
        "padding-top": "3.5vh",
        "padding-bottom": "3.5vh",
        "padding-left": "3.5vh",
        "padding-right": "3.5vh",
        "box-sizing": "border-box",
      }}
    >
      <For each={props.filteredPrayers?.() || []}>
        {(p) => {
          const active = createMemo(() => isNext(p));

          return (
            <div style={{ "margin-right": "2vh" }}>
              {/* Prayer names */}
              <div style={{ "line-height": "4.5vh" }}>
                <div
                  style={{
                    "font-family": "Cairo",
                    "font-size": "5.7vh",
                    color: "white",
                    "font-weight": active() ? "bold" : "normal",
                    opacity: active() ? "1" : "0.5",
                  }}
                >
                  {p.ar}
                </div>

                <div
                  style={{
                    "font-size": "2.7vh",
                    color: "white",
                    "font-weight": active() ? "bold" : "normal",
                    opacity: active() ? "1" : "0.5",
                  }}
                >
                  {p.en}
                </div>
              </div>

              {/* Time */}
              <div
                style={{
                  "font-size": "4vh",
                  color: "white",
                  "font-weight": active() ? "bold" : "normal",
                  opacity: active() ? "1" : "0.5",
                  "text-transform": "uppercase",
                }}
              >
                {p.time}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
