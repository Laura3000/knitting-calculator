export type IconName = "home" | "calculator" | "rows" | "folder" | "yarn" | "arrows" | "notes" | "book" | "settings" | "heart" | "crown" | "stitch" | "sweater" | "clock" | "arrow" | "plus" | "menu" | "sun" | "moon";

const paths: Record<IconName, string[]> = {
  home: ["m3 11 9-8 9 8", "M5 10v11h5v-7h4v7h5V10"],
  calculator: ["M6 3h12v18H6z", "M9 6h6", "M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"],
  rows: ["M20 6c0 2-16 2-16 0s16-2 16 0Z", "M20 12c0 2-16 2-16 0s16-2 16 0Z", "M20 18c0 2-16 2-16 0s16-2 16 0Z", "m13 2-1 2"],
  folder: ["M3 7V4h7l2 3h9v14H3Z", "M3 10h18"],
  yarn: ["M21 11a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", "M7 3c7 3 10 8 11 15M4 6c7 3 10 8 11 14M3 10c5 2 8 6 9 10M12 2 4 14m11-11-9 14m12-12-5 8", "M20 16c4 1 2 7-1 6"],
  arrows: ["M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4"],
  notes: ["M5 3h10l4 4v14H5Z", "M14 3v5h5M8 12h8m-8 4h6"],
  book: ["M12 5c-4-3-9-2-9-2v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Zm0 0v16"],
  settings: ["m10 2-1 3-3 1-3-1-1 4 3 2v3l-2 2 2 3 3-1 3 1 1 3 4-1 1-3 3-1 2-3-2-2v-3l1-3-3-2-2 1-3-1-1-2Z", "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"],
  heart: ["M12 21S2 15 2 8c0-6 8-7 10-1 2-6 10-5 10 1 0 7-10 13-10 13Z"],
  crown: ["m3 6 5 5 4-8 4 8 5-5-2 14H5Z"],
  stitch: ["M6 3c-5 4 5 5 0 9s5 5 0 9M12 3c-5 4 5 5 0 9s5 5 0 9M18 3c-5 4 5 5 0 9s5 5 0 9"],
  sweater: ["m8 3-4 3-3 9 4 2 2-7v11h10V10l2 7 4-2-3-9-4-3c0 5-8 5-8 0Z"],
  clock: ["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 5v7h5"],
  arrow: ["M4 12h16m-6-6 6 6-6 6"],
  plus: ["M12 4v16M4 12h16"],
  menu: ["M4 6h16M4 12h16M4 18h16"],
  sun: ["M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z", "M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"],
  moon: ["M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"],
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name].map((path, index) => <path key={index} d={path} />)}</svg>;
}
