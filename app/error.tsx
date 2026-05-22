"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">Đã xảy ra lỗi</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Không thể tải trang. Thử tải lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Thử lại</Button>
        <Button variant="outline" asChild>
          <Link href="/">Trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
