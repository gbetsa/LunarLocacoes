import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { settingsService } from "@/lib/services/SettingsService";
import { categoryService } from "@/lib/services/CategoryService";
import ClientLayout from "@/components/ClientLayout";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { authService } from "@/lib/services/AuthService";
import { AdminUser } from "@/lib/controllers/AuthController";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Busca categorias ativas para o Navbar global (Server Side)
  const categories = await categoryService.getCategoriesWithProducts();
  const whatsapp = await settingsService.getWhatsAppNumber();
  const user = await authService.getCurrentUser() as AdminUser | null;

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout
          categories={JSON.parse(JSON.stringify(categories))}
          whatsapp={whatsapp}
          user={user}
        >
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
