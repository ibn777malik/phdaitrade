const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

export async function apiPost(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}
