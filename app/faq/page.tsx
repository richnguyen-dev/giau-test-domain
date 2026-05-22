"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function FaqPage() {
  const { t } = useLanguage();

  const faqItems = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-foreground">{t("faq.title")}</h1>
        <p className="mb-10 text-muted-foreground">
          {t("faq.intro")}{" "}
          <Link href="/" className="text-primary hover:underline">
            {t("faq.backLink")}
          </Link>
        </p>

        <div className="space-y-6">
          {faqItems.map((item, i) => (
            <article
              key={i}
              className="rounded-xl border border-border bg-secondary/20 p-6"
            >
              <h2 className="mb-2 font-semibold text-foreground">{item.q}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
