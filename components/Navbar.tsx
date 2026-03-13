'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSettings } from '@/context/WhatsAppContext';

import { AdminUser } from '@/lib/controllers/AuthController';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    images: string[];
    category?: { name: string } | null;
    tags?: string | null;
}

export default function Navbar({ categories, user, products = [] }: { categories: Category[], user?: AdminUser | null, products?: Product[] }) {
    const { getWhatsAppLink, email, refreshSettings } = useSettings();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [query, setQuery] = useState(searchParams.get('search') || '');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtro client-side - rápido e sem dependência de rede
    const normalizeText = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-\s]/g, '');

    const searchResults = query.trim()
        ? products
            .filter(p => {
                const q = normalizeText(query);
                return (
                    normalizeText(p.name).includes(q) ||
                    (p.category?.name && normalizeText(p.category.name).includes(q)) ||
                    (p.tags && normalizeText(p.tags).includes(q))
                );
            })
            .slice(0, 5)
        : [];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll(); // verifica posição atual ao montar (ex: F5 com scroll restaurado)
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const isHome = pathname === '/';
    const showBackground = !isHome || isScrolled;

    return (
        <>
            <nav
                className="fixed left-0 right-0 z-50 flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-10 py-4 transition-all duration-500"
                style={{
                    top: user ? '34px' : '0',
                    background: showBackground ? 'rgba(4, 14, 60, 0.85)' : 'transparent',
                    backdropFilter: showBackground ? 'blur(16px) saturate(100%)' : 'none',
                    WebkitBackdropFilter: showBackground ? 'blur(16px) saturate(100%)' : 'none',
                    borderBottom: showBackground ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                    boxShadow: showBackground ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
                }}
            >
                {/* Logotipo */}
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer">
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                        <Image
                            src="/assets/lunar-logo.png"
                            alt="Lunar Locações Logo"
                            fill
                            className="object-contain transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                            priority
                        />
                    </div>
                    <span className="hidden lg:block text-base font-semibold tracking-wide text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                        Lunar Locações
                    </span>
                </Link>

                {/* Barra de busca com Dropdown */}
                <div className="flex-1 max-w-md relative" ref={searchContainerRef}>
                    <div
                        className="flex items-center overflow-hidden relative z-50"
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
                        <div className="flex-1 flex items-center px-2 sm:px-4 gap-2">
                            <svg className="hidden xs:block w-4 h-4 shrink-0 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setIsSearchFocused(false);
                                        handleSearch();
                                    } else if (e.key === 'Escape') {
                                        setIsSearchFocused(false);
                                    }
                                }}
                                placeholder="Buscar itens..."
                                className="bg-transparent border-none outline-none w-full py-2 sm:py-2.5 text-sm text-white placeholder-white/30"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setIsSearchFocused(false);
                                handleSearch();
                            }}
                            className="shrink-0 m-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[8px] text-xs font-semibold transition-all hover:brightness-110 active:scale-95 cursor-pointer"
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

                    {/* Live Search Dropdown */}
                    <div className={`absolute top-[calc(100%+8px)] left-0 w-full bg-[#040e3c]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 transform origin-top z-40 ${isSearchFocused && query.trim() ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible pointer-events-none'}`}>
                        {searchResults.length > 0 ? (
                            <div className="flex flex-col py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {searchResults.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/produto/${product.id}`}
                                        onClick={() => {
                                            setIsSearchFocused(false);
                                            setQuery('');
                                        }}
                                        className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors group cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 relative shrink-0 border border-white/10">
                                            {product.images && product.images[0] ? (
                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-[9px] font-bold">
                                                    <span className="text-xl">📦</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0 justify-center">
                                            <span className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                                                {product.name}
                                            </span>
                                            {product.category && (
                                                <span className="text-[10px] font-bold text-[#D8C28A] uppercase tracking-wider truncate mt-0.5">
                                                    {product.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                                <div className="border-t border-white/10 mt-2">
                                    <button 
                                        onClick={() => {
                                            setIsSearchFocused(false);
                                            handleSearch();
                                        }}
                                        className="w-full px-4 py-3 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors text-center uppercase tracking-wider"
                                    >
                                        {searchResults.length >= 5 ? 'Ver todos os resultados' : `Ver resultados na loja`}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-center flex flex-col items-center justify-center gap-3">
                                <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
                                </svg>
                                <span className="text-sm text-white/60">
                                    Nenhum item encontrado
                                </span>
                            </div>
                        )}
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

                        <div className="absolute top-full right-[-80px] pt-2 transition-all duration-300 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                            <div
                                className={`bg-[#040e3c]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-y-auto custom-scrollbar ${categories.length > 8 ? 'w-[450px] grid grid-cols-2 p-4' : 'w-56 py-3'}`}
                                style={{ maxHeight: '60vh' }}
                            >
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/?category=${cat.name}`}
                                        scroll={false}
                                        className="flex items-center px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a] mr-3 opacity-0 transition-opacity group-hover:opacity-100 shrink-0" />
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="group relative py-2">
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none cursor-pointer text-sm font-medium">
                            Contato
                            <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className="absolute top-full right-0 pt-2 transition-all duration-300 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                            <div className="bg-[#040e3c]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl w-64 py-3">
                                <button
                                    onClick={async () => {
                                        const { whatsapp } = await refreshSettings();
                                        window.open(getWhatsAppLink(whatsapp), '_blank');
                                    }}
                                    className="w-full flex items-center px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer text-left"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3 shrink-0">
                                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">WhatsApp</span>
                                        <span className="text-[10px] opacity-60">Atendimento imediato</span>
                                    </div>
                                </button>
                                <button
                                    onClick={async () => {
                                        const { email } = await refreshSettings();
                                        window.location.href = `mailto:${email}`;
                                    }}
                                    className="w-full flex items-center px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer text-left"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3 shrink-0">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">E-mail</span>
                                        <span className="text-[10px] opacity-60">Envie sua mensagem</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
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
                        <div className="flex flex-col gap-2 p-6 overflow-y-auto custom-scrollbar">
                            <Link
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl font-semibold text-white/90 py-3 border-b border-white/5"
                            >
                                Home
                            </Link>

                            <div className="py-4 border-b border-white/5">
                                <h4 className="text-xs font-bold text-[#D8C28A] uppercase tracking-widest mb-4">Canais de Contato</h4>
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={async () => {
                                            const { whatsapp } = await refreshSettings();
                                            window.open(getWhatsAppLink(whatsapp), '_blank');
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 text-white/80 hover:text-white text-left w-full"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">WhatsApp</span>
                                            <span className="text-xs opacity-50">Atendimento rápido</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const { email } = await refreshSettings();
                                            window.location.href = `mailto:${email}`;
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 text-white/80 hover:text-white text-left w-full"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">E-mail</span>
                                            <span className="text-xs opacity-50">Envie uma mensagem</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Categorias Accordion-style (list) */}
                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-[#D8C28A] uppercase tracking-widest mb-4">Categorias</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/?category=${cat.name}`}
                                            scroll={false}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-base text-white/70 py-2 hover:text-[#D8C28A] transition-colors"
                                        >
                                            {cat.name}
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
