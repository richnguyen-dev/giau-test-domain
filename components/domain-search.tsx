"use client";

import { useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchHistory } from "@/components/search-history";
import { useLanguage } from "@/components/language-provider";

const QUICK_TLDS = [".com", ".net", ".io", ".dev", ".co"];
const DEFAULT_EXAMPLE = "tenmien";

interface DomainSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  history: string[];
  onHistoryChange: (items: string[]) => void;
}

export function DomainSearch({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  history,
  onHistoryChange,
}: DomainSearchProps) {
  const { t } = useLanguage();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) onSearch(query.trim());
    },
    [query, onSearch]
  );

  const runQuickSearch = useCallback(
    (base: string) => {
      const name = base.trim() || query.trim() || DEFAULT_EXAMPLE;
      onQueryChange(name);
      onSearch(name);
    },
    [query, onQueryChange, onSearch]
  );

  const example = query.trim() || DEFAULT_EXAMPLE;

  return (
    <section id="search" className="relative scroll-mt-20 overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {t("search.badge")}
        </div>

        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {t("search.title")}{" "}
          <span className="text-primary">{t("search.titleHighlight")}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-pretty text-base text-muted-foreground md:text-lg leading-relaxed">
          {t("search.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="domain-search-input"
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t("search.placeholder")}
              className="h-12 pl-11 pr-4 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-base"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("search.checking")}
              </>
            ) : (
              t("search.button")
            )}
          </Button>
        </form>

        <SearchHistory
          items={history}
          onSelect={(item) => {
            onQueryChange(item);
            onSearch(item);
          }}
          onClear={() => onHistoryChange([])}
        />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="w-full text-center sm:w-auto">{t("search.tldHint")}</span>
          {QUICK_TLDS.map((tld) => (
            <button
              key={tld}
              type="button"
              onClick={() => runQuickSearch(example)}
              className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono transition-colors hover:border-primary/30 hover:text-foreground"
              title={t("search.lookupTitle", { domain: example + tld })}
            >
              {example + tld}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
