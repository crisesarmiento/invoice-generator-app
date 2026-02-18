"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="gap-2"
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </Button>
  );
};
