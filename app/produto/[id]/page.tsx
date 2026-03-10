'use client';

import { useParams, useRouter } from 'next/navigation';
import { ALL_PRODUCTS, Product } from '@/components/ProductsSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const product = ALL_PRODUCTS.find((p) => p.id === id);

    const [activeImage, setActiveImage] = useState(0);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col pt-32 items-center justify-center text-center px-6">
                <h1 className="text-2xl font-bold text-gray-900">Produto não encontrado</h1>
                <button
                    onClick={() => router.push('/')}
                    className="mt-6 px-6 py-2 bg-[#1e3a8a] text-white rounded-full font-bold"
                >
                    Voltar para a Loja
                </button>
            </div>
        );
    }

    const WHATSAPP_NUMBER = '5511963119191';
    const message = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o item: ${product.name}`);
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    const images = product.images || ['/assets/placeholder-product.jpg'];

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-32 pb-20 bg-[#f4f6fb]">
                <div className="max-w-7xl mx-auto px-6 md:px-10">

                    {/* Botão Voltar */}
                    <button
                        onClick={() => router.back()}
                        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-[#1e3a8a] shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

                        {/* Coluna Esquerda: Galeria */}
                        <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-32 self-start">
                            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl flex items-center justify-center relative aspect-square max-h-[calc(100vh-250px)]">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                    <span className="text-8xl opacity-10">📦</span>
                                </div>
                                <div className="z-10 text-center px-10">
                                    <p className="text-gray-400 font-medium italic">Imagem do produto em produção...</p>
                                    <p className="text-sm text-gray-400 mt-2">(Aqui ficaria a foto principal do produto: {product.name})</p>
                                </div>

                                {/* Controles laterais (mock) */}
                                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                    <button className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center pointer-events-auto opacity-50 cursor-not-allowed">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center pointer-events-auto opacity-50 cursor-not-allowed">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Miniaturas (mock) */}
                            <div className="flex gap-4">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className={`w-24 h-24 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden bg-white shadow-sm flex items-center justify-center ${i === 0 ? 'border-[#1e3a8a]' : 'border-gray-200'}`}>
                                        <span className="text-2xl opacity-20">📦</span>
                                    </div>
                                ))}
                                <div className="w-24 h-24 rounded-2xl bg-gray-900/10 flex items-center justify-center text-gray-500 font-bold text-sm">
                                    1 / 2
                                </div>
                            </div>
                        </div>

                        {/* Coluna Direita: Informações */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl sticky top-32">

                                <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white mb-4" style={{ background: '#D8C28A' }}>
                                    {product.categories[0]}
                                </span>

                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className="w-3 h-3 rounded-full" style={{ background: product.available ? '#22c55e' : '#ef4444' }} />
                                    <span className="text-sm font-semibold" style={{ color: product.available ? '#16a34a' : '#dc2626' }}>
                                        {product.available ? 'Disponível' : 'Indisponível'}
                                    </span>
                                </div>

                                <div className="bg-[#0e2a63] text-white py-4 px-6 rounded-xl font-bold text-sm mb-8 flex items-center justify-center">
                                    Locação por {product.rentalPeriod}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {(product.tags || product.categories).map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-blue-50 text-[#1e3a8a] text-xs font-bold rounded-lg border border-blue-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Descrição */}
                                <div className="mb-10">
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">Descrição</h2>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {product.description || 'Produto de alta qualidade disponível para locação. Entre em contato para mais detalhes e especificações.'}
                                    </p>
                                </div>

                                {/* Especificações Técnicas */}
                                <div className="mb-10">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Especificações Técnicas</h2>
                                    <div className="flex flex-col gap-3">
                                        {(product.specs || []).map((spec, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg">
                                                <span className="text-sm font-bold text-gray-700">{spec.label}</span>
                                                <span className="text-sm text-[#1e3a8a] font-medium">{spec.value}</span>
                                            </div>
                                        ))}
                                        {product.minQuantity && (
                                            <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1e3a8a] shadow-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <p className="text-xs text-[#1e3a8a] font-bold">
                                                    Quantidade mínima para locação: <span className="text-lg">{product.minQuantity} unidades</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Botão WhatsApp */}
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-[#22c55e] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-green-500/20 uppercase text-sm tracking-wide"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                                    </svg>
                                    Solicitar Orçamento Pelo WhatsApp
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
