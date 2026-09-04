import { useState } from "react";
import type {
  SwatchData,
  CalculationResult,
  SavedProject,
} from "../types/knitting.types";
import {
  getSavedProjects,
  saveProject,
  deleteProject,
} from "../utils/projectStorage";

export function useSavedProjects() {
  // Lazy initializer: reads localStorage once, on the first render.
  const [projects, setProjects] = useState<SavedProject[]>(() =>
    getSavedProjects(),
  );
  // Builds a new SavedProject (generating its id and timestamp here,
  // so no other part of the app needs to worry about those details)
  // and saves it.
  function addProject(data: SwatchData, result: CalculationResult) {
    const newProject: SavedProject = {
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      data,
      result,
    };

    saveProject(newProject);
    setProjects(getSavedProjects());
  }

  function removeProject(id: string) {
    deleteProject(id);
    setProjects(getSavedProjects());
  }

  return { projects, addProject, removeProject };
}
