// src/components/ui/SafeImage.tsx
//
// كل صورة في المشروع تقريباً تحمل نفس onError اليدوي لإخفاء نفسها عند كسر الرابط.
// هذا المكوّن يوحّد السلوك بدل تكراره في كل ملف.
import type { ImgHTMLAttributes } from "react";

export function SafeImage({ className, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      className={className}
      onError={e => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
        onError?.(e);
      }}
    />
  );
}

// ── EmptyState ───────────────────────────────────────────────────────────
interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="p-12 text-center space-y-3">
      <p className="text-sm text-(--muted-foreground)">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-sm text-(--primary) hover:underline">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Loading skeleton ─────────────────────────────────────────────────────
export function ListSkeleton({ count = 4, rowClassName = "h-12" }: { count?: number; rowClassName?: string }) {
  return (
    <div className="p-6 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded-xl bg-(--muted) animate-pulse ${rowClassName}`} />
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square rounded-2xl bg-(--muted) animate-pulse" />
      ))}
    </div>
  );
}