'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('search') || '');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const categories = [
        'Mobiliário', 'Iluminação', 'Decoração', 'Tecnologia',
        'Ferramentas', 'Equipamentos', 'Eletrodomésticos',
        'Veículos', 'Estruturas'
    ];

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
            params.set('search', query.trim());
        } else {
            params.delete('search');
        }
        params.delete('category');
        router.push(`/?${params.toString()}`);
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-10 py-4"
                style={{
                    background: 'linear-gradient(to bottom, rgba(4, 14, 60, 0.88), transparent)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                {/* Logotipo */}
                <Link href="/" className="flex items-center gap-3 group shrink-0 cursor-pointer">
                    <div className="relative w-9 h-9">
                        <Image
                            src="/assets/lunar-logo.png"
                            alt="Lunar Locações Logo"
                            fill
                            className="object-contain transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                            priority
                        />
                    </div>
                    <span className="hidden sm:block text-base font-semibold tracking-wide text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                        Lunar Locações
                    </span>
                </Link>

                {/* Barra de busca */}
                <div className="flex-1 max-w-md">
                    <div
                        className="flex items-center overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.10)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            borderRadius: 10,
                            backdropFilter: 'blur(12px)',
                            transition: 'background 0.2s, border-color 0.2s',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        }}
                        onFocus={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.18)';
                            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(216,194,138,0.5)';
                        }}
                        onBlur={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.10)';
                            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)';
                        }}
                    >
                        <div className="flex-1 flex items-center px-4 gap-2.5">
                            <svg className="w-4 h-4 shrink-0 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Buscar itens..."
                                className="bg-transparent border-none outline-none w-full py-2.5 text-sm text-white placeholder-white/30"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="shrink-0 m-1 px-4 py-2 rounded-[8px] text-xs font-semibold transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                            style={{
                                background: 'linear-gradient(135deg, #1e3a8a, #2b52c8)',
                                color: '#fff',
                            }}
                        >
                            <span className="hidden sm:inline">Buscar</span>
                            <svg className="w-3.5 h-3.5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Links de navegação Desktop */}
                <div className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-medium text-white/75 shrink-0">
                    <Link
                        href="/"
                        className="relative hover:text-white transition-colors cursor-pointer"
                    >
                        Home
                    </Link>
                    <div className="group relative py-2">
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none cursor-pointer text-sm font-medium">
                            Categorias
                            <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                            <div className="bg-[#040e3c]/95 border border-white/10 rounded-xl py-3 w-56 shadow-2xl backdrop-blur-xl">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={`/?category=${cat}`}
                                        scroll={false}
                                        className="block px-6 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all text-center cursor-pointer"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/contato"
                        className="relative hover:text-white transition-colors cursor-pointer"
                    >
                        Contato
                    </Link>
                </div>

                {/* Botão Menu Mobile */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Menu Mobile Lateral (Drawer) */}
            <div
                className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Content */}
                <div
                    className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-[#040e3c] shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex flex-col h-full">
                        {/* Header do Menu */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <span className="text-lg font-bold text-[#D8C28A]">Menu</span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-white/50 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Links principais */}
                        <div className="flex flex-col gap-2 p-6 overflow-y-auto">
                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl font-semibold text-white/90 py-3 border-b border-white/5"
                            >
                                Home
                            </Link>
                            <Link
                                href="/contato"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl font-semibold text-white/90 py-3 border-b border-white/5"
                            >
                                Contato
                            </Link>

                            {/* Categorias Accordion-style (list) */}
                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-[#D8C28A] uppercase tracking-widest mb-4">Categorias</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat}
                                            href={`/?category=${cat}`}
                                            scroll={false}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-base text-white/70 py-2 hover:text-[#D8C28A] transition-colors"
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer do Menu */}
                        <div className="mt-auto p-8 bg-white/5">
                            <p className="text-xs text-white/40 text-center">
                                &copy; 2026 Lunar Locações
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
