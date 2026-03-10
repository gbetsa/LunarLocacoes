'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth';
import AdminProductList from './AdminProductList';
import SettingsTab from './SettingsTab';

interface AdminUser {
    userId: string;
    email: string;
    name?: string;
}

interface AdminDashboardContentProps {
    products: any[];
    categories: any[];
    user: AdminUser | null;
}

export default function AdminDashboardContent({ products, categories, user }: AdminDashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12 py-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/assets/lunar-logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-light tracking-tight">
                                Bem-vindo, <span className="text-[#D8C28A] font-medium">{user?.name || 'Admin'}</span>
                            </h1>
                            <p className="text-gray-500 text-xs mt-0.5 uppercase tracking-widest">Painel Administrativo</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-5 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium group cursor-pointer"
                        >
                            <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver Site
                        </Link>
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500/5 text-red-500/80 border border-red-500/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all text-sm font-bold cursor-pointer group"
                            >
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sair
                            </button>
                        </form>
                    </div>
                </header>

                <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit mb-10 backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer ${activeTab === 'products'
                            ? 'bg-[#D8C28A] text-black shadow-[0_0_20px_rgba(216,194,138,0.2)]'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer ${activeTab === 'settings'
                            ? 'bg-[#D8C28A] text-black shadow-[0_0_20px_rgba(216,194,138,0.2)]'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configurações
                    </button>
                </div>

                {activeTab === 'products' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-center md:text-left">
                            <div className="bg-[#141414] border border-white/5 p-8 rounded-2xl hover:border-[#D8C28A]/20 transition-colors group">
                                <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-bold mb-3 opacity-60 group-hover:opacity-100 transition-opacity">Total de Itens</p>
                                <h3 className="text-5xl font-light tabular-nums">{products.length}</h3>
                            </div>

                            <div className="bg-[#141414] border border-white/5 p-8 rounded-2xl hover:border-[#D8C28A]/20 transition-colors group">
                                <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-bold mb-3 opacity-60 group-hover:opacity-100 transition-opacity">Categorias Ativas</p>
                                <h3 className="text-5xl font-light tabular-nums">{categories.length}</h3>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-light tracking-tight">Gerenciar Inventário</h2>
                            <AdminProductList initialProducts={products} categories={categories} />
                        </div>
                    </>
                ) : (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SettingsTab />
                    </div>
                )}
            </div>
        </div>
    );
}
