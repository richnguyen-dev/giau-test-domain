import { Globe, Search, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Tra cứu nhanh",
    description: "Kiểm tra tính khả dụng của hàng chục tên miền chỉ trong vài giây.",
  },
  {
    icon: Shield,
    title: "WHOIS chi tiết",
    description: "Xem đầy đủ thông tin đăng ký, nhà cung cấp và ngày hết hạn.",
  },
  {
    icon: Zap,
    title: "Đăng ký ngay",
    description: "Mua tên miền trực tiếp với giá tốt nhất từ các nhà cung cấp uy tín.",
  },
  {
    icon: Globe,
    title: "Nhiều đuôi tên miền",
    description: "Hỗ trợ .com, .net, .org, .io, .dev, .co, .app và nhiều hơn nữa.",
  },
];

export function Features() {
  return (
    <section className="border-t border-border/50 bg-secondary/20 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
            Mọi thứ bạn cần để tìm tên miền
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-pretty">
            Công cụ tra cứu tên miền nhanh chóng, chính xác và dễ sử dụng
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
