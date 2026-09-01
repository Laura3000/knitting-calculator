import "./App.css";
import { GaugeCalculatorForm } from "./components/knitting/GaugeCalculatorForm";
import { ThemeToggle } from "./components/common/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import styles from "./App.module.css";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <GaugeCalculatorForm />
      </div>
    </>
  );
}

export default App;
