'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
    const [query, setQuery] = useState('');

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-6 px-10 py-4"
            style={{
                background: 'linear-gradient(to bottom, rgba(4, 14, 60, 0.88), transparent)',
                backdropFilter: 'blur(8px)',
            }}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="relative w-9 h-9">
                    <Image
                        src="/assets/lunar-logo.png"
                        alt="Lunar Locações Logo"
                        fill
                        className="object-contain transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                        priority
                    />
                </div>
                <span className="text-base font-semibold tracking-wide text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                    Lunar Locações
                </span>
            </Link>

            {/* Search Bar — ocupa o espaço disponível */}
            <div className="w-full max-w-md mx-auto">
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
                            placeholder="Buscar itens para locação..."
                            className="bg-transparent border-none outline-none w-full py-2.5 text-sm text-white placeholder-white/40"
                        />
                    </div>
                    <button
                        className="shrink-0 m-1 px-5 py-2 rounded-[8px] text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #1e3a8a, #2b52c8)',
                            color: '#fff',
                            boxShadow: '0 2px 10px rgba(30,58,138,0.45)',
                        }}
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/75 shrink-0">
                <Link
                    href="/"
                    className="relative hover:text-white transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#D8C28A] after:transition-all hover:after:w-full"
                >
                    Home
                </Link>
                <div className="group relative">
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none">
                        Categorias
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <Link
                    href="/contato"
                    className="relative hover:text-white transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#D8C28A] after:transition-all hover:after:w-full"
                >
                    Contato
                </Link>
            </div>

            {/* Mobile */}
            <div className="md:hidden ml-auto">
                <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
