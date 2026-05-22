"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">{t("error.title")}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{t("error.message")}</p>
      <div className="flex gap-3">
        <Button onClick={reset}>{t("error.retry")}</Button>
        <Button variant="outline" asChild>
          <Link href="/">{t("error.home")}</Link>
        </Button>
      </div>
    </div>
  );
}
