import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Termo" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-[#6e5c62] text-white antialiased select-none">{children}</body>
    </html>
  );
}
