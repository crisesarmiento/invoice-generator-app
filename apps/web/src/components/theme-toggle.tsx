"use client";

import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <span>Light</span>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <span>Dark</span>
    </div>
  );
};
