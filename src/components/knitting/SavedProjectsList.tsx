import type { SavedProject } from "../../types/knitting.types";
import styles from "./SavedProjectsList.module.css";

interface SavedProjectsListProps {
  projects: SavedProject[];
  onDelete: (id: string) => void;
  onEdit: (project: SavedProject) => void;
}

export function SavedProjectsList({
  projects,
  onDelete,
  onEdit,
}: SavedProjectsListProps) {
  return (
    <div className={styles.container}>
      <h2>Saved Projects</h2>

      {projects.length === 0 && <p>No projects saved yet.</p>}

      {projects.map((project) => (
        <div key={project.id} className={styles.projectCard}>
          <h3>{project.data.projectName || "Untitled project"}</h3>
          <p>Required stitches: {project.result.requiredStitches}</p>
          {project.result.requiredRows !== undefined && (
            <p>Required rows: {project.result.requiredRows}</p>
          )}
          {project.data.yarnName && <p>Yarn: {project.data.yarnName}</p>}
          {project.data.needleSize && (
            <p>Needle size: {project.data.needleSize}</p>
          )}

          <div className={styles.actions}>
            <button
              className={styles.editButton}
              aria-label={`Edit ${project.data.projectName || "untitled project"}`}
              onClick={() => onEdit(project)}
            >
              Edit
            </button>
            <button
              className={styles.deleteButton}
              aria-label={`Delete ${project.data.projectName || "untitled project"}`}
              onClick={() => onDelete(project.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
