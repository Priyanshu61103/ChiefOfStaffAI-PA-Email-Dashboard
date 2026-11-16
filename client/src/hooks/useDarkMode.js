import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("pa_theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("pa_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("pa_theme", "light");
    }
  }, [isDark]);

  return [isDark, setIsDark];
}
