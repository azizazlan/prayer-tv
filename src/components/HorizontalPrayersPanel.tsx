import { For, createMemo } from "solid-js";
import type { Prayer } from "../prayers";

type Props = {
  filteredPrayers?: () => Prayer[];
  nextPrayer?: () => Prayer | undefined;
  lastPrayer?: () => Prayer | undefined;
  slimMode?: boolean;
};

export default function HorizontalPrayersPanel(props: Props) {

  // ✅ Decide active prayer safely + reactively
  const activePrayer = createMemo<Prayer | undefined>(() => {
    const last = props.lastPrayer ? props.lastPrayer() : undefined;
    if (last) return last;

    return props.nextPrayer ? props.nextPrayer() : undefined;
  });

  const isActive = (p: Prayer) =>
    activePrayer()?.en === p.en;

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "row",
        "justify-content": "space-between",
        width: "100%",
        "background-color": "#006400",
        "padding-top": "2.5vh",
        "padding-bottom": props.slimMode ? "3vh" : "1.5vh",
        "padding-left": "1.5vh",
        "padding-right": props.slimMode ? "5.5vh" : "1.0vh",
        "box-sizing": "border-box",
      }}
    >
      {props.slimMode && (
        <div style={{ "padding-left": "1vh", color: "yellow", opacity: "0.6", "line-height": "1.25" }}>
          <div style={{ "font-family": "Cairo", "font-size": "4.5vh" }}>
            سوراو کوندو ديروزلل
          </div>
          <div style={{ "font-size": "3.2vh", "font-weight": "900" }}>
            Surau Kondo Derozelle
          </div>
          <div style={{ "font-size": "3.0vh", "font-weight": "500" }}>
            Kota Damansara
          </div>
        </div>
      )}

      <For each={props.filteredPrayers?.() || []}>
        {(p) => {
          const active = createMemo(() => isActive(p));

          return (
            <div style={{ "margin-right": "1vh" }}>
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
