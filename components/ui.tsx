// CSS variable references — works with both light and dark themes
export const cv = {
  bg:          'var(--bg)',
  surface:     'var(--surface)',
  surfaceDeep: 'var(--surface-deep)',
  border:      'var(--border)',
  primary:     'var(--primary)',
  primaryLight:'var(--primary-lt)',
  text:        'var(--text)',
  textMuted:   'var(--text-muted)',
  textDim:     'var(--text-dim)',
  gold:        'var(--gold)',
};

// Keep static colors for things that shouldn't change with theme
export const colors = cv;

export const inputCls = 'rounded-lg px-3 py-2.5 w-full border focus:outline-none focus:ring-2 transition-all text-sm';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${inputCls} ${props.className ?? ''}`}
      style={{
        backgroundColor: cv.surfaceDeep,
        borderColor: cv.border,
        color: cv.text,
        ...props.style,
      }}
    />
  );
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputCls} ${props.className ?? ''}`}
      style={{
        backgroundColor: cv.surfaceDeep,
        borderColor: cv.border,
        color: cv.text,
        ...props.style,
      }}
    >
      {children}
    </select>
  );
}

export function Btn({
  children,
  full,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { full?: boolean; variant?: 'primary' | 'outline' }) {
  const base = `px-5 py-2.5 rounded-lg font-display font-bold uppercase tracking-wide text-sm transition-all hover:brightness-110 active:scale-95 ${full ? 'w-full' : ''} ${props.className ?? ''}`;
  const style =
    variant === 'outline'
      ? { border: `1.5px solid ${cv.primary}`, color: cv.primary, backgroundColor: 'transparent', ...props.style }
      : { backgroundColor: cv.primary, color: cv.bg, ...props.style };

  return (
    <button {...props} className={base} style={style}>
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{ backgroundColor: cv.surface, borderColor: cv.border }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-3" style={{ color: cv.primaryLight }}>
      {children}
    </h2>
  );
}
