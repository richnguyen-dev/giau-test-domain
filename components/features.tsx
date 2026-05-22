"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, Search, Shield, Zap } from "lucide-react";
import { scrollToSearchSection } from "@/lib/nav";
import { useLanguage } from "@/components/language-provider";

export function Features() {
  const router = useRouter();
  const { t } = useLanguage();

  const features = [
    { icon: Search, titleKey: "features.fastTitle", descKey: "features.fastDesc", action: "search" as const },
    { icon: Shield, titleKey: "features.whoisTitle", descKey: "features.whoisDesc", action: "whois" as const },
    { icon: Zap, titleKey: "features.buyTitle", descKey: "features.buyDesc", action: "search" as const },
    { icon: Globe, titleKey: "features.tldsTitle", descKey: "features.tldsDesc", action: "search" as const },
  ];

  const handleFeatureClick = useCallback(
    (action: "search" | "whois") => {
      if (action === "whois") {
        router.push("/whois");
        return;
      }
      scrollToSearchSection();
    },
    [router]
  );

  return (
    <section className="border-t border-border/50 bg-secondary/20 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
            {t("features.sectionTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-pretty">
            {t("features.sectionSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <button
              key={feature.titleKey}
              type="button"
              onClick={() => handleFeatureClick(feature.action)}
              className="group rounded-xl border border-border/50 bg-card p-6 text-left transition-all hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(feature.descKey)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
