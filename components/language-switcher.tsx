"use client";

import { useLanguage } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  const options: { code: Locale; label: string }[] = [
    { code: "vi", label: t("lang.vi") },
    { code: "en", label: t("lang.en") },
  ];

  return (
    <div
      className={`flex items-center rounded-lg border border-border p-0.5 ${className}`}
      role="group"
      aria-label={t("lang.switch")}
    >
      {options.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            locale === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
