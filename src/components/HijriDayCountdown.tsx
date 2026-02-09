import { createMemo } from "solid-js";

interface HijriDayCountdownProps {
  targetDate: Date; // Ramadhan Day 1
  label: string; // "Ramadhan"
  celebrationText?: string;
}

const HijriDayCountdown = (props: HijriDayCountdownProps) => {
  const today = createMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const target = createMemo(() => {
    const d = new Date(props.targetDate);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Days before Ramadhan
  const daysRemaining = createMemo(() => {
    const diffTime = target().getTime() - today().getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  });

  // Ramadhan day number (1, 2, 3, ...)
  const hijriDay = createMemo(() => {
    const diffTime = today().getTime() - target().getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  });

  const isRamadhan = createMemo(() => today() >= target());
  //  const isRamadhan = () => true;

  return (
    <div class="hijri-countdown">
      <div class="title">{props.label}</div>

      {isRamadhan() ? (
        <div class="count">
          <span class="number">{hijriDay()}</span>
        </div>
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
