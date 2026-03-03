"use client";

import { Globe, Search, Shield } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Globe className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            DomainScope
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            Tra cứu
          </Link>
          <Link
            href="#"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Shield className="h-3.5 w-3.5" />
            WHOIS
          </Link>
        </nav>
      </div>
    </header>
  );
}
