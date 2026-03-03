import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
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
      // Fallback to a simulated WHOIS response
      return NextResponse.json(generateFallbackWhois(domain));
    }

    const data = await response.json();
    return NextResponse.json(data);
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
