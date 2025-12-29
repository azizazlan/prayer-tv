import { createMemo } from "solid-js";

export default function SlideProgressCircle(props: {
  progress: number; // 0 → 1
  visible: boolean;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  const offset = createMemo(
    () => circumference * (1 - props.progress)
  );

  if (!props.visible) return null;

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      style={{
        position: "absolute",
        bottom: "23.5vh",
        right: "4.5vh",
        opacity: "0.7",
      }}
    >
      {/* background ring */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="#FFE0B2"
        stroke-width="4"
      />

      {/* progress ring */}
      <circle
        cx="24"
        cy="24"
        r={radius}
        fill="none"
        stroke="#FF9800"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={offset()}
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}
