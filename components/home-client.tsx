"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { DomainSearch } from "@/components/domain-search";
import { DomainResults, type DomainResult } from "@/components/domain-results";
import { WhoisPanel } from "@/components/whois-panel";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { AccuracyBanner } from "@/components/accuracy-banner";
import { toast } from "sonner";
import { addToSearchHistory, getSearchHistory } from "@/lib/search-history";
import { scrollToSearchSection } from "@/lib/nav";
import { useLanguage } from "@/components/language-provider";

interface SearchResult {
  baseName: string;
  results: DomainResult[];
  source?: "api" | "dns";
}

export function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [whoisDomain, setWhoisDomain] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const lastFetchedRef = useRef<string | null>(null);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const runSearch = useCallback(
    async (searchQuery: string, updateUrl = true) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;
      lastFetchedRef.current = trimmed;

      setIsLoading(true);
      setSearchResult(null);
      setQuery(trimmed);

      if (updateUrl) {
        router.replace(`/?q=${encodeURIComponent(trimmed)}`, { scroll: false });
      }

      try {
        const res = await fetch(`/api/domain/check?q=${encodeURIComponent(trimmed)}`);
        if (res.status === 429) {
          const err = await res.json();
          toast.error(t("toast.rateLimit", { seconds: err.retryAfter ?? 60 }));
          return;
        }
        if (!res.ok) throw new Error("Failed to check domain");

        const data: SearchResult = await res.json();
        setSearchResult(data);
        setHistory(addToSearchHistory(trimmed));

        const available = data.results.filter((r) => r.available).length;
        if (available > 0) {
          toast.success(t("toast.available", { count: available }));
        } else {
          toast.info(t("toast.noneAvailable"));
        }

        requestAnimationFrame(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } catch {
        toast.error(t("toast.error"));
      } finally {
        setIsLoading(false);
      }
    },
    [router, t]
  );

  useEffect(() => {
    const q = searchParams.get("q")?.trim();
    if (!q || q === lastFetchedRef.current) return;
    runSearch(q, false);
  }, [searchParams, runSearch]);

  useEffect(() => {
    if (searchParams.get("scroll") === "search") {
      scrollToSearchSection();
      const q = searchParams.get("q");
      const next = q ? `/?q=${encodeURIComponent(q)}` : "/";
      router.replace(next, { scroll: false });
    }
  }, [searchParams, router]);

  const handleWhoisLookup = useCallback((domain: string) => {
    setWhoisDomain(domain);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <DomainSearch
          query={query}
          onQueryChange={setQuery}
          onSearch={runSearch}
          isLoading={isLoading}
          history={history}
          onHistoryChange={setHistory}
        />

        {searchResult && (
          <>
            <div className="px-6">
              <AccuracyBanner source={searchResult.source ?? "dns"} />
            </div>
            <DomainResults
              results={searchResult.results}
              baseName={searchResult.baseName}
              onWhoisLookup={handleWhoisLookup}
            />
          </>
        )}

        {!searchResult && !isLoading && <Features />}
      </main>

      <Footer />

      <WhoisPanel domain={whoisDomain} onClose={() => setWhoisDomain(null)} />
    </div>
  );
}
