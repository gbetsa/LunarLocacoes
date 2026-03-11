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
  title: {
    default: "Lunar Locações | Equipamentos e Soluções para Locação",
    template: "%s | Lunar Locações",
  },
  description:
    "Equipamentos, mobiliários e itens diversos para locação com qualidade, rapidez e praticidade. Transforme suas necessidades em soluções de locação imediata.",
  keywords: [
    "locação de equipamentos",
    "aluguel de equipamentos",
    "locação de móveis",
    "lunar locações",
    "equipamentos para eventos",
    "aluguel de itens",
  ],
  authors: [{ name: "Lunar Locações" }],
  creator: "Lunar Locações",
  metadataBase: new URL("https://lunarlocacoes.com.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://lunarlocacoes.com.br",
    siteName: "Lunar Locações",
    title: "Lunar Locações | Equipamentos e Soluções para Locação",
    description:
      "Equipamentos, mobiliários e itens diversos para locação com qualidade, rapidez e praticidade.",
    images: [
      {
        url: "/assets/lunar-logo.png",
        width: 512,
        height: 512,
        alt: "Lunar Locações Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Lunar Locações | Equipamentos e Soluções para Locação",
    description:
      "Equipamentos, mobiliários e itens diversos para locação com qualidade, rapidez e praticidade.",
    images: ["/assets/lunar-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, whatsapp, user] = await Promise.all([
    categoryService.getCategoriesWithProducts(),
    settingsService.getWhatsAppNumber(),
    authService.getCurrentUser() as Promise<AdminUser | null>
  ]);

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
