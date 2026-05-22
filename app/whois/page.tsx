"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhoisPanel } from "@/components/whois-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

export default function WhoisPage() {
  const [domain, setDomain] = useState("");
  const [lookupDomain, setLookupDomain] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = domain.trim().toLowerCase();
      if (!trimmed) return;
      setIsSubmitting(true);
      setLookupDomain(trimmed);
      setIsSubmitting(false);
    },
    [domain]
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Tra cứu WHOIS</h1>
        <p className="mb-8 text-muted-foreground">
          Nhập tên miền đầy đủ (ví dụ: <span className="font-mono text-primary">example.com</span>).
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="h-12 pl-11 bg-secondary border-border"
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !domain.trim()} className="h-12 px-8">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              "Xem WHOIS"
            )}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Hoặc{" "}
          <Link href="/" className="text-primary hover:underline">
            tra cứu còn trống
          </Link>{" "}
          trên trang chủ.
        </p>
      </main>

      <Footer />

      <WhoisPanel domain={lookupDomain} onClose={() => setLookupDomain(null)} />
    </div>
  );
}
