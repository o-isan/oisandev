import { NextResponse } from "next/server";

const API_URL = process.env.API_URL!;

export async function POST(req: Request) {
  // 1️⃣ Leer cookies desde headers
  const cookieHeader = req.headers.get("cookie") || "";
  const cookiesMap = Object.fromEntries(
    cookieHeader.split("; ").map(c => {
      const [key, ...v] = c.split("=");
      return [key, decodeURIComponent(v.join("="))];
    })
  );

  const refresh = cookiesMap["refresh_token"];

  console.log("🔥 REFRESH TOKEN:", refresh);

  if (!refresh) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  // 2️⃣ Llamar al backend Django para renovar access token
  const res = await fetch(`${API_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Refresh inválido" }, { status: 401 });
  }

  const data = await res.json();

  // 3️⃣ Crear respuesta con cookie HTTP-only
  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });

  return response;
}
