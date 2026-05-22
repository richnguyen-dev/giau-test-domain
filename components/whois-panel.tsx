"use client";

import { X, Loader2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";

interface WhoisData {
  domain?: string;
  raw?: string;
  registrar?: string;
  createdDate?: string;
  expiryDate?: string;
  nameservers?: string[];
  status?: string;
}

interface WhoisPanelProps {
  domain: string | null;
  onClose: () => void;
}

export function WhoisPanel({ domain, onClose }: WhoisPanelProps) {
  const { t } = useLanguage();
  const tRef = useRef(t);
  tRef.current = t;
  const [data, setData] = useState<WhoisData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!domain) return;
    setLoading(true);
    setData(null);

    fetch(`/api/domain/whois?domain=${encodeURIComponent(domain)}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() =>
        setData({
          raw: tRef.current("whois.error"),
        })
      )
      .finally(() => setLoading(false));
  }, [domain]);

  if (!domain) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm pt-20 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="font-semibold text-foreground">{t("whois.panelTitle")}</h3>
            <p className="mt-0.5 font-mono text-sm text-primary">{domain}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{t("whois.loading")}</p>
              </div>
            ) : data ? (
              <div className="space-y-6">
                {(data.registrar || data.createdDate || data.expiryDate) && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {data.registrar && data.registrar !== "N/A" && (
                      <InfoCard label={t("whois.registrar")} value={data.registrar} />
                    )}
                    {data.createdDate && data.createdDate !== "N/A" && (
                      <InfoCard label={t("whois.created")} value={data.createdDate} />
                    )}
                    {data.expiryDate && data.expiryDate !== "N/A" && (
                      <InfoCard label={t("whois.expiry")} value={data.expiryDate} />
                    )}
                  </div>
                )}

                {data.nameservers && data.nameservers.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("whois.nameservers")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.nameservers.map((ns, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-foreground"
                        >
                          {ns}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.raw && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t("whois.details")}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          navigator.clipboard.writeText(data.raw || "");
                          toast.success(t("whois.copied"));
                        }}
                      >
                        <Copy className="mr-1.5 h-3 w-3" />
                        {t("whois.copy")}
                      </Button>
                    </div>
                    <pre className="max-h-[300px] overflow-auto rounded-lg border border-border bg-secondary/30 p-4 font-mono text-xs text-muted-foreground leading-relaxed">
                      {data.raw}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("whois.noData")}
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between border-t border-border px-6 py-3">
          <p className="text-xs text-muted-foreground">{t("whois.privacyNote")}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => window.open(`https://who.is/whois/${domain}`, "_blank")}
          >
            <ExternalLink className="mr-1.5 h-3 w-3" />
            who.is
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
