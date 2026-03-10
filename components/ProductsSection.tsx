'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// ── Tipos ──────────────────────────────────────────────────────────────────
interface Product {
    id: number;
    name: string;
    available: boolean;
    rentalPeriod: string;
    categories: string[];
    whatsapp: string;
}

// ── Dados de Exemplo ──────────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
    { id: 1, name: 'Cadeira Dobrável Reforçada', available: true, rentalPeriod: '5 dias', categories: ['Mobiliário', 'Festas'], whatsapp: '' },
    { id: 2, name: 'Luminária LED Industrial 100W', available: false, rentalPeriod: '1 dia', categories: ['Iluminação', 'Eventos'], whatsapp: '' },
    { id: 3, name: 'Mesa Dobrável Plástico 1,80m', available: true, rentalPeriod: '5 dias', categories: ['Mobiliário', 'Festas'], whatsapp: '' },
    { id: 4, name: 'Kit de Ferramentas 110 Peças', available: true, rentalPeriod: '1 dia', categories: ['Ferramentas', 'Manutenção'], whatsapp: '' },
    { id: 5, name: 'Caixa de Som Bluetooth Profissional', available: true, rentalPeriod: '1 dia', categories: ['Tecnologia', 'Eventos'], whatsapp: '' },
    { id: 6, name: 'Freezer Vertical 300L', available: true, rentalPeriod: '1 mês', categories: ['Eletrodomésticos', 'Cozinha'], whatsapp: '' },
    { id: 7, name: 'Lavadora de Alta Pressão 1800W', available: true, rentalPeriod: '15 dias', categories: ['Equipamentos', 'Limpeza'], whatsapp: '' },
    { id: 8, name: 'Micro-ondas 30 Litros', available: true, rentalPeriod: '15 dias', categories: ['Eletrodomésticos', 'Cozinha'], whatsapp: '' },
    { id: 9, name: 'Tenda 3x3 Reforçada', available: true, rentalPeriod: '1 dia', categories: ['Estruturas', 'Eventos'], whatsapp: '' },
    { id: 10, name: 'Cafeteira Elétrica 1,5L', available: true, rentalPeriod: '1 dia', categories: ['Eletrodomésticos', 'Cozinha'], whatsapp: '' },
    { id: 11, name: 'Ventilador Industrial 70cm', available: true, rentalPeriod: '1 dia', categories: ['Equipamentos', 'Climatização'], whatsapp: '' },
    { id: 12, name: 'Forno Elétrico 45L', available: true, rentalPeriod: '1 dia', categories: ['Eletrodomésticos', 'Cozinha'], whatsapp: '' },
];

const CATEGORY_ROWS = [
    ['Todos', 'Mobiliário', 'Iluminação', 'Decoração', 'Tecnologia', 'Ferramentas', 'Equipamentos'],
    ['Eletrodomésticos', 'Veículos', 'Estruturas'],
];

// ── Ícones das Categorias (SVG) ───────────────────────────────────────────
function CategoryIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
    const props = { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    switch (name) {
        case 'Todos':
            return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
        case 'Mobiliário':
            return <svg {...props}><path d="M5 11V6a2 2 0 012-2h10a2 2 0 012 2v5" /><path d="M3 11h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" /><path d="M7 15v4M17 15v4" /></svg>;
        case 'Iluminação':
            return <svg {...props}><path d="M12 2a7 7 0 015 11.9V17a1 1 0 01-1 1H8a1 1 0 01-1-1v-3.1A7 7 0 0112 2z" /><path d="M9 21h6" /></svg>;
        case 'Decoração':
            return <svg {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M8 12s1.5-2 4-2 4 2 4 2" /><path d="M9 9.5c0 0 0-1 1-1s1 1 1 1" /><path d="M13 9.5c0 0 0-1 1-1s1 1 1 1" /><path d="M9.5 16c0 0 1 1 2.5 1s2.5-1 2.5-1" /></svg>;
        case 'Tecnologia':
            return <svg {...props}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
        case 'Ferramentas':
            return <svg {...props}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>;
        case 'Equipamentos':
            return <svg {...props}><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>;
        case 'Eletrodomésticos':
            return <svg {...props}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
        case 'Veículos':
            return <svg {...props}><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 7v2h-5" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
        case 'Estruturas':
            return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>;
        case 'Cozinha':
            return <svg {...props}><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><path d="M6 2v6M10 2v6M14 2v6" /></svg>;
        default:
            return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>;
    }
}

// ── Card de Produto ──────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
    const WHATSAPP_NUMBER = '5511963119191';
    const message = encodeURIComponent(`Olá! Tenho interesse em alugar: ${product.name}`);
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    return (
        <div
            className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            }}
        >
            {/* Etiquetas de categoria */}
            <div className="relative">
                <div className="flex items-start justify-between gap-1 absolute top-3 left-3 right-3 z-10">
                    <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 1).map((cat) => (
                            <span key={cat} className="text-[10px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded"
                                style={{ background: '#10a37f' }}>
                                {cat}
                            </span>
                        ))}
                    </div>
                    {product.categories.length > 1 && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded"
                            style={{ background: '#1e3a8a' }}>
                            {product.categories[1]}
                        </span>
                    )}
                </div>

                {/* Placeholder da imagem */}
                <div
                    className="w-full flex items-center justify-center"
                    style={{ height: 180, background: 'linear-gradient(135deg, #f3f4f6, #e9ebee)' }}
                >
                    <span className="text-5xl opacity-30">📦</span>
                </div>
            </div>

            {/* Informações */}
            <div className="flex flex-col gap-3 p-4 flex-1">
                <h3 className="font-bold text-gray-900 text-sm leading-snug">{product.name}</h3>

                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: product.available ? '#22c55e' : '#ef4444' }} />
                    <span className="text-xs font-medium" style={{ color: product.available ? '#16a34a' : '#dc2626' }}>
                        {product.available ? 'Disponível' : 'Indisponível'}
                    </span>
                </div>

                <p className="text-xs font-semibold" style={{ color: '#1e3a8a' }}>
                    Locação por {product.rentalPeriod}
                </p>

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-auto pt-1">
                    <button
                        className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white text-center transition-all hover:brightness-110 active:scale-95"
                        style={{ background: '#1e3a8a' }}
                    >
                        VER DETALHES
                    </button>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white text-center flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-95"
                        style={{ background: '#25d366' }}
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                        </svg>
                        WHATSAPP
                    </a>
                </div>
            </div>
        </div>
    );
}

// ── Seção Principal ──────────────────────────────────────────────────────
export default function ProductsSection() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sectionRef = useRef<HTMLElement>(null);

    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    // Sincroniza os filtros com os parâmetros da URL
    useEffect(() => {
        const cat = searchParams.get('category') || 'Todos';
        const search = searchParams.get('search') || '';

        setActiveCategory(cat);
        setSearchQuery(search);

        // Apenas rola se o usuário estiver na parte de cima ou de baixo, longe da seção
        const rect = sectionRef.current?.getBoundingClientRect();
        const isOutsideSection = rect && (rect.top > 100 || rect.bottom < 0);

        if ((searchParams.get('category') || searchParams.get('search')) && isOutsideSection) {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [searchParams]);

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat === 'Todos') {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        params.delete('search'); // Limpa a busca quando uma categoria é selecionada
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[-\s]/g, ''); // Remove hifens e espaços para uma busca mais precisa
    };

    const filtered = ALL_PRODUCTS.filter((p) => {
        const matchesCategory = activeCategory === 'Todos' || p.categories.includes(activeCategory);

        if (!searchQuery) return matchesCategory;

        const normalizedSearch = normalizeText(searchQuery);
        const normalizedName = normalizeText(p.name);
        const matchesSearch = normalizedName.includes(normalizedSearch) ||
            p.categories.some(c => normalizeText(c).includes(normalizedSearch));

        return matchesCategory && matchesSearch;
    });

    return (
        <section id="produtos" ref={sectionRef} className="relative" style={{ background: '#f4f6fb', paddingTop: '5rem', paddingBottom: '4rem' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-10">

                {/* Linha de cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                            {searchQuery ? `Resultados para "${searchQuery}"` : 'Itens Disponíveis para Locação'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchQuery ? `Encontramos ${filtered.length} itens correspondentes.` : 'Locações rápidas, confiáveis e com valores acessíveis.'}
                        </p>
                    </div>
                    <span
                        className="shrink-0 text-xs font-bold text-white px-4 py-2 rounded-full w-fit"
                        style={{ background: '#1e3a8a', whiteSpace: 'nowrap' }}
                    >
                        {filtered.length} {filtered.length === 1 ? 'item encontrado' : 'itens encontrados'}
                    </span>
                </div>

                {/* Filtros de categoria */}
                <div className="mt-5 flex flex-col gap-2">
                    {CATEGORY_ROWS.map((row, ri) => (
                        <div key={ri} className="flex flex-wrap gap-2">
                            {row.map((cat) => {
                                const isActive = activeCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                                        style={{
                                            background: isActive ? '#1e3a8a' : '#fff',
                                            color: isActive ? '#fff' : '#374151',
                                            border: `1.5px solid ${isActive ? '#1e3a8a' : '#d1d5db'}`,
                                            boxShadow: isActive ? '0 4px 14px rgba(30,58,138,0.3)' : 'none',
                                        }}
                                    >
                                        <CategoryIcon name={cat} />
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Grade de produtos */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="mt-16 mb-8 flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-gray-300 bg-white/50 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {searchQuery ? `Nenhum resultado para "${searchQuery}"` : 'Nenhum item nesta categoria'}
                        </h3>
                        <p className="text-gray-500 text-sm max-w-md text-center mb-8">
                            Não encontramos o que você precisa por aqui no momento. Tente buscar um termo diferente ou limpe os filtros para ver todos os itens.
                        </p>
                        <button
                            onClick={() => handleCategoryChange('Todos')}
                            className="px-8 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
                            style={{ background: '#1e3a8a' }}
                        >
                            Ver Todos os Produtos
                        </button>
                    </div>
                )}
            </div>

            {/* Botão flutuante do WhatsApp */}
            <a
                href="https://wa.me/5511963119191"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95"
                style={{ background: '#25d366', boxShadow: '0 8px 24px rgba(37,211,102,0.45)' }}
                title="Falar pelo WhatsApp"
            >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                </svg>
            </a>
        </section>
    );
}
