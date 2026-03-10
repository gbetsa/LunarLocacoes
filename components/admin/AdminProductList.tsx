'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CategoryManager from './CategoryManager';
import ProductModal from './ProductModal';
import CustomSelect from './CustomSelect';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    image?: string | null;
    available: boolean;
    categoryId?: string | null;
    category?: Category | null;
    tags?: string | null;
    images?: string[];
    rentalPeriod: string;
    minQuantity: number;
    specifications?: any;
}

interface AdminProductListProps {
    initialProducts: any[];
    categories: Category[];
}

export default function AdminProductList({ initialProducts, categories }: AdminProductListProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleOpenModal = (product?: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const confirmDelete = (product: Product) => {
        setDeleteTarget(product);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${deleteTarget.id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleToggleAvailability = async (product: Product) => {
        setTogglingId(product.id);
        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ available: !product.available }),
            });
            if (res.ok) {
                setProducts(prev =>
                    prev.map(p => p.id === product.id ? { ...p, available: !p.available } : p)
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setTogglingId(null);
        }
    };

    const filteredProducts = products.filter(p => {
        const textToSearch = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            p.name.toLowerCase().includes(textToSearch) ||
            p.description.toLowerCase().includes(textToSearch);

        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;

        const matchesAvailability = selectedAvailability === 'all' ||
            (selectedAvailability === 'available' ? p.available : !p.available);

        return matchesSearch && matchesCategory && matchesAvailability;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 bg-[#141414] p-4 rounded-xl border border-white/5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#D8C28A]/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setIsCatModalOpen(true)}
                            className="flex-1 sm:flex-none px-6 py-2 bg-white/5 text-white border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                        >
                            Categorias
                        </button>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex-1 sm:flex-none px-6 py-2 bg-[#D8C28A] text-black rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            + Novo Produto
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 border-t border-white/5 pt-4">
                    <CustomSelect
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        options={[
                            { label: 'Todas as Categorias', value: 'all' },
                            ...categories.map(cat => ({ label: cat.name, value: cat.id }))
                        ]}
                        className="w-full xl:w-auto min-w-[200px]"
                    />

                    <CustomSelect
                        value={selectedAvailability}
                        onChange={setSelectedAvailability}
                        options={[
                            { label: 'Todos os Status', value: 'all' },
                            { label: 'Apenas Disponível', value: 'available' },
                            { label: 'Apenas Indisponível', value: 'unavailable' }
                        ]}
                        className="w-full xl:w-auto min-w-[190px]"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#141414]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-gray-500">
                            <th className="px-6 py-4 font-medium">Produto</th>
                            <th className="px-6 py-4 font-medium">Categoria / Tags</th>
                            <th className="px-6 py-4 font-medium w-44">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">SEM FOTO</div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 w-[300px] max-w-[300px]">
                                    <div className="flex flex-col gap-1.5">
                                        {product.category ? (
                                            <div className="flex">
                                                <span className="inline-block max-w-[280px] text-[10px] px-2 py-0.5 bg-[#D8C28A]/10 border border-[#D8C28A]/30 text-[#D8C28A] rounded-full font-medium truncate" title={product.category.name}>
                                                    {product.category.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-600 italic">Sem categoria</span>
                                        )}
                                        {product.tags && (() => {
                                            const tags = product.tags.split(',').map(t => t.trim()).filter(Boolean);
                                            const visibleTags = tags.slice(0, 3);
                                            const hiddenCount = tags.length - 3;
                                            return (
                                                <div className="flex flex-wrap gap-1">
                                                    {visibleTags.map((tag, i) => (
                                                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500 truncate max-w-[120px]" title={tag}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {hiddenCount > 0 && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500" title={`${hiddenCount} mais`}>
                                                            +{hiddenCount}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 w-44">
                                    <label className={`relative inline-flex items-center gap-2 cursor-pointer ${togglingId === product.id ? 'opacity-50 cursor-wait' : ''}`}>
                                        <div className="relative shrink-0">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={product.available}
                                                disabled={togglingId === product.id}
                                                onChange={() => handleToggleAvailability(product)}
                                            />
                                            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D8C28A]"></div>
                                        </div>
                                        <span className={`text-[10px] font-semibold uppercase tracking-wider w-20 ${product.available ? 'text-[#D8C28A]' : 'text-gray-500'}`}>
                                            {product.available ? 'Disponível' : 'Indisponível'}
                                        </span>
                                    </label>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="p-2 hover:text-[#D8C28A] transition-colors"
                                            onClick={() => handleOpenModal(product)}
                                            title="Editar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="p-2 hover:text-red-500 transition-colors"
                                            onClick={() => confirmDelete(product)}
                                            title="Excluir"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 italic">Nenhum produto encontrado.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                    categories={categories}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        router.refresh();
                        window.location.reload();
                    }}
                />
            )}

            {isCatModalOpen && (
                <CategoryManager
                    isOpen={isCatModalOpen}
                    onClose={() => setIsCatModalOpen(false)}
                    categories={categories}
                />
            )}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#141414] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-1">Excluir produto?</h3>
                            <p className="text-sm text-gray-400">
                                <span className="text-white font-medium">&ldquo;{deleteTarget.name}&rdquo;</span> será removido permanentemente. Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="flex-1 py-2 rounded-lg text-sm text-gray-400 border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 py-2 rounded-lg text-sm font-semibold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Excluindo...' : 'Sim, excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
