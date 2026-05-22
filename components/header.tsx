"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Search, Shield, HelpCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { scrollToSearchSection } from "@/lib/nav";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleSearchNav = useCallback(() => {
    closeMobile();
    if (pathname === "/") {
      scrollToSearchSection();
    } else {
      router.push("/?scroll=search");
    }
  }, [pathname, router, closeMobile]);

  const handleWhoisNav = useCallback(() => {
    closeMobile();
    router.push("/whois");
  }, [router, closeMobile]);

  const navItems = (
    <>
      <button
        type="button"
        onClick={handleSearchNav}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        {t("nav.search")}
      </button>
      <button
        type="button"
        onClick={handleWhoisNav}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Shield className="h-3.5 w-3.5" />
        {t("nav.whois")}
      </button>
      <Link
        href="/faq"
        onClick={closeMobile}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {t("nav.faq")}
      </Link>
    </>
  );

  return (
    <header className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={closeMobile}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Globe className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            DomainScope
          </span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex items-center gap-6">{navItems}</nav>
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={handleSearchNav}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            aria-label={t("nav.searchAria")}
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleWhoisNav}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            aria-label={t("nav.whoisAria")}
          >
            <Shield className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
            aria-label={t("nav.openMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-3 border-t border-border/50 px-6 py-4 md:hidden">
          {navItems}
        </nav>
      )}
    </header>
  );
}
