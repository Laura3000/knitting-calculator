import { useEffect, useState } from "react";
import { GaugeCalculatorForm } from "./components/knitting/GaugeCalculatorForm";
import { SavedProjectsList } from "./components/knitting/SavedProjectsList";
import { Icon } from "./components/common/Icon";
import { useTheme } from "./hooks/useTheme";
import { useSavedProjects } from "./hooks/useSavedProjects";
import { AppLayout } from "./app/AppLayout";
import { getView, viewLabel } from "./app/navigation";
import { Dashboard, ToolGrid } from "./features/dashboard/Dashboard";
import styles from "./App.module.css";
import type { SavedProject, SwatchData, CalculationResult } from "./types/knitting.types";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { projects, addProject, updateProject, removeProject } = useSavedProjects();
  const [view, setView] = useState(getView);
  const [editingProject, setEditingProject] = useState<SavedProject | null>(null);

  useEffect(() => {
    function handleNavigation() {
      if (window.location.hash === "#main-content") return;
      const nextView = getView();
      setView(nextView);
      if (nextView !== "stitch-row") setEditingProject(null);
      document.getElementById("main-content")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }
    window.addEventListener("hashchange", handleNavigation);
    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);

  useEffect(() => {
    document.title = `${viewLabel(view)} · Count & Knit`;
  }, [view]);

  function startEditing(project: SavedProject) {
    setEditingProject(project);
    window.location.hash = "stitch-row";
  }

  function finishEditing() {
    setEditingProject(null);
    window.location.hash = "projects";
  }

  function saveCalculation(data: SwatchData, result: CalculationResult) {
    if (!editingProject) return addProject(data, result);
    const saved = updateProject(editingProject.id, data, result);
    if (saved) finishEditing();
    return saved;
  }

  const futureView = ![
    "home",
    "calculators",
    "stitch-row",
    "projects",
  ].includes(view);
  return (
    <AppLayout view={view} theme={theme} toggleTheme={toggleTheme}>
      {view === "home" && <Dashboard projects={projects} />}
      {view === "calculators" && (
        <>
          <div className={styles.pageHeading}>
            <span>A LITTLE HELP WITH THE NUMBERS</span>
            <h1>Calculators</h1>
            <p>
              Less counting. More creating. Find the right tool for your next
              idea.
            </p>
          </div>
          <ToolGrid />
        </>
      )}
      {/* Preserve new drafts across navigation; reset the form when entering or leaving editing. */}
      <div hidden={view !== "stitch-row"}>
        <div className={styles.pageHeading}>
          <span>FROM SWATCH TO STITCH</span>
          <h1>Stitch &amp; Row Calculator</h1>
          <p>From your little swatch to something lovely.</p>
        </div>
        <GaugeCalculatorForm
          key={editingProject ? `edit:${editingProject.id}` : "new-project"}
          editingProject={editingProject}
          onSaveProject={saveCalculation}
          onCancelEdit={finishEditing}
        />
      </div>
      {view === "projects" && (
        <>
          <div className={styles.pageHeading}>
            <span>YOUR HANDMADE JOURNEY</span>
            <h1>My Projects</h1>
            <p>Your saved calculations, ready when inspiration strikes.</p>
          </div>
          <SavedProjectsList
            projects={projects}
            onDelete={removeProject}
            onEdit={startEditing}
            onBack={() => {
              window.location.hash = "stitch-row";
            }}
          />
        </>
      )}
      {futureView && (
        <section className={styles.comingSoon}>
          <span className={styles.comingIcon}>
            <Icon name={view === "settings" ? "settings" : "yarn"} />
          </span>
          <span className={styles.badge}>Coming soon</span>
          <h1>{viewLabel(view)}</h1>
          <p>
            Something lovely is taking shape.
            <br />
            This space is waiting for a future update.
          </p>
          {view === "settings" && (
            <p>
              You can already switch between light and dark using the theme
              button above.
            </p>
          )}
          <a href="#home">
            Back to Home <Icon name="arrow" />
          </a>
        </section>
      )}
    </AppLayout>
  );
}

export default App;
