# DomainScope

Công cụ tra cứu tên miền: kiểm tra còn trống đa TLD, xem WHOIS, link đăng ký Namecheap.

## Tính năng

- Tra cứu 10 TLD phổ biến song song
- URL chia sẻ: `/?q=tenmien`
- Lọc/sắp xếp kết quả, lịch sử tra cứu (localStorage)
- Trang WHOIS riêng: `/whois`
- FAQ: `/faq`
- Rate limit + cache API (5 phút)

## Chạy local

```bash
npm install
cp .env.example .env.local
# Thêm DOMAIN_CHECK_API_TOKEN vào .env.local (tùy chọn)
npm run dev
```

Mở http://localhost:3000

## Biến môi trường

| Biến | Mô tả |
|------|--------|
| `DOMAIN_CHECK_API_TOKEN` | Token Bearer cho API SOC (khuyến nghị) |
| `DOMAIN_CHECK_API_URL` | URL API check (mặc định soc.socjsc.com) |
| `WHOIS_API_URL` | URL API WHOIS |

Không có token: app dùng DNS Google (ước lượng, có thể sai).

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — chạy bản build

## API

- `GET /api/domain/check?q=tenmien`
- `GET /api/domain/whois?domain=example.com`
