// Generic API helper (no UI toast here)

export async function api<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  body?: any,
): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Propagate error to caller; UI toast can be shown where the promise is used.
    throw new Error(data?.message || 'Request failed');
  }
  return data as T;
}
