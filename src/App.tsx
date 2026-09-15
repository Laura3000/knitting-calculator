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

function App() {
  const { theme, toggleTheme } = useTheme();
  const { projects, addProject, removeProject } = useSavedProjects();
  const [view, setView] = useState(getView);

  useEffect(() => {
    function handleNavigation() {
      if (window.location.hash === "#main-content") return;
      setView(getView());
      document.getElementById("main-content")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }
    window.addEventListener("hashchange", handleNavigation);
    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);

  useEffect(() => {
    document.title = `${viewLabel(view)} · Count & Knit`;
  }, [view]);

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
      {/* Keep the existing form mounted so navigation preserves its draft and result. */}
      <div hidden={view !== "stitch-row"}>
        <div className={styles.pageHeading}>
          <span>FROM SWATCH TO STITCH</span>
          <h1>Stitch &amp; Row Calculator</h1>
          <p>From your little swatch to something lovely.</p>
        </div>
        <GaugeCalculatorForm onSaveProject={addProject} />
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
