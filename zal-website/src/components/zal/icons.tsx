import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconModel = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
  </svg>
);

export const IconDataset = (p: IconProps) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" />
    <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
    <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
  </svg>
);

export const IconDownload = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 4v10m0 0 3.5-3.5M12 14l-3.5-3.5" />
    <path d="M5 20h14" />
  </svg>
);

export const IconArrow = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

export const IconArrowLeft = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M12 19l7-7-7-7" />
  </svg>
);

export const IconTag = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20.59 13.41 13.42 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
    <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={1.5}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const IconCalendar = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const IconUser = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconInfo = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const IconLink = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconGithub = (p: IconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" stroke="none" aria-hidden {...p}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={1.6}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7.5 8 5.5 8-5.5" />
  </svg>
);

export const IconLinkedin = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden {...p}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={1.7}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconSend = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={1.7}>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={2}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={2}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconList = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={1.5}>
    <path d="M3 6h18M3 12h18M3 18h12" />
  </svg>
);

export const IconSparkle = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden {...p}>
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
  </svg>
);

export const IconExternal = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={1.7}>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

export const IconSort = (p: IconProps) => (
  <svg {...base} {...p} strokeWidth={1.6}>
    <path d="M3 6h13M3 12h9M3 18h5M17 9l3-3 3 3M20 6v12" />
  </svg>
);
