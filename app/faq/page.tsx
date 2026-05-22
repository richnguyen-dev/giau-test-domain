import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "Kết quả “còn trống” có chính xác không?",
    a: "Khi có DOMAIN_CHECK_API_TOKEN, hệ thống dùng API registrar để kiểm tra chính xác hơn. Không có token, app dùng DNS — có thể sai với domain đã đăng ký nhưng chưa trỏ bản ghi.",
  },
  {
    q: "Giá hiển thị là giá thật không?",
    a: "Giá trên DomainScope là tham khảo (USD/năm). Giá thực tế phụ thuộc nhà đăng ký, khuyến mãi và TLD — hãy kiểm tra tại Namecheap hoặc registrar bạn chọn.",
  },
  {
    q: "WHOIS hiển thị N/A là sao?",
    a: "Một số TLD hoặc domain bật privacy sẽ ẩn thông tin. Khi API lỗi, app hiển thị dữ liệu dự phòng — thử lại hoặc dùng who.is.",
  },
  {
    q: "Có thể chia sẻ kết quả tra cứu không?",
    a: "Có. Sau khi tra cứu, URL sẽ có dạng /?q=tenmien — copy và gửi cho người khác.",
  },
  {
    q: "Giới hạn số lần tra cứu?",
    a: "API giới hạn khoảng 40 yêu cầu/phút/IP để tránh lạm dụng. Kết quả được cache 5 phút cho cùng tên miền.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Câu hỏi thường gặp</h1>
        <p className="mb-10 text-muted-foreground">
          Giải thích nhanh về DomainScope.{" "}
          <Link href="/" className="text-primary hover:underline">
            Về trang tra cứu
          </Link>
        </p>

        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <article
              key={item.q}
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
