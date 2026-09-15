import type { IconName } from "../components/common/Icon";

export const navigation = [
  { id: "home", label: "Home", icon: "home" },
  { id: "calculators", label: "Calculators", icon: "calculator" },
  { id: "row-counter", label: "Row Counter", icon: "rows" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "yarn-needles", label: "Yarn & Needles", icon: "yarn" },
  { id: "conversions", label: "Conversions", icon: "arrows" },
  { id: "notes", label: "Notes", icon: "notes" },
  { id: "stitch-library", label: "Stitch Library", icon: "book" },
  { id: "settings", label: "Settings", icon: "settings" },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>;

export const quickTools = [
  { id: "gauge", label: "Gauge Calculator", icon: "calculator", description: "Get to know your swatch, stitch by stitch.", tone: "rose" },
  { id: "stitch-row", label: "Stitch & Row Calculator", icon: "stitch", description: "Calculate stitches and rows for your next piece.", tone: "sage" },
  { id: "increase-decrease", label: "Increase & Decrease", icon: "arrows", description: "A little shaping. A perfect fit.", tone: "peach" },
  { id: "raglan", label: "Raglan Calculator", icon: "sweater", description: "Plan your next top-down creation.", tone: "blue" },
  { id: "yarn-estimator", label: "Yarn Estimator", icon: "yarn", description: "Find the yarn quantity for your ideas.", tone: "lavender" },
  { id: "row-counter", label: "Row Counter", icon: "rows", description: "Keep your place, one row at a time.", tone: "rose" },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName; description: string; tone: string }>;

export type View = typeof navigation[number]["id"] | typeof quickTools[number]["id"];
export function getView(): View {
  const id = window.location.hash.slice(1);
  return [...navigation, ...quickTools].some((item) => item.id === id) ? id as View : "home";
}
export function viewLabel(view: View): string {
  return [...navigation, ...quickTools].find((item) => item.id === view)?.label ?? "Home";
}
