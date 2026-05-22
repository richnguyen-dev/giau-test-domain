"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 text-primary" />
          <span>DomainScope</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/whois" className="hover:text-foreground transition-colors">
            {t("footer.whoisLink")}
          </Link>
          <Link href="/faq" className="hover:text-foreground transition-colors">
            {t("nav.faq")}
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground text-center sm:text-right">
          {t("footer.priceNote")}
        </p>
      </div>
    </footer>
  );
}
