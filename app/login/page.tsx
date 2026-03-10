'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao realizar login');
            }

            // Redireciona para o admin após sucesso
            router.push('/admin');
            router.refresh(); // Garante que o middleware agora reconheça o cookie
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo e Título */}
                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-gradient-to-b from-[#D8C28A]/10 to-transparent rounded-full mb-6 border border-[#D8C28A]/20">
                        <div className="relative w-16 h-16 mx-auto">
                            <Image
                                src="/assets/lunar-logo.png"
                                alt="Lunar Locações Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <h2 className="text-2xl font-light text-white tracking-tight">Acesso Administrativo</h2>
                    <p className="text-[#D8C28A]/60 mt-2 text-sm font-light uppercase tracking-widest">Lunar Locações</p>
                </div>

                {/* Card de Login */}
                <div className="bg-[#141414] border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                    {/* Efeito de brilho sutil */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D8C28A] to-transparent opacity-50"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs text-[#D8C28A]/70 font-medium uppercase tracking-wider ml-1">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#D8C28A]/50 focus:ring-1 focus:ring-[#D8C28A]/20 transition-all"
                                placeholder="exemplo@lunarlocacoes.com.br"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-[#D8C28A]/70 font-medium uppercase tracking-wider ml-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#D8C28A]/50 focus:ring-1 focus:ring-[#D8C28A]/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-semibold tracking-wide transition-all duration-300 relative overflow-hidden group
                                ${loading
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#D8C28A] to-[#B89B6A] text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(216,194,138,0.2)] hover:shadow-[0_0_30px_rgba(216,194,138,0.4)]'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                                        Autenticando...
                                    </>
                                ) : 'Entrar no Painel'}
                            </span>
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-gray-600 font-light">
                    &copy; {new Date().getFullYear()} Lunar Locações. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
