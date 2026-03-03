import { NextRequest, NextResponse } from "next/server";

const POPULAR_TLDS = [".com", ".net", ".org", ".io", ".dev", ".co", ".app", ".xyz", ".me", ".info"];

function sanitizeDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, "");
  domain = domain.replace(/\/.*$/, "");
  // If they typed something like "example.com", extract just "example"
  const parts = domain.split(".");
  if (parts.length >= 2 && POPULAR_TLDS.includes("." + parts[parts.length - 1])) {
    return parts.slice(0, -1).join(".");
  }
  return parts[0] || domain;
}

async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
    // Ưu tiên dùng API bên ngoài nếu có cấu hình token
    const externalToken = process.env.DOMAIN_CHECK_API_TOKEN;
    const externalUrl =
      process.env.DOMAIN_CHECK_API_URL ?? "https://soc.socjsc.com/domain/check";

    if (externalToken) {
      try {
        const url = new URL(externalUrl);
        url.searchParams.set("domain", domain);
        url.searchParams.set("currency", "USD");

        const response = await fetch(url.toString(), {
          headers: {
            // Giả định API dùng header Authorization Bearer; có thể chỉnh lại theo tài liệu thực tế
            Authorization: `Bearer ${externalToken}`,
          },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          const inferred = inferAvailabilityFromExternal(data, domain);
          if (typeof inferred === "boolean") {
            return inferred;
          }
        }
      } catch {
        // Nếu API ngoài lỗi thì fallback sang kiểm tra DNS như cũ
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=A`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    const data = await response.json();
    // If Status is 3 (NXDOMAIN), the domain doesn't exist
    if (data.Status === 3) return true;
    // If there are answers, the domain is taken
    if (data.Answer && data.Answer.length > 0) return false;
    // If no answers but status is 0, it could still be registered (no A record)
    // Try NS record lookup
    const nsResponse = await fetch(
      `https://dns.google/resolve?name=${domain}&type=NS`,
      { signal: AbortSignal.timeout(3000) }
    );
    const nsData = await nsResponse.json();
    if (nsData.Status === 3) return true;
    if (nsData.Answer && nsData.Answer.length > 0) return false;
    return true;
  } catch {
    // If DNS lookup fails, assume it might be available
    return true;
  }
}

function inferAvailabilityFromExternal(payload: any, domain: string): boolean | null {
  if (!payload) return null;

  // Trường hợp đơn giản: trả về trực tiếp { available: boolean }
  if (typeof payload.available === "boolean") {
    return payload.available;
  }

  // Nếu có status kiểu "available" / "unavailable"
  if (typeof payload.status === "string") {
    const status = payload.status.toLowerCase();
    if (status.includes("available")) return true;
    if (status.includes("unavailable") || status.includes("taken")) return false;
  }

  // Nếu là map theo tên miền: { "example.com": { ... } }
  if (!Array.isArray(payload) && typeof payload === "object") {
    const direct = payload[domain];
    if (direct && typeof direct === "object") {
      return inferAvailabilityFromExternal(direct, domain);
    }

    if (Array.isArray(payload.results)) {
      const item = payload.results.find((x: any) => x && x.domain === domain);
      if (item) return inferAvailabilityFromExternal(item, domain);
    }

    if (Array.isArray(payload.data)) {
      const item = payload.data.find((x: any) => x && x.domain === domain);
      if (item) return inferAvailabilityFromExternal(item, domain);
    }

    if (payload.data && typeof payload.data === "object") {
      const nested = payload.data[domain];
      if (nested && typeof nested === "object") {
        return inferAvailabilityFromExternal(nested, domain);
      }
    }
  }

  // Nếu là mảng [{ domain, available, ... }]
  if (Array.isArray(payload)) {
    const item = payload.find((x) => x && x.domain === domain);
    if (item) return inferAvailabilityFromExternal(item, domain);
  }

  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  const baseName = sanitizeDomain(query);
  if (!baseName || baseName.length < 1) {
    return NextResponse.json({ error: "Invalid domain name" }, { status: 400 });
  }

  const results = await Promise.all(
    POPULAR_TLDS.map(async (tld) => {
      const fullDomain = `${baseName}${tld}`;
      const available = await checkDomainAvailability(fullDomain);
      const price = generatePrice(tld, available);
      return {
        domain: fullDomain,
        tld,
        available,
        price,
      };
    })
  );

  return NextResponse.json({ baseName, results });
}

function generatePrice(tld: string, available: boolean): string {
  if (!available) return "N/A";
  const prices: Record<string, string> = {
    ".com": "$11.99",
    ".net": "$12.99",
    ".org": "$9.99",
    ".io": "$32.99",
    ".dev": "$14.99",
    ".co": "$24.99",
    ".app": "$14.99",
    ".xyz": "$2.99",
    ".me": "$8.99",
    ".info": "$4.99",
  };
  return prices[tld] || "$9.99";
}
