import { useState } from "react";
import { GaugeCalculatorForm } from "./components/knitting/GaugeCalculatorForm";
import { SavedProjectsList } from "./components/knitting/SavedProjectsList";
import { ThemeToggle } from "./components/common/ThemeToggle";
import { useTheme } from "./hooks/useTheme";
import { useSavedProjects } from "./hooks/useSavedProjects";
import styles from "./App.module.css";

type View = "calculator" | "saved";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { projects, addProject, removeProject } = useSavedProjects();
  const [view, setView] = useState<View>("calculator");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.linkButton} onClick={() => setView("saved")}>
          Saved projects ({projects.length})
        </button>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      {view === "calculator" ? (
        <GaugeCalculatorForm onSaveProject={addProject} />
      ) : (
        <SavedProjectsList
          projects={projects}
          onDelete={removeProject}
          onBack={() => setView("calculator")}
        />
      )}
    </div>
  );
}

export default App;
