"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, ShoppingCart, Eye, ExternalLink, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

export interface DomainResult {
  domain: string;
  tld: string;
  available: boolean;
  price: string;
}

type FilterMode = "all" | "available" | "taken";
type SortMode = "default" | "price-asc" | "price-desc" | "tld";

interface DomainResultsProps {
  results: DomainResult[];
  baseName: string;
  onWhoisLookup: (domain: string) => void;
}

function parsePrice(price: string): number {
  if (price === "N/A") return Infinity;
  const n = parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : Infinity;
}

export function DomainResults({ results, baseName, onWhoisLookup }: DomainResultsProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("default");

  const filtered = useMemo(() => {
    let list = [...results];
    if (filter === "available") list = list.filter((r) => r.available);
    if (filter === "taken") list = list.filter((r) => !r.available);

    if (sort === "price-asc") {
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sort === "price-desc") {
      list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sort === "tld") {
      list.sort((a, b) => a.tld.localeCompare(b.tld));
    } else {
      list.sort((a, b) => Number(b.available) - Number(a.available));
    }
    return list;
  }, [results, filter, sort]);

  const availableCount = results.filter((r) => r.available).length;

  const filterOptions = [
    ["all", "results.filterAll"],
    ["available", "results.filterAvailable"],
    ["taken", "results.filterTaken"],
  ] as const;

  return (
    <section id="results" className="mx-auto max-w-4xl px-6 pb-16">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {t("results.title")}{" "}
            <span className="font-mono text-primary">{baseName}</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("results.availableCount", {
              available: availableCount,
              total: results.length,
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5">
            {filterOptions.map(([key, labelKey]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                  filter === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="bg-transparent text-xs text-foreground outline-none"
            >
              <option value="default">{t("results.sortDefault")}</option>
              <option value="price-asc">{t("results.sortPriceAsc")}</option>
              <option value="price-desc">{t("results.sortPriceDesc")}</option>
              <option value="tld">{t("results.sortTld")}</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-border bg-secondary/30 py-8 text-center text-sm text-muted-foreground">
          {t("results.noResults")}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((result) => (
            <DomainResultRow
              key={result.domain}
              result={result}
              onWhoisLookup={onWhoisLookup}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function DomainResultRow({
  result,
  onWhoisLookup,
}: {
  result: DomainResult;
  onWhoisLookup: (domain: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`group flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
        result.available
          ? "border-primary/20 bg-primary/[0.03] hover:border-primary/40 hover:bg-primary/[0.06]"
          : "border-border bg-secondary/30 opacity-70 hover:opacity-90"
      }`}
    >
      <div className="flex items-center gap-3">
        {result.available ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-foreground sm:text-base">
            {result.domain}
          </span>
          <Badge
            variant={result.available ? "default" : "secondary"}
            className={`text-xs ${
              result.available
                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {result.available ? t("results.available") : t("results.taken")}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-8 sm:pl-0">
        {result.available && (
          <span className="mr-2 text-sm font-semibold text-primary">
            {result.price}
            <span className="text-xs font-normal text-muted-foreground">
              {t("results.perYear")}
            </span>
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onWhoisLookup(result.domain)}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          {t("results.whois")}
        </Button>
        {result.available ? (
          <Button
            size="sm"
            className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
            onClick={() => {
              toast.success(t("results.openingRegister"));
              window.open(
                `https://www.namecheap.com/domains/registration/results/?domain=${result.domain}`,
                "_blank"
              );
            }}
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            {t("results.buyNow")}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              window.open(
                `https://www.namecheap.com/domains/registration/results/?domain=${result.domain}`,
                "_blank"
              );
            }}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            {t("results.viewMore")}
          </Button>
        )}
      </div>
    </div>
  );
}
