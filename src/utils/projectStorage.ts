import type { SavedProject } from "../types/knitting.types";

const STORAGE_KEY = "savedProjects";

// Reads the full list of saved projects from localStorage.
// Returns an empty array if nothing has been saved yet.
export function getSavedProjects(): SavedProject[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  return JSON.parse(raw) as SavedProject[];
}

// Adds a new project to the list and saves the whole list back.
export function saveProject(project: SavedProject): void {
  const currentProjects = getSavedProjects();
  const updatedProjects = [...currentProjects, project];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
}

// Removes a project by id and saves the updated list back.
export function deleteProject(id: string): void {
  const currentProjects = getSavedProjects();
  const updatedProjects = currentProjects.filter(
    (project) => project.id !== id,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
}
