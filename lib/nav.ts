export function scrollToSearchSection() {
  const section = document.getElementById("search");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  window.setTimeout(() => {
    document.getElementById("domain-search-input")?.focus({ preventScroll: true });
  }, 350);
}

export function focusWhoisInput() {
  window.setTimeout(() => {
    document.getElementById("whois-domain-input")?.focus({ preventScroll: true });
  }, 100);
}
