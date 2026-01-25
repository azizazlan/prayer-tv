import {
  For,
  Show,
  createSignal,
  onMount,
  createMemo
} from "solid-js";

/* ================= TYPES ================= */

export type Collection = {
  collection_month: number; // 1–12
  collection_year: number;
  amount: string; // decimal string
};

/* ================= HELPERS ================= */

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Format as "Jul 25" instead of "Jul 2025"
const formatMonthYear = (month: number, year: number) =>
  `${MONTH_NAMES[month - 1]} ${year.toString().slice(-2)}`;

const formatAmount = (value: string) =>
  `RM ${Number(value).toLocaleString("en-MY", {
    minimumFractionDigits: 0,
  })}`;

/* ================= CONFIG ================= */

import QR_IMAGE_URL from "../assets/qr.jpg";

/* ================= COMPONENT ================= */

export default function CollectionsPanel() {
  const [collections, setCollections] = createSignal<Collection[]>([]);
  const [loading, setLoading] = createSignal(true);

  // Determine the latest month
  const latestMonth = createMemo(() => {
    if (!collections().length) return null;
    return collections().reduce((prev, curr) => {
      if (curr.collection_year > prev.collection_year) return curr;
      if (
        curr.collection_year === prev.collection_year &&
        curr.collection_month > prev.collection_month
      )
        return curr;
      return prev;
    }, collections()[0]);
  });

  onMount(async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/collections/last-6-months"
      );
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.error("Failed to fetch collections", err);
    } finally {
      setLoading(false);
    }
  });

  /* ================= RENDER ================= */

  return (
    <Show when={!loading()} fallback={<div>Loading collections...</div>}>
      <Show when={collections().length > 0} fallback={<div>No data</div>}>
        <div
          style={{
            width: "100%",
            display: "flex",
            "flex-direction": "row",
            animation: "fadeSlide 0.6s ease",
          }}
        >
          {/* ===== LEFT: COLLECTION LIST ===== */}
          <div style={{ width: "65%" }}>
            {/* HEADER */}
            <div
              style={{
                "font-size": "3.0vh",
                "font-weight": 900,
                "text-transform": "uppercase",
                padding: "1.5vh 2.5vw",
                color: "#006400"
              }}
            >
              Kutipan Bulanan Surau
            </div>

            <For each={collections()}>
              {(c) => {
                const isLatest =
                  latestMonth()?.collection_month === c.collection_month &&
                  latestMonth()?.collection_year === c.collection_year;

                return (
                  <div
                    style={{
                      display: "flex",
                      "flex-direction": "row",
                      "justify-content": "space-between",
                      "align-items": "center",
                      padding: "1.5vh 2.5vw",
                      color: isLatest ? "#006400" : "black",
                    }}
                  >
                    <div
                      style={{
                        "font-size": "5.5vh", // smaller font for month-year
                        "font-weight": 900,
                        "text-transform": "uppercase",
                      }}
                    >
                      {formatMonthYear(c.collection_month, c.collection_year)}
                    </div>

                    <div
                      style={{
                        "font-size": "5.5vh",
                        "font-weight": 900,
                        color: isLatest ? "#006400" : "black",
                      }}
                    >
                      {formatAmount(c.amount)}
                    </div>
                  </div>
                )
              }
              }

            </For>
          </div>

          {/* ===== RIGHT: QR DONATION IMAGE ===== */}
          <div
            style={{
              width: "50%",
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              "justify-content": "center",
              "border-left": "1px solid silver",
              padding: "1vh",
            }}
          >
            <img
              src={QR_IMAGE_URL}
              alt="Scan to donate"
              style={{
                width: "100%",       // scale to parent width
                "max-width": "675px", // won't grow beyond 675px
                height: "auto",       // maintain aspect ratio
                "object-fit": "contain",
              }}
            />
          </div>

        </div>

        <style>
          {`
            @keyframes fadeSlide {
              from {
                opacity: 0;
                transform: translateY(12px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </Show>
    </Show>
  );
}
