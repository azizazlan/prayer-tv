import { createSignal, createEffect } from "solid-js";
import Tabs from "./Tabs";
import IqamahTab from "./IqamahTab";
import EventsTab from "./EventsTab";
import PosterTab from "./PosterTab";
import MiscTab from "./MiscTab";
import PrayerTimesTab from "./PrayerTimesTab";

import type { AppSettings, TabKey } from "../../types/settings";

type Props = {
  open: boolean;
  initialValues?: AppSettings;
  onClose: () => void;
  onSave: (values: AppSettings) => void;
};

export default function SettingsModal(props: Props) {
  const [tab, setTab] = createSignal<TabKey>("iqamah");

  const [iqamah, setIqamah] = createSignal(
    props.initialValues?.iqamah ?? {
      alfajr: 18,
      dhuhr: 10,
      alasr: 10,
      maghrib: 10,
      alisha: 10,
    },
  );

  const [poster, setPoster] = createSignal(props.initialValues?.poster ?? null);
  const [misc, setMisc] = createSignal(props.initialValues?.misc ?? null);

  createEffect(() => {
    if (props.open && props.initialValues) {
      setIqamah(props.initialValues.iqamah);
      setPoster(props.initialValues.poster ?? null);
      setMisc(props.initialValues.misc ?? null);
    }
  });

  const handleSave = () => {
    props.onSave({
      iqamah: iqamah(),
      poster: poster(),
      misc: misc(),
    });

    props.onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "z-index": 100,
      }}
    >
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          background: "white",
          "min-width": "27vw",
          "min-height": "17vw",
          padding: "1vh",
          "border-radius": "0.5vh",
        }}
      >
        <Tabs value={tab()} onChange={setTab} />

        <div style={{ "flex-grow": 1 }}>
          {tab() === "iqamah" && (
            <IqamahTab values={iqamah()} onChange={setIqamah} />
          )}

          {tab() === "events" && <EventsTab />}

          {tab() === "poster" && (
            <PosterTab value={poster()} onChange={setPoster} />
          )}

          {tab() === "prayer-times" && <PrayerTimesTab />}

          {tab() === "misc" && <MiscTab values={misc()} onChange={setMisc} />}
        </div>
        <div
          style={{
            display: "flex",
            "justify-content": "flex-end",
            gap: "0.5vh",
            "margin-top": "1vh",
            "padding-top": "1vh",
            "border-top": "1pt solid grey",
          }}
        >
          <button
            onClick={props.onClose}
            style={{
              border: "2px solid #333",
              background: "white",
              color: "black",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              "font-weight": "bold",
              background: "black",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
