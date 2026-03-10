'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    name: string;
    _count?: {
        products: number;
    };
}

interface CategoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export default function CategoryManager({ isOpen, onClose, categories: initialCategories }: CategoryManagerProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory }),
            });

            if (!res.ok) throw new Error('Falha ao criar categoria');

            const data = await res.json();
            setCategories([...categories, data]);
            setNewCategory('');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir esta categoria? Isso não removerá os produtos, mas eles ficarão sem esta categoria.')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
                router.refresh();
            }
        } catch (error) {
            alert('Erro ao excluir');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141414] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-light">Gerenciar Categorias</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nova categoria..."
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            disabled={loading}
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D8C28A]/50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#D8C28A] text-black rounded-lg text-sm font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            +
                        </button>
                    </form>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                                <div>
                                    <p className="text-sm font-medium">{cat.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{cat._count?.products || 0} produtos</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-[#1a1a1a]/50">
                    <button
                        onClick={onClose}
                        className="w-full py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
