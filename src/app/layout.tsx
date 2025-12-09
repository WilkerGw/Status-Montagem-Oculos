// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Usamos a Inter direto do Google (não precisa de arquivos locais)
import "./globals.css";

// Configura a fonte Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Óticas Vizz",
  description: "Sistema de acompanhamento de pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={inter.className} 
        suppressHydrationWarning={true} // Mantém a correção do erro de hidratação
      >
        {children}
      </body>
    </html>
  );
}