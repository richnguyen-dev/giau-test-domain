import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getCached, getClientIp, setCache } from "@/lib/api-guard";

const POPULAR_TLDS = [".com", ".net", ".org", ".io", ".dev", ".co", ".app", ".xyz", ".me", ".info"];

function sanitizeDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, "");
  domain = domain.replace(/\/.*$/, "");
  const parts = domain.split(".");
  if (parts.length >= 2 && POPULAR_TLDS.includes("." + parts[parts.length - 1])) {
    return parts.slice(0, -1).join(".");
  }
  return parts[0] || domain;
}

async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
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
        // fallback DNS
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
    if (data.Status === 3) return true;
    if (data.Answer && data.Answer.length > 0) return false;

    const nsResponse = await fetch(
      `https://dns.google/resolve?name=${domain}&type=NS`,
      { signal: AbortSignal.timeout(3000) }
    );
    const nsData = await nsResponse.json();
    if (nsData.Status === 3) return true;
    if (nsData.Answer && nsData.Answer.length > 0) return false;
    return true;
  } catch {
    return true;
  }
}

function inferAvailabilityFromExternal(payload: unknown, domain: string): boolean | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  if (typeof p.available === "boolean") return p.available;

  if (typeof p.status === "string") {
    const status = p.status.toLowerCase();
    if (status.includes("available")) return true;
    if (status.includes("unavailable") || status.includes("taken")) return false;
  }

  if (!Array.isArray(payload)) {
    const direct = p[domain];
    if (direct && typeof direct === "object") {
      return inferAvailabilityFromExternal(direct, domain);
    }

    if (Array.isArray(p.results)) {
      const item = (p.results as unknown[]).find(
        (x) => x && typeof x === "object" && (x as Record<string, unknown>).domain === domain
      );
      if (item) return inferAvailabilityFromExternal(item, domain);
    }

    if (Array.isArray(p.data)) {
      const item = (p.data as unknown[]).find(
        (x) => x && typeof x === "object" && (x as Record<string, unknown>).domain === domain
      );
      if (item) return inferAvailabilityFromExternal(item, domain);
    }

    if (p.data && typeof p.data === "object") {
      const nested = (p.data as Record<string, unknown>)[domain];
      if (nested && typeof nested === "object") {
        return inferAvailabilityFromExternal(nested, domain);
      }
    }
  }

  if (Array.isArray(payload)) {
    const item = payload.find(
      (x) => x && typeof x === "object" && (x as Record<string, unknown>).domain === domain
    );
    if (item) return inferAvailabilityFromExternal(item, domain);
  }

  return null;
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

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu. Thử lại sau.", retryAfter: rate.retryAfter },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  const baseName = sanitizeDomain(query);
  if (!baseName || baseName.length < 1) {
    return NextResponse.json({ error: "Invalid domain name" }, { status: 400 });
  }

  const cacheKey = `check:${baseName}`;
  const cached = getCached<{ baseName: string; results: unknown[]; source: string }>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  const source = process.env.DOMAIN_CHECK_API_TOKEN ? "api" : "dns";

  const results = await Promise.all(
    POPULAR_TLDS.map(async (tld) => {
      const fullDomain = `${baseName}${tld}`;
      const available = await checkDomainAvailability(fullDomain);
      const price = generatePrice(tld, available);
      return { domain: fullDomain, tld, available, price };
    })
  );

  const payload = { baseName, results, source };
  setCache(cacheKey, payload);

  return NextResponse.json(payload);
}
