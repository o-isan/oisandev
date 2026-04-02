import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "oisan.dev - Programador Backend",
  description: "Portfolio de Óscar de la Iglesia Santacruz. Artículos, proyectos ...",
  icons: {
    icon: [
      { url: '/favicon-x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
