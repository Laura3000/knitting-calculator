import { useEffect, useRef, useState } from "react";
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
  const [initialLoad] = useState(() => {
    try {
      return { projects: getSavedProjects(), error: "" };
    } catch (error) {
      return { projects: [] as SavedProject[], error: storageErrorMessage(error) };
    }
  });
  const [projects, setProjects] = useState(initialLoad.projects);
  const loadErrorReported = useRef(false);

  useEffect(() => {
    if (initialLoad.error && !loadErrorReported.current) {
      loadErrorReported.current = true;
      window.alert(initialLoad.error);
    }
  }, [initialLoad.error]);
  // Builds a new SavedProject (generating its id and timestamp here,
  // so no other part of the app needs to worry about those details)
  // and saves it.
  function addProject(data: SwatchData, result: CalculationResult) {
    try {
      const newProject: SavedProject = {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        data,
        result,
      };

      setProjects(saveProject(newProject));
      return true;
    } catch (error) {
      window.alert(storageErrorMessage(error));
      return false;
    }
  }

  function removeProject(id: string) {
    try {
      setProjects(deleteProject(id));
    } catch (error) {
      window.alert(storageErrorMessage(error));
    }
  }

  return { projects, addProject, removeProject };
}

function storageErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to access saved projects. Please try again.";
}
