'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminToolbar from "@/components/admin/AdminToolbar";
import { WhatsAppProvider } from '@/context/WhatsAppContext';
import { AdminUser } from '@/lib/controllers/AuthController';

export default function ClientLayout({
    children,
    categories,
    whatsapp,
    user,
}: {
    children: React.ReactNode;
    categories: any[];
    whatsapp: string;
    user: AdminUser | null;
}) {
    const pathname = usePathname();

    // Ocultar Navbar em rotas de admin e login
    const hideNavbar = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    return (
        <WhatsAppProvider initialWhatsapp={whatsapp}>
            {!hideNavbar && <AdminToolbar user={user} />}
            {!hideNavbar && <Navbar categories={categories} user={user} />}
            {children}
            {!hideNavbar && <Footer />}
        </WhatsAppProvider>
    );
}
