import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  // Lazy initializer: this function only runs once, on the first render,
  // to check if there's already a saved preference in localStorage.
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  // This effect runs after every render where `theme` has changed
  // (thanks to the [theme] dependency array at the end).
  // It applies the theme to the <html> tag and saves the choice.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // The theme still works for this session if storage is unavailable.
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((previousTheme) => (previousTheme === "light" ? "dark" : "light"));
  }

  return { theme, toggleTheme };
}
