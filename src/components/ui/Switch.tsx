// src/components/ui/Switch.tsx
//
// مفتاح التبديل (is_active / is_featured) كان منسوخاً حرفياً في SignageManager
// و PortfolioManager بنفس الـ markup بالضبط.
interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-(--muted)/50 border border-(--border)">
      <div>
        <p className="text-sm font-medium text-(--foreground)">{label}</p>
        {description && <p className="text-xs text-(--muted-foreground)">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? "bg-(--primary)" : "bg-(--muted)"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
            checked ? "inset-s-5" : "inset-s-1"
          }`}
        />
      </button>
    </div>
  );
}