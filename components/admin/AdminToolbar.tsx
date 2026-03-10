'use client';

import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth';
import { AdminUser } from '@/lib/controllers/AuthController';

export default function AdminToolbar({ user }: { user: AdminUser | null }) {
    if (!user) return null;

    return (
        <div className="bg-gradient-to-r from-[#D8C28A] via-[#e6d5a7] to-[#D8C28A] text-black text-[10px] font-black uppercase tracking-[0.15em] px-6 py-1.5 flex justify-between items-center sticky top-0 z-[60] shadow-[0_2px_15px_rgba(216,194,138,0.3)] border-b border-black/10 transition-all duration-300">
            <div className="flex items-center gap-5">
                <span className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full border border-black/10 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.5)]" />
                    <span className="mt-[0.5px]">Modo Administrador</span>
                </span>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 active:scale-95 transition-all border border-black/5 hover:border-black/10 group"
                >
                    <svg className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Dashboard</span>
                </Link>

                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/5 hover:bg-red-600/10 hover:text-red-700 active:scale-95 transition-all border border-black/5 hover:border-red-600/20 cursor-pointer font-black group"
                    >
                        <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sair</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
