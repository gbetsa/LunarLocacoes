import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/lib/services/AuthService';

interface AdminUser {
    userId: string;
    email: string;
    name?: string;
}

const AdminDashboard = async () => {
    // Busca o usuário logado via servidor para garantir segurança extra
    const user = (await authService.getCurrentUser()) as AdminUser | null;

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Widget Estatísticas (Placeholder) */}
                    <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                        <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-medium mb-2">Total de Itens</p>
                        <h3 className="text-4xl font-light">124</h3>
                    </div>

                    <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                        <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-medium mb-2">Categorias</p>
                        <h3 className="text-4xl font-light">15</h3>
                    </div>

                    <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
                        <p className="text-[#D8C28A] text-xs uppercase tracking-widest font-medium mb-2">Sessão</p>
                        <h3 className="text-base font-light text-gray-400 break-all">{user?.email}</h3>
                    </div>
                </div>

                {/* Seção de Ações Rápidas */}
                <div className="mt-12">
                    <h2 className="text-lg font-light mb-6">Ações Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Novo Produto', color: '#D8C28A' },
                            { label: 'Gerenciar Categorias', color: '#B89B6A' },
                            { label: 'Ver Relatórios', color: '#888' },
                            { label: 'Configurações', color: '#888' }
                        ].map((action, i) => (
                            <button
                                key={i}
                                className="p-4 bg-[#141414] border border-white/5 rounded-xl hover:border-[#D8C28A]/30 transition-all text-left group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: action.color }}></div>
                                </div>
                                <p className="text-sm font-medium">{action.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Aviso para o desenvolvedor */}
                <div className="mt-20 p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl text-center">
                    <p className="text-blue-400/80 text-sm italic">
                        "O dashboard completo com listagem e edição de produtos será implementado no próximo commit."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
