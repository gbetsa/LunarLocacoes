import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunar Locações",
  description: "Transforme suas necessidades em soluções de locação imediata",
};

import ClientLayout from "@/components/ClientLayout";
import { categoryService } from "@/lib/services/CategoryService";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Busca categorias ativas para o Navbar global (Server Side)
  const categories = await categoryService.getCategoriesWithProducts();

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout categories={JSON.parse(JSON.stringify(categories))}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
