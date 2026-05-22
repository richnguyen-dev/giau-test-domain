import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getCached, getClientIp, setCache } from "@/lib/api-guard";

const WHOIS_API_URL_DEFAULT = "https://soc.socjsc.com/domain/whois";

function getPayload(apiData: unknown): Record<string, unknown> | null {
  if (!apiData || typeof apiData !== "object") return null;
  const d = apiData as Record<string, unknown>;
  if (d.data && typeof d.data === "object" && d.data !== null) return d.data as Record<string, unknown>;
  if (d.result && typeof d.result === "object" && d.result !== null) return d.result as Record<string, unknown>;
  return d;
}

function normalizeWhoisResponse(apiData: unknown, domain: string) {
  const d = getPayload(apiData);
  if (!d) return null;
  const raw =
    typeof d.raw === "string"
      ? d.raw
      : typeof d.rawData === "string"
        ? d.rawData
        : typeof d.whois === "string"
          ? d.whois
          : undefined;
  const registrar =
    typeof d.registrar === "string"
      ? d.registrar
      : typeof (d as Record<string, unknown>).registrarName === "string"
        ? ((d as Record<string, unknown>).registrarName as string)
        : undefined;
  const createdDate =
    typeof d.createdDate === "string"
      ? d.createdDate
      : typeof (d as Record<string, unknown>).creationDate === "string"
        ? ((d as Record<string, unknown>).creationDate as string)
        : typeof (d as Record<string, unknown>).created_date === "string"
          ? ((d as Record<string, unknown>).created_date as string)
          : undefined;
  const expiryDate =
    typeof d.expiryDate === "string"
      ? d.expiryDate
      : typeof (d as Record<string, unknown>).expirationDate === "string"
        ? ((d as Record<string, unknown>).expirationDate as string)
        : typeof (d as Record<string, unknown>).expiry_date === "string"
          ? ((d as Record<string, unknown>).expiry_date as string)
          : undefined;
  let nameservers: string[] | undefined;
  if (Array.isArray(d.nameservers)) {
    nameservers = d.nameservers.filter((n): n is string => typeof n === "string");
  } else if (Array.isArray((d as Record<string, unknown>).nameServers)) {
    nameservers = ((d as Record<string, unknown>).nameServers as unknown[]).filter(
      (n): n is string => typeof n === "string"
    );
  }
  const status = typeof d.status === "string" ? d.status : undefined;

  return {
    domain,
    ...(raw && { raw }),
    ...(registrar && { registrar }),
    ...(createdDate && { createdDate }),
    ...(expiryDate && { expiryDate }),
    ...(nameservers && nameservers.length > 0 && { nameservers }),
    ...(status && { status }),
  };
}

function generateFallbackWhois(domain: string) {
  return {
    domain,
    raw: `Domain Name: ${domain.toUpperCase()}\nRegistry Domain ID: Not available\nRegistrar WHOIS Server: whois lookup unavailable\nUpdated Date: N/A\nCreation Date: N/A\nExpiry Date: N/A\nRegistrar: N/A\nRegistrant Organization: N/A\nRegistrant Country: N/A\n\nNote: Live WHOIS data is currently unavailable. Try again later or use a dedicated WHOIS service for detailed results.`,
    registrar: "N/A",
    createdDate: "N/A",
    expiryDate: "N/A",
    nameservers: [] as string[],
    status: "WHOIS lookup unavailable",
  };
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
  const domain = searchParams.get("domain")?.trim().toLowerCase();

  if (!domain) {
    return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
  }

  const cacheKey = `whois:${domain}`;
  const cached = getCached<Record<string, unknown>>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  const token = process.env.DOMAIN_CHECK_API_TOKEN;
  const whoisUrl = process.env.WHOIS_API_URL ?? WHOIS_API_URL_DEFAULT;

  if (token) {
    try {
      const url = new URL(whoisUrl);
      url.searchParams.set("domain", domain);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const data = await response.json();
        const normalized = normalizeWhoisResponse(data, domain);
        if (normalized) {
          setCache(cacheKey, normalized);
          return NextResponse.json(normalized);
        }
        const fallbackRaw =
          typeof data === "object" && data !== null && typeof (data as Record<string, unknown>).rawData === "string"
            ? ((data as Record<string, unknown>).rawData as string)
            : undefined;
        const payload = {
          domain,
          ...(fallbackRaw && { raw: fallbackRaw }),
          ...(typeof data === "object" && data !== null ? data : { raw: JSON.stringify(data) }),
        };
        setCache(cacheKey, payload);
        return NextResponse.json(payload);
      }
    } catch {
      // fall through
    }
  }

  try {
    const response = await fetch(
      `https://whois.freeaiapi.xyz/?name=${encodeURIComponent(domain)}`,
      { signal: AbortSignal.timeout(8000) }
    );

    if (!response.ok) {
      const fallback = generateFallbackWhois(domain);
      setCache(cacheKey, fallback);
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const normalized = normalizeWhoisResponse(data, domain);
    const payload = normalized ?? { domain, ...(typeof data === "object" ? data : {}) };
    setCache(cacheKey, payload);
    return NextResponse.json(payload);
  } catch {
    const fallback = generateFallbackWhois(domain);
    setCache(cacheKey, fallback);
    return NextResponse.json(fallback);
  }
}
