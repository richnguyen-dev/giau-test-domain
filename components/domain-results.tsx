"use client";

import { CheckCircle2, XCircle, ShoppingCart, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface DomainResult {
  domain: string;
  tld: string;
  available: boolean;
  price: string;
}

interface DomainResultsProps {
  results: DomainResult[];
  baseName: string;
  onWhoisLookup: (domain: string) => void;
}

export function DomainResults({ results, baseName, onWhoisLookup }: DomainResultsProps) {
  const availableCount = results.filter((r) => r.available).length;

  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Kết quả:{" "}
            <span className="font-mono text-primary">{baseName}</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {availableCount}/{results.length} tên còn trống
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {results.map((result) => (
          <DomainResultRow
            key={result.domain}
            result={result}
            onWhoisLookup={onWhoisLookup}
          />
        ))}
      </div>
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
            {result.available ? "Còn trống" : "Đã có chủ"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-8 sm:pl-0">
        {result.available && (
          <span className="mr-2 text-sm font-semibold text-primary">
            {result.price}<span className="text-xs font-normal text-muted-foreground">/năm</span>
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onWhoisLookup(result.domain)}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          WHOIS
        </Button>
        {result.available ? (
          <Button
            size="sm"
            className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
            onClick={() => {
              toast.success("Đang mở trang đăng ký...");
              window.open(
                `https://www.namecheap.com/domains/registration/results/?domain=${result.domain}`,
                "_blank"
              );
            }}
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Mua ngay
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              window.open(`https://www.namecheap.com/domains/registration/results/?domain=${result.domain}`, "_blank");
            }}
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Xem thêm
          </Button>
        )}
      </div>
    </div>
  );
}
