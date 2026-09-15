import { useState, type ReactNode } from "react";
import { Icon } from "../components/common/Icon";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { navigation, viewLabel, type View } from "./navigation";
import styles from "./AppLayout.module.css";

export function AppLayout({
  children,
  view,
  theme,
  toggleTheme,
}: {
  children: ReactNode;
  view: View;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = [
    "stitch-row",
    "gauge",
    "increase-decrease",
    "raglan",
    "yarn-estimator",
  ].includes(view)
    ? "calculators"
    : view;

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skip}>
        Skip to content
      </a>
      <aside className={styles.sidebar}>
        <a
          className={styles.brand}
          href="#home"
          onClick={() => setMenuOpen(false)}
          aria-label="Count & Knit home"
        >
          <span className={styles.brandDrawing}>
            <Icon name="yarn" />
            <Icon name="heart" />
          </span>
          <span className={styles.brandName}>Count &amp; Knit</span>
          <span className={styles.slogan}>from swatch to stitch.</span>
        </a>
        <button
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name="menu" /> Menu
        </button>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`${styles.navigation} ${menuOpen ? styles.open : ""}`}
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.pro}>
            <Icon name="crown" />
            <div>
              <h2>Go Pro</h2>
              <p>A little more room for your creativity.</p>
            </div>
            <span>Coming soon</span>
          </div>
          <p className={styles.quote}>
            Small stitches,
            <br />
            big happiness.
            <Icon name="heart" />
          </p>
          <svg
            className={styles.thread}
            viewBox="0 0 240 65"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M-10 30C80-40 70 110 40 60S110 30 135 43 190 8 250 24"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <span>
            Your little knitting corner <span aria-hidden="true">/</span>{" "}
            <strong>{viewLabel(view)}</strong>
          </span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>
        <main id="main-content" tabIndex={-1} className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>For projects worth keeping.</footer>
      </div>
    </div>
  );
}
