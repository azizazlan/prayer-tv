import { createSignal, createEffect } from "solid-js";
import Tabs from "./Tabs";
import IqamahTab from "./IqamahTab";
import EventsTab from "./EventsTab";
import PosterTab from "./PosterTab";
import PrayerTimesTab from "./PrayerTimesTab";

import type { AppSettings, TabKey, IqamahSettings } from "./types";

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

  createEffect(() => {
    if (props.open && props.initialValues) {
      setIqamah(props.initialValues.iqamah);
      setPoster(props.initialValues.poster ?? null);
    }
  });

  const handleSave = () => {
    props.onSave({
      iqamah: iqamah(),
      poster: poster(),
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
          background: "white",
          padding: "2vh",
          width: "1600px",
          "max-width": "95vw",
          "border-radius": "1vh",
        }}
      >
        <Tabs value={tab()} onChange={setTab} />

        {tab() === "iqamah" && (
          <IqamahTab values={iqamah()} onChange={setIqamah} />
        )}

        {tab() === "events" && <EventsTab />}

        {tab() === "poster" && (
          <PosterTab value={poster()} onChange={setPoster} />
        )}

        {tab() === "prayer-times" && <PrayerTimesTab />}

        <div
          style={{
            display: "flex",
            "justify-content": "flex-end",
            gap: "2vh",
            "margin-top": "3vh",
          }}
        >
          <button
            onClick={props.onClose}
            style={{
              width: "20vh",
              height: "8vh",
              "font-size": "2.5vh",
              "font-weight": "bold",
              border: "2px solid #333",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              width: "20vh",
              height: "8vh",
              "font-size": "2.5vh",
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
