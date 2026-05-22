"use client";

import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface AccuracyBannerProps {
  source: "api" | "dns";
}

export function AccuracyBanner({ source }: AccuracyBannerProps) {
  const { t } = useLanguage();

  if (source === "api") return null;

  return (
    <div className="mx-auto mb-6 flex max-w-4xl items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-950 dark:text-amber-100/90">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p>{t("accuracy.message")}</p>
    </div>
  );
}
