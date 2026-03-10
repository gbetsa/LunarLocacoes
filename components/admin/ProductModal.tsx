'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    categories: Category[];
    onSuccess: () => void;
}

export default function ProductModal({ isOpen, onClose, product, categories, onSuccess }: ProductModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [currentTag, setCurrentTag] = useState('');
    const [available, setAvailable] = useState(true);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const tagsList = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setCategoryId(product.categoryId || '');
            setTagsInput(product.tags || '');
            setAvailable(product.available);
            setImages(product.images || []);
        } else {
            setName('');
            setDescription('');
            setCategoryId('');
            setTagsInput('');
            setCurrentTag('');
            setAvailable(true);
            setImages([]);
        }
    }, [product]);

    const addTag = () => {
        const tag = currentTag.trim();
        if (!tag) return;
        const current = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];
        if (!current.includes(tag)) {
            setTagsInput([...current, tag].join(', '));
        }
        setCurrentTag('');
    };

    const removeTag = (tag: string) => {
        const current = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
        setTagsInput(current.filter(t => t !== tag).join(', '));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        setError('');

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Falha no upload de ' + file.name);
                const data = await res.json();
                return data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...uploadedUrls]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
            // Limpa o input para permitir selecionar o mesmo arquivo novamente se necessário
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        const payload = {
            name,
            description,
            available,
            images,
            categoryId: categoryId || null,
            tags: tagsInput || null,
        };
        try {
            const url = product ? `/api/products/${product.id}` : '/api/products';
            const method = product ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao salvar produto');
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141414] border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-light">
                        {product ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D8C28A]/50"
                                placeholder="Ex: Cadeira Tiffany Dourada"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs text-gray-400 uppercase tracking-widest">Imagens do Produto</label>
                                <span className="text-xs text-gray-500">{images.length} fotos adicionadas</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {images.map((imgUrl, index) => (
                                    <div key={index} className="relative aspect-square bg-black rounded-xl border border-white/10 overflow-hidden group">
                                        <Image src={imgUrl} alt={`Foto ${index + 1}`} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform"
                                                title="Remover foto"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <label className="relative aspect-square flex flex-col items-center justify-center cursor-pointer bg-black/20 hover:bg-white/[0.04] border border-dashed border-white/20 rounded-xl transition-colors">
                                    {uploading ? (
                                        <div className="flex flex-col items-center">
                                            <svg className="animate-spin w-6 h-6 text-[#D8C28A] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center px-2">Enviando...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center px-2">Adicionar Foto</span>
                                        </>
                                    )}
                                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Descrição</label>
                            <textarea
                                required
                                rows={6}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D8C28A]/50 resize-y min-h-[120px] max-h-[300px] text-sm leading-relaxed custom-scrollbar"
                                placeholder="Material, uso, detalhes..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Categoria Principal</label>
                                <CustomSelect
                                    value={categoryId}
                                    onChange={setCategoryId}
                                    options={[
                                        { label: 'Sem categoria', value: '' },
                                        ...categories.map(cat => ({ label: cat.name, value: cat.id }))
                                    ]}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-col justify-end pb-1">
                                <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-lg border border-white/5 h-[38px]">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={available}
                                            onChange={e => setAvailable(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D8C28A]"></div>
                                    </label>
                                    <span className="text-xs text-gray-300 font-medium whitespace-nowrap">Ativo para locação</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">
                                Tags de Identificação <span className="normal-case text-gray-600">(Enter ou vírgula para adicionar)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={e => setCurrentTag(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D8C28A]/50 text-sm"
                                    placeholder="Ex: dourado, 4 pés..."
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition shrink-0"
                                >
                                    +
                                </button>
                            </div>
                            {tagsList.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {tagsList.map(tag => (
                                        <span
                                            key={tag}
                                            className="flex items-center gap-1 px-2 py-0.5 bg-[#D8C28A]/10 border border-[#D8C28A]/30 text-[#D8C28A] rounded-full text-xs"
                                        >
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-5 border-t border-white/5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className={`px-8 py-2 rounded-lg text-sm font-semibold transition-all ${submitting || uploading
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-[#D8C28A] text-black hover:scale-[1.05] active:scale-95'
                                }`}
                        >
                            {submitting ? 'Salvando...' : product ? 'Salvar Alterações' : 'Criar Produto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
