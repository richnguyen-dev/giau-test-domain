"use client";

import { Clock, X } from "lucide-react";
import { clearSearchHistory } from "@/lib/search-history";
import { useLanguage } from "@/components/language-provider";

interface SearchHistoryProps {
  items: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function SearchHistory({ items, onSelect, onClear }: SearchHistoryProps) {
  const { t } = useLanguage();

  if (items.length === 0) return null;

  return (
    <div className="mx-auto mt-4 max-w-xl text-left">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {t("history.title")}
        </span>
        <button
          type="button"
          onClick={() => {
            clearSearchHistory();
            onClear();
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3 w-3" />
          {t("history.clear")}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary/30"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
