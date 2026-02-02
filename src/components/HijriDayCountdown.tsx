import { createMemo } from "solid-js";

interface HijriDayCountdownProps {
  targetDate: Date;
  label: string;
  celebrationText?: string;
}

const HijriDayCountdown = (props: HijriDayCountdownProps) => {
  const daysRemaining = createMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(props.targetDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  });

  return (
    <div class="hijri-countdown">
      <div class="title">{props.label}</div>

      {daysRemaining() === 0 ? (
        <div class="today">{props.celebrationText ?? "Eid Mubarak 🌙"}</div>
      ) : (
        <div class="count">
          <span class="number">{daysRemaining()}</span>
          <span class="text">hari lagi</span>
        </div>
      )}
    </div>
  );
};

export default HijriDayCountdown;
