'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Ocultar Navbar em rotas de admin e login
    const hideNavbar = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    return (
        <>
            {!hideNavbar && <Navbar />}
            {children}
        </>
    );
}
