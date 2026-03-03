import { NextRequest, NextResponse } from "next/server";

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
      : typeof (d as any).registrarName === "string"
        ? (d as any).registrarName
        : undefined;
  const createdDate =
    typeof d.createdDate === "string"
      ? d.createdDate
      : typeof (d as any).creationDate === "string"
        ? (d as any).creationDate
        : typeof (d as any).created_date === "string"
          ? (d as any).created_date
          : undefined;
  const expiryDate =
    typeof d.expiryDate === "string"
      ? d.expiryDate
      : typeof (d as any).expirationDate === "string"
        ? (d as any).expirationDate
        : typeof (d as any).expiry_date === "string"
          ? (d as any).expiry_date
          : undefined;
  let nameservers: string[] | undefined;
  if (Array.isArray(d.nameservers)) {
    nameservers = d.nameservers.filter((n): n is string => typeof n === "string");
  } else if (Array.isArray((d as any).nameServers)) {
    nameservers = (d as any).nameServers.filter((n: unknown): n is string => typeof n === "string");
  } else if (Array.isArray((d as any).nameservers)) {
    nameservers = (d as any).nameservers.filter((n: unknown): n is string => typeof n === "string");
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
  }

  const token = process.env.DOMAIN_CHECK_API_TOKEN;
  const whoisUrl = process.env.WHOIS_API_URL ?? WHOIS_API_URL_DEFAULT;

  if (token) {
    try {
      const url = new URL(whoisUrl);
      url.searchParams.set("domain", domain);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const normalized = normalizeWhoisResponse(data, domain);
        if (normalized) {
          return NextResponse.json(normalized);
        }
        const fallbackRaw =
          typeof data === "object" && data !== null && typeof (data as any).rawData === "string"
            ? (data as any).rawData
            : undefined;
        return NextResponse.json({
          domain,
          ...(fallbackRaw && { raw: fallbackRaw }),
          ...(typeof data === "object" && data !== null ? data : { raw: JSON.stringify(data) }),
        });
      }
    } catch {
      // Fall through to fallback
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://whois.freeaiapi.xyz/?name=${encodeURIComponent(domain)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(generateFallbackWhois(domain));
    }

    const data = await response.json();
    const normalized = normalizeWhoisResponse(data, domain);
    return NextResponse.json(normalized ?? { domain, ...data });
  } catch {
    return NextResponse.json(generateFallbackWhois(domain));
  }
}

function generateFallbackWhois(domain: string) {
  // Generate a helpful fallback when external WHOIS isn't available
  return {
    domain,
    raw: `Domain Name: ${domain.toUpperCase()}\nRegistry Domain ID: Not available\nRegistrar WHOIS Server: whois lookup unavailable\nUpdated Date: N/A\nCreation Date: N/A\nExpiry Date: N/A\nRegistrar: N/A\nRegistrant Organization: N/A\nRegistrant Country: N/A\n\nNote: Live WHOIS data is currently unavailable. Try again later or use a dedicated WHOIS service for detailed results.`,
    registrar: "N/A",
    createdDate: "N/A",
    expiryDate: "N/A",
    nameservers: [],
    status: "WHOIS lookup unavailable",
  };
}
