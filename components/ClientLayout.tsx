'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({
    children,
    categories,
}: {
    children: React.ReactNode;
    categories: any[];
}) {
    const pathname = usePathname();

    // Ocultar Navbar em rotas de admin e login
    const hideNavbar = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    return (
        <>
            {!hideNavbar && <Navbar categories={categories} />}
            {children}
            {!hideNavbar && <Footer />}
        </>
    );
}
