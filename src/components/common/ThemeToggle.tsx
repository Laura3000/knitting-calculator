import styles from "./ThemeToggle.module.css";
import { Icon } from "./Icon";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button className={styles.toggle} onClick={onToggle} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
      <Icon name={theme === "light" ? "moon" : "sun"} />
    </button>
  );
}
