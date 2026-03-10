'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface ProductGalleryProps {
    images: string[];
    productName: string;
    isAvailable: boolean;
}

export default function ProductGallery({ images, productName, isAvailable }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Travar scroll do body quando o lightbox estiver aberto
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLightboxOpen]);

    const mainImage = images.length > 0 ? images[activeIndex] : '/assets/placeholder-product.jpg';

    return (
        <div className="flex flex-col gap-4">
            {/* Imagem Principal com Click para Zoom */}
            <div
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl flex items-center justify-center relative aspect-square max-h-[calc(100vh-250px)] cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
            >
                {images.length > 0 ? (
                    <Image
                        src={mainImage}
                        alt={productName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                    />
                ) : (
                    <div className="flex flex-col items-center">
                        <span className="text-8xl opacity-10">📦</span>
                        <p className="text-gray-400 font-medium italic mt-4">Sem foto disponível</p>
                    </div>
                )}

                {/* Badge de Indisponibilidade mais discreto mas claro */}
                {!isAvailable && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg border border-white/20 backdrop-blur-md">
                            Indisponível
                        </div>
                    </div>
                )}

                {/* Ícone de Zoom Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full shadow-lg">
                        <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all overflow-hidden bg-white shadow-sm relative ${i === activeIndex ? 'border-[#1e3a8a] scale-105 shadow-md' : 'border-gray-100 hover:border-gray-300'
                                }`}
                        >
                            <Image src={img} alt={`${productName} ${i + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal com Portal */}
            {isLightboxOpen && mounted && createPortal(
                <div
                    className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-[100000]"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={images[activeIndex]}
                                alt={productName}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Navegação Lightbox */}
                        {images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-[100000]"
                                    onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all z-[100000]"
                                    onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <div className="absolute bottom-[-32px] left-0 right-0 text-center text-white/80 text-sm font-bold tracking-widest">
                                    {activeIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
