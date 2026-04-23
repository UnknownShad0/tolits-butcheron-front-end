// Shared design tokens & primitive UI components

export const colors = {
  bg: '#0D1B2A',
  surface: '#112236',
  surfaceDeep: '#0A1520',
  border: '#1E3A5F',
  primary: '#5BB8D4',
  primaryLight: '#7EC8E3',
  text: '#E8F4FD',
  textMuted: '#B8DFF0',
  textDim: '#4A7A9B',
  gold: '#FFD700',
};

export const inputCls = 'rounded-lg px-3 py-2.5 w-full border focus:outline-none focus:ring-2 focus:ring-[#5BB8D4] transition-all text-sm';
export const inputStyle = {
  backgroundColor: colors.surfaceDeep,
  borderColor: colors.border,
  color: colors.text,
};

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} style={{ ...inputStyle, ...props.style }} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputCls} ${props.className ?? ''}`} style={{ ...inputStyle, ...props.style }}>
      {children}
    </select>
  );
}

export function Btn({ children, full, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { full?: boolean }) {
  return (
    <button
      {...props}
      className={`px-5 py-2.5 rounded-lg font-display font-bold uppercase tracking-wide text-sm transition-all hover:brightness-110 active:scale-95 ${full ? 'w-full' : ''} ${props.className ?? ''}`}
      style={{ backgroundColor: colors.primary, color: colors.bg, ...props.style }}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border p-5 ${className}`} style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-3" style={{ color: colors.primaryLight }}>
      {children}
    </h2>
  );
}
