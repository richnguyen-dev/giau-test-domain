"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">{t("notFound.message")}</p>
      <Button asChild>
        <Link href="/">{t("notFound.home")}</Link>
      </Button>
    </div>
  );
}
