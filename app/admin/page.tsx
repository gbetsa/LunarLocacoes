import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/lib/services/AuthService';
import { productService } from '@/lib/services/ProductService';
import { categoryService } from '@/lib/services/CategoryService';
import AdminProductList from '@/components/admin/AdminProductList';
import CategoryManager from '@/components/admin/CategoryManager';

interface AdminUser {
    userId: string;
    email: string;
    name?: string;
}

const AdminDashboard = async () => {
    // Busca o usuário logado via servidor para garantir segurança extra
    const user = (await authService.getCurrentUser()) as AdminUser | null;

    // Busca os dados reais para o dashboard
    const products = await productService.getAllProducts({});
    const categories = await categoryService.getAllCategories();

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

                    <div className="flex gap-4">
                        <Link
                            href="/"
                            className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-light"
                        >
                            Ver Site
                        </Link>
                        {/* Botão de logout simples para teste inicial */}
                        <form action="/api/auth/logout" method="POST">
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-medium"
                            >
                                Sair
                            </button>
                        </form>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                        <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-medium mb-2">Total de Itens</p>
                        <h3 className="text-4xl font-light">{products.length}</h3>
                    </div>

                    <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                        <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-medium mb-2">Categorias</p>
                        <h3 className="text-4xl font-light">{categories.length}</h3>
                    </div>

                    <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                        <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-medium mb-2">Sessão Ativa</p>
                        <h3 className="text-base font-light text-gray-400 truncate">{user?.email}</h3>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-light tracking-tight">Gerenciar Inventário</h2>
                    <AdminProductList initialProducts={products} categories={categories} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
