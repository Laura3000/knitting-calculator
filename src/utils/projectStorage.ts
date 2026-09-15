import type { SavedProject, SwatchData, CalculationResult } from "../types/knitting.types";

const STORAGE_KEY = "savedProjects";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Check the existing format without imposing new calculator rules on old projects.
function isSavedProject(value: unknown): value is SavedProject {
  if (!isRecord(value) || !isRecord(value.data) || !isRecord(value.result)) {
    return false;
  }

  const { data, result } = value;
  return (
    typeof value.id === "string" &&
    typeof value.savedAt === "string" &&
    typeof data.projectName === "string" &&
    [data.swatchStitches, data.swatchWidthCm, data.desiredWidthCm,
      result.requiredStitches].every((field) => typeof field === "number" && Number.isFinite(field)) &&
    [data.swatchRows, data.swatchHeightCm, data.desiredHeightCm,
      result.requiredRows].every((field) => field === undefined ||
        (typeof field === "number" && Number.isFinite(field))) &&
    [data.yarnName, data.needleSize].every((field) =>
      field === undefined || typeof field === "string")
  );
}

// Reads the full list of saved projects from localStorage.
// Returns an empty array if nothing has been saved yet.
export function getSavedProjects(): SavedProject[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (cause) {
    throw new Error("Unable to read saved projects. No projects were changed.", { cause });
  }
  if (raw === null) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (cause) {
    throw new Error("Saved projects could not be read because their data is invalid. The original data was preserved.", { cause });
  }
  if (!Array.isArray(parsed) || !parsed.every(isSavedProject)) {
    throw new Error("Saved projects have an unexpected format. The original data was preserved.");
  }
  return parsed;
}

function writeProjects(projects: SavedProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (cause) {
    throw new Error("Unable to save changes to projects. Please try again. Existing saved data was not removed.", { cause });
  }
}

// Adds a new project to the list and saves the whole list back.
export function saveProject(project: SavedProject): SavedProject[] {
  const currentProjects = getSavedProjects();
  const updatedProjects = [...currentProjects, project];
  
  writeProjects(updatedProjects);
  return updatedProjects;
}

// Updates only an existing project, keeping its original identity and save date.
export function updateProject(
  id: string,
  data: SwatchData,
  result: CalculationResult,
): SavedProject[] {
  const currentProjects = getSavedProjects();
  const index = currentProjects.findIndex((project) => project.id === id);
  if (index === -1) {
    throw new Error("This project could not be found. No projects were changed.");
  }
  const updatedProjects = [...currentProjects];
  updatedProjects[index] = { ...currentProjects[index], data, result };
  writeProjects(updatedProjects);
  return updatedProjects;
}

// Removes a project by id and saves the updated list back.
export function deleteProject(id: string): SavedProject[] {
  const currentProjects = getSavedProjects();
  const updatedProjects = currentProjects.filter(
    (project) => project.id !== id,
  );
  writeProjects(updatedProjects);
  return updatedProjects;
}
