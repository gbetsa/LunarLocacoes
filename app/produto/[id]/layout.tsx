import Link from 'next/link';
import React from 'react';

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-20 bg-[#f4f6fb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                {/* Botão Voltar */}
                <Link
                    href="/#produtos"
                    className="mb-6 sm:mb-8 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-bold text-[#1e3a8a] shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar para o catálogo
                </Link>

                {children}
            </div>
        </main>
    );
}
