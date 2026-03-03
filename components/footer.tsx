import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 text-primary" />
          <span>DomainScope</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Giá tham khảo. Kiểm tra tại nơi bán để biết giá đúng.
        </p>
      </div>
    </footer>
  );
}
