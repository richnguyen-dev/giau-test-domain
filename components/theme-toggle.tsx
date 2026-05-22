"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={`flex h-9 w-[4.5rem] rounded-lg border border-border bg-secondary/50 ${className}`}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground ${className}`}
      aria-label={isDark ? t("theme.lightAria") : t("theme.darkAria")}
      title={isDark ? t("theme.light") : t("theme.dark")}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden text-xs font-medium sm:inline">{t("theme.light")}</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden text-xs font-medium sm:inline">{t("theme.dark")}</span>
        </>
      )}
    </button>
  );
}
