const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error('Cannot reach the server. Make sure the backend is running on ' + BASE);
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
