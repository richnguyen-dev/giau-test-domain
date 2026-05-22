const STORAGE_KEY = "domainscope-search-history";
const MAX_ITEMS = 10;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return getSearchHistory();

  const prev = getSearchHistory().filter((q) => q !== trimmed);
  const next = [trimmed, ...prev].slice(0, MAX_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return next;
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
