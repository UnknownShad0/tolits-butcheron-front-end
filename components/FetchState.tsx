export function FetchError({ message }: { message: string }) {
  return (
    <div className="px-4 py-3 rounded-lg border text-sm font-semibold" style={{ backgroundColor: '#2A0D0D', borderColor: '#6B2A2A', color: '#F87171' }}>
      ⚠️ {message}
    </div>
  );
}

export function FetchLoading() {
  return (
    <div className="text-sm py-8 text-center" style={{ color: 'var(--text-dim)' }}>
      Loading…
    </div>
  );
}
