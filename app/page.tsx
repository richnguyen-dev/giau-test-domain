"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { DomainSearch } from "@/components/domain-search";
import { DomainResults, type DomainResult } from "@/components/domain-results";
import { WhoisPanel } from "@/components/whois-panel";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { toast } from "sonner";


interface SearchResult {
  baseName: string;
  results: DomainResult[];
}

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [whoisDomain, setWhoisDomain] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setSearchResult(null);

    try {
      const res = await fetch(
        `/api/domain/check?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to check domain");
      const data = await res.json();
      setSearchResult(data);

      const available = data.results.filter(
        (r: DomainResult) => r.available
      ).length;
      if (available > 0) {
        toast.success(`Có ${available} tên còn trống!`);
      } else {
        toast.info("Không còn tên trống. Thử từ khác.");
      }
    } catch {
      toast.error("Lỗi. Thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleWhoisLookup = useCallback((domain: string) => {
    setWhoisDomain(domain);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <DomainSearch onSearch={handleSearch} isLoading={isLoading} />

        {searchResult && (
          <DomainResults
            results={searchResult.results}
            baseName={searchResult.baseName}
            onWhoisLookup={handleWhoisLookup}
          />
        )}

        {!searchResult && !isLoading && <Features />}
      </main>

      <Footer />

      <WhoisPanel
        domain={whoisDomain}
        onClose={() => setWhoisDomain(null)}
      />
    </div>
  );
}
