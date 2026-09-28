const configuredBase = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? ''

export function apiUrl(path: string) {
  return `${configuredBase}${path.startsWith('/') ? path : `/${path}`}`
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    credentials: 'include',
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
  })
  if (response.status === 401) {
    window.location.reload()
    throw new Error('Сессия завершена')
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(payload.error || `HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}
