'use server'
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const API_URL = process.env.API_URL!

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value || null
}

export async function refreshAccessToken(): Promise<boolean> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refresh_token")?.value
  if (!refreshToken) return false

  const res = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!res.ok) return false

  const data = await res.json()
  cookieStore.set("access_token", data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  })
  return true
}

export async function fetchUser(): Promise<Response> {
  const cookieStore = await cookies()
  const access = cookieStore.get("access_token")?.value
  if (!access) return new Response(null, { status: 401 })

  return fetch(`${API_URL}/auth/user/`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  })
}


type LoginResult = {
  success: boolean
  error?: string
}

export async function login(
  _prevState: LoginResult,
  formData: FormData
): Promise<LoginResult> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) return { success: false, error: 'Faltan credenciales' }

  let data: { access: string; refresh: string; detail?: string } | undefined
  try {
    console.log('Login attempt, API_URL:', API_URL)
    const res = await fetch(`${API_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      cache: 'no-store',
    })
    console.log('fetch done, status:', res.status)

    data = await res.json()

    if (!res.ok) {
      if (data && data.detail) {
        return { success: false, error: data.detail }
      }
      return { success: false, error: 'Credenciales inválidas' }
    }
  } catch (err) {
    console.error('Fetch error:', err)
    return { success: false, error: 'Error de conexión con el servidor' }
  }

  if (!data) return { success: false, error: 'Respuesta vacía del servidor' }

  // Guardar cookies
  const cookieStore = await cookies()
  cookieStore.set('access_token', data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15,
    path: '/',
  })
  cookieStore.set('refresh_token', data.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  // Redirect limpio
  redirect('/admin/panel')
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()

  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
}

export async function fetchWithAuth(
  input: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value

  const res = await fetch(`${API_URL}${input}`, {
    method: options.method ?? "GET",
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: "no-store",
  })

  if (res.status !== 401) return res

  // 🔁 Intentar refresh
  const refreshToken = cookieStore.get("refresh_token")?.value
  if (!refreshToken) return res

  const refreshRes = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  })

  if (!refreshRes.ok) return res

  const data = await refreshRes.json()

  // 💾 Guardar nuevo access token
  cookieStore.set("access_token", data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  })

  // 🔁 Reintentar request original
  return fetch(`${API_URL}${input}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${data.access}`,
    },
    cache: "no-store",
  })
}
