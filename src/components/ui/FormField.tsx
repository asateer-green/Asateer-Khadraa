// src/components/ui/FormField.tsx
//
// يوحّد كل "px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) ..."
// المكرر عشرات المرات عبر جميع نماذج الإدخال في المشروع.
import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

const baseClass =
  "w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) " +
  "placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) " +
  "transition-shadow disabled:opacity-50 disabled:cursor-not-allowed";

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-(--foreground)">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-(--muted-foreground)">{hint}</p>}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} {...props} className={`${baseClass} ${className ?? ""}`} />
  ),
);
TextInput.displayName = "TextInput";

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} {...props} className={`${baseClass} resize-none ${className ?? ""}`} />
  ),
);
TextArea.displayName = "TextArea";