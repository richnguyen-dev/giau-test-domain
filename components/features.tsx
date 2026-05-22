"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, Search, Shield, Zap } from "lucide-react";
import { scrollToSearchSection } from "@/lib/nav";

const features = [
  {
    icon: Search,
    title: "Tra cứu nhanh",
    description: "Kiểm tra nhiều tên trong vài giây.",
    action: "search" as const,
  },
  {
    icon: Shield,
    title: "Thông tin WHOIS",
    description: "Xem ai đăng ký, ngày tạo, ngày hết hạn.",
    action: "whois" as const,
  },
  {
    icon: Zap,
    title: "Mua tên miền",
    description: "Chuyển tới trang mua, giá tham khảo.",
    action: "search" as const,
  },
  {
    icon: Globe,
    title: "Nhiều đuôi",
    description: ".com, .net, .io, .dev, .co...",
    action: "search" as const,
  },
];

export function Features() {
  const router = useRouter();

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
            Tìm tên miền dễ dàng
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-pretty">
            Nhanh, đơn giản
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <button
              key={feature.title}
              type="button"
              onClick={() => handleFeatureClick(feature.action)}
              className="group rounded-xl border border-border/50 bg-card p-6 text-left transition-all hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
