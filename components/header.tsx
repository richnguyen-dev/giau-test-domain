"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Search, Shield, HelpCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { scrollToSearchSection } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
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
        Tra cứu
      </button>
      <button
        type="button"
        onClick={handleWhoisNav}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Shield className="h-3.5 w-3.5" />
        WHOIS
      </button>
      <Link
        href="/faq"
        onClick={closeMobile}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        FAQ
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

        <nav className="hidden items-center gap-6 md:flex">{navItems}</nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleSearchNav}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            aria-label="Tra cứu tên miền"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleWhoisNav}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            aria-label="Tra cứu WHOIS"
          >
            <Shield className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
            aria-label="Mở menu"
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
