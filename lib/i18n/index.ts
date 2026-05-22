import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

export type { Locale, Dictionary };
export { dictionaries };

const STORAGE_KEY = "domainscope-locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "vi";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "vi") return stored;
  } catch {
    // ignore
  }
  return "vi";
}

export function setStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

type DictValue = string | { [key: string]: DictValue };

function getNested(obj: DictValue, path: string): string | undefined {
  const parts = path.split(".");
  let current: DictValue = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] as DictValue;
  let text = getNested(dict, key) ?? getNested(dictionaries.vi as DictValue, key) ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}
