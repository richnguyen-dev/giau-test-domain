import { Globe, Search, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Tra cuu nhanh",
    description: "Kiem tra tinh kha dung cua hang chuc ten mien chi trong vai giay.",
  },
  {
    icon: Shield,
    title: "WHOIS chi tiet",
    description: "Xem day du thong tin dang ky, nha cung cap va ngay het han.",
  },
  {
    icon: Zap,
    title: "Dang ky ngay",
    description: "Mua ten mien truc tiep voi gia tot nhat tu cac nha cung cap uy tin.",
  },
  {
    icon: Globe,
    title: "Nhieu duoi ten mien",
    description: "Ho tro .com, .net, .org, .io, .dev, .co, .app va nhieu hon.",
  },
];

export function Features() {
  return (
    <section className="border-t border-border/50 bg-secondary/20 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
            Moi thu ban can de tim ten mien
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-pretty">
            Cong cu tra cuu ten mien nhanh chong, chinh xac va de su dung
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.03]"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
