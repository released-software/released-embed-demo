import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={className ? `button ${className}` : "button"}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {/* Label stays in the layout while loading so the button keeps its width */}
      <span className="button-label">{children}</span>
      {loading && <span className="button-spinner" aria-hidden="true" />}
    </button>
  );
}
