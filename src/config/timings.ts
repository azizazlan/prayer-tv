// src/config/timings.ts
function envNumber(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const IQAMAH_DURATION = envNumber(
  import.meta.env.VITE_IQAMAH_DURATION,
  15 * 60 * 1000
);

export const ALFAJR_IQAMAH_DURATION = envNumber(
  import.meta.env.VITE_ALFAJR_IQAMAH_DURATION,
  18 * 60 * 1000
);

export const ALASR_IQAMAH_DURATION = envNumber(
  import.meta.env.VITE_ALASR_IQAMAH_DURATION,
  10 * 60 * 1000
);

export const MAGHRIB_IQAMAH_DURATION = envNumber(
  import.meta.env.VITE_MAGHRIB_IQAMAH_DURATION,
  10 * 60 * 1000
);

export const IQAMAH_IMAGE_DURATION = envNumber(
  import.meta.env.VITE_IQAMAH_IMAGE_DURATION,
  15 * 1000
);

export const POST_IQAMAH_DURATION = envNumber(
  import.meta.env.VITE_POST_IQAMAH_DURATION,
  15 * 1000
);

export const BLACKOUT_DURATION = envNumber(
  import.meta.env.VITE_BLACKOUT_DURATION,
  7 * 60 * 1000
);
