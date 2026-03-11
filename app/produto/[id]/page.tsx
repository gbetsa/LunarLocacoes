import type { Metadata } from 'next';
import { productService } from '@/lib/services/ProductService';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';

import { settingsService } from '@/lib/services/SettingsService';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await productService.getProductById(id);

    if (!product) {
        return { title: "Produto não encontrado" };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: `${product.name} | Lunar Locações`,
            description: product.description,
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        },
    };
}


export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;

    const product = await productService.getProductById(id);

    if (!product) {
        notFound();
    }

    const message = product.available
        ? `Olá! Gostaria de solicitar um orçamento para o item: ${product.name}`
        : `Olá! Tenho interesse no item ${product.name}, porém vi no site que está indisponível no momento. Gostaria de solicitar uma reserva ou saber a previsão de disponibilidade.`;

    const waLink = await settingsService.getWhatsAppLink(message);

    const images = product.images.length > 0 ? product.images : ['/assets/placeholder-product.jpg'];

    return (
        <>
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

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

                        {/* Coluna Esquerda: Galeria Interativa */}
                        <div className="lg:col-span-7 lg:sticky lg:top-32 self-start">
                            <ProductGallery
                                images={product.images}
                                productName={product.name}
                                isAvailable={product.available}
                            />
                        </div>

                        {/* Coluna Direita: Informações */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl lg:sticky lg:top-32">

                                {product.category && (
                                    <span className="inline-block px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white mb-3 sm:mb-4" style={{ background: '#D8C28A' }}>
                                        {product.category.name}
                                    </span>
                                )}

                                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 leading-tight text-gray-900">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                    <span className={`w-2.5 h-2.5 sm:w-3 h-3 rounded-full ${product.available ? 'animate-pulse' : ''}`} style={{ background: product.available ? '#22c55e' : '#ef4444' }} />
                                    <span className={`text-[11px] sm:text-[13px] font-bold uppercase tracking-tight ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.available ? 'Disponível para hoje' : 'Indisponível no momento'}
                                    </span>
                                </div>

                                <div className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm mb-6 sm:mb-8 flex items-center justify-center border ${!product.available ? 'bg-slate-50 text-[#1e3a8a] border-slate-200' : 'bg-[#1e3a8a] text-white border-transparent shadow-lg'}`}>
                                    Locação por {product.rentalPeriod}
                                </div>

                                {/* Tags */}
                                {product.tags && (
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8 sm:mb-10">
                                        {product.tags.split(',').map((tag) => (
                                            <span key={tag} className="px-2.5 sm:px-3 py-1 bg-blue-50 text-[#1e3a8a] text-[10px] sm:text-xs font-bold rounded-lg border border-blue-100 uppercase tracking-tighter">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Descrição */}
                                <div className="mb-8 sm:mb-10">
                                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 border-b pb-2">Descrição</h2>
                                    <p className="leading-relaxed text-xs sm:text-sm whitespace-pre-wrap text-gray-600">
                                        {product.description || 'Produto de alta qualidade disponível para locação. Entre em contato para mais detalhes e especificações.'}
                                    </p>
                                </div>

                                {/* Especificações Técnicas */}
                                {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
                                    <div className="mb-8 sm:mb-10">
                                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 border-b pb-2">Especificações Técnicas</h2>
                                        <div className="space-y-2 sm:space-y-3">
                                            {product.specifications.map((spec: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                                    <span className="text-xs sm:text-sm text-gray-500 font-medium">{spec.label}</span>
                                                    <span className="text-xs sm:text-sm text-gray-900 font-bold">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Botão WhatsApp */}
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 sm:py-4 text-white rounded-xl font-black flex items-center justify-center gap-2 sm:gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl uppercase text-[10px] sm:text-xs tracking-widest cursor-pointer"
                                    style={{
                                        background: product.available ? '#22c55e' : '#1e3a8a',
                                        boxShadow: product.available ? '0 10px 20px -5px rgba(34, 197, 94, 0.4)' : '0 10px 20px -5px rgba(30, 58, 138, 0.3)'
                                    }}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L.057 23.492a.5.5 0 00.626.606l5.775-1.515A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.032-1.374l-.36-.214-3.733.979.996-3.638-.235-.374A9.856 9.856 0 012.118 12C2.118 6.56 6.56 2.118 12 2.118S21.882 6.56 21.882 12 17.44 21.882 12 21.882z" />
                                    </svg>
                                    {product.available ? 'Solicitar Orçamento' : 'Solicitar Reserva'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
