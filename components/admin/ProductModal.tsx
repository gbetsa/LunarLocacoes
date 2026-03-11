'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CustomSelect from './CustomSelect';
import { productSchema } from '@/lib/validations/product';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
}

interface Specification {
    label: string;
    value: string;
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
    specifications?: Specification[] | any;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    categories: Category[];
    onSuccess: () => void;
}

interface PreviewImage {
    file: File;
    previewUrl: string;
}

export default function ProductModal({ isOpen, onClose, product, categories, onSuccess }: ProductModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [currentTag, setCurrentTag] = useState('');
    const [available, setAvailable] = useState(true);
    const [rentalPeriod, setRentalPeriod] = useState('1 dia');
    const [minQuantity, setMinQuantity] = useState(1);
    const [specifications, setSpecifications] = useState<Specification[]>([]);
    const [newSpecLabel, setNewSpecLabel] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');

    const [images, setImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<PreviewImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const tagsList = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setCategoryId(product.categoryId || '');
            setTagsInput(product.tags || '');
            setAvailable(product.available);
            setRentalPeriod(product.rentalPeriod || '1 dia');
            setMinQuantity(product.minQuantity || 1);
            setSpecifications(Array.isArray(product.specifications) ? product.specifications : []);
            setImages(product.images || []);
        } else {
            setName('');
            setDescription('');
            setCategoryId('');
            setTagsInput('');
            setCurrentTag('');
            setAvailable(true);
            setRentalPeriod('1 dia');
            setMinQuantity(1);
            setSpecifications([]);
            setImages([]);
        }
        // Cleanup previews
        return () => {
            newImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        };
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

    const addSpecification = () => {
        const label = newSpecLabel.trim();
        const value = newSpecValue.trim();
        if (!label || !value) return;

        setSpecifications(prev => [...prev, { label, value }]);
        setNewSpecLabel('');
        setNewSpecValue('');
    };

    const handleSpecKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSpecification();
        }
    };

    const removeSpecification = (index: number) => {
        setSpecifications(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newPreviews = files.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));

        setNewImages(prev => [...prev, ...newPreviews]);
        // Limpa o input para permitir selecionar o mesmo arquivo novamente se necessário
        e.target.value = '';
    };

    const removeExistingImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const removeNewImage = (indexToRemove: number) => {
        setNewImages(prev => {
            const imageToRemove = prev[indexToRemove];
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.previewUrl);
            }
            return prev.filter((_, index) => index !== indexToRemove);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setFieldErrors({});

        const payload = {
            name,
            description,
            available,
            images: [...images], // Temporary for validation, will be updated after upload
            categoryId: categoryId,
            tags: tagsInput,
            rentalPeriod: `${minQuantity} ${minQuantity > 1 ? 'dias' : 'dia'}`,
            minQuantity: Number(minQuantity),
            specifications,
        };

        // Pre-validate with Zod (ignoring temporary images for a moment if needed, 
        // but the schema requires at least one image)
        const validationImages = [...images, ...newImages.map(() => 'temp-url')];
        const validationPayload = { ...payload, images: validationImages };

        const result = productSchema.safeParse(validationPayload);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                errors[path] = issue.message;
            });
            setFieldErrors(errors);
            setSubmitting(false);
            return;
        }

        try {
            // Fazer upload das novas imagens primeiro
            const uploadedUrls: string[] = [];
            if (newImages.length > 0) {
                setUploading(true);
                for (const img of newImages) {
                    const formData = new FormData();
                    formData.append('file', img.file);
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    if (!res.ok) throw new Error(`Falha no upload de ${img.file.name}`);
                    const data = await res.json();
                    uploadedUrls.push(data.url);
                }
                setUploading(false);
            }

            const finalPayload = {
                ...payload,
                images: [...images, ...uploadedUrls],
            };

            const url = product ? `/api/products/${product.id}` : '/api/products';
            const method = product ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao salvar produto');
            }

            // Limpar estados locais antes do sucesso
            newImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
            setNewImages([]);

            toast.success(product ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
            onSuccess();
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || 'Erro ao salvar produto');
            setUploading(false);
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
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Nome do Produto</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={`w-full bg-black/40 border ${fieldErrors.name ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D8C28A]/50 text-sm`}
                                    placeholder="Ex: Cadeira Tiffany Dourada"
                                />
                                {fieldErrors.name && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{fieldErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Período de Locação (em dias)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={minQuantity}
                                    onChange={e => setMinQuantity(Number(e.target.value))}
                                    className={`w-full bg-black/40 border ${fieldErrors.minQuantity ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D8C28A]/50 text-sm`}
                                />
                                {fieldErrors.minQuantity && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{fieldErrors.minQuantity}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className={`block text-xs uppercase tracking-widest ${fieldErrors.images ? 'text-red-500' : 'text-gray-400'}`}>Imagens do Produto</label>
                                <span className="text-xs text-gray-500">{images.length + newImages.length} fotos total</span>
                            </div>
                            {fieldErrors.images && <p className="text-red-500 text-[10px] mb-2 uppercase tracking-tight">{fieldErrors.images}</p>}

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {images.map((imgUrl, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square bg-black rounded-xl border border-white/10 overflow-hidden group">
                                        <Image src={imgUrl} alt={`Foto ${index + 1}`} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform cursor-pointer"
                                                title="Remover foto"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {newImages.map((img, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square bg-black rounded-xl border border-[#D8C28A]/30 overflow-hidden group">
                                        <Image src={img.previewUrl} alt={`Nova Foto ${index + 1}`} fill className="object-cover opacity-70" />
                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#D8C28A] text-black text-[8px] font-bold uppercase rounded leading-none">Novo</div>
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform cursor-pointer"
                                                title="Remover nova foto"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <label className="relative aspect-square flex flex-col items-center justify-center cursor-pointer bg-black/20 hover:bg-white/[0.04] border border-dashed border-white/20 rounded-xl transition-colors">
                                    {uploading || submitting ? (
                                        <div className="flex flex-col items-center">
                                            <svg className="animate-spin w-6 h-6 text-[#D8C28A] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center px-2">
                                                {uploading ? 'Enviando...' : 'Salvando...'}
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center px-2">Adicionar Foto</span>
                                        </>
                                    )}
                                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading || submitting} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Descrição</label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className={`w-full bg-black/40 border ${fieldErrors.description ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D8C28A]/50 resize-y min-h-[80px] max-h-[200px] text-sm leading-relaxed custom-scrollbar`}
                                placeholder="Material, uso, detalhes..."
                            />
                            {fieldErrors.description && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{fieldErrors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Categoria Principal</label>
                                <CustomSelect
                                    value={categoryId}
                                    onChange={setCategoryId}
                                    options={[
                                        { label: 'Selecione uma categoria...', value: '' },
                                        ...categories.map(cat => ({ label: cat.name, value: cat.id }))
                                    ]}
                                    error={!!fieldErrors.categoryId}
                                    className="w-full"
                                />
                                {fieldErrors.categoryId && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{fieldErrors.categoryId}</p>}
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
                                Tags de Identificação <span className="normal-case text-gray-600">(Enter ou vírgula)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={e => setCurrentTag(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    className={`flex-1 bg-black/40 border ${fieldErrors.tags ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D8C28A]/50 text-sm`}
                                    placeholder="Ex: dourado, 4 pés..."
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition shrink-0 cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                            {fieldErrors.tags && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{fieldErrors.tags}</p>}
                            {tagsList.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {tagsList.map(tag => (
                                        <span
                                            key={tag}
                                            className="flex items-center gap-1 px-2 py-0.5 bg-[#D8C28A]/10 border border-[#D8C28A]/30 text-[#D8C28A] rounded-full text-xs"
                                        >
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors cursor-pointer">
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Especificações Técnicas</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newSpecLabel}
                                    onChange={e => setNewSpecLabel(e.target.value)}
                                    onKeyDown={handleSpecKeyDown}
                                    className={`flex-1 bg-black/40 border ${fieldErrors.specifications ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D8C28A]/50 text-sm`}
                                    placeholder="Rótulo (ex: Peso)"
                                />
                                <input
                                    type="text"
                                    value={newSpecValue}
                                    onChange={e => setNewSpecValue(e.target.value)}
                                    onKeyDown={handleSpecKeyDown}
                                    className={`flex-1 bg-black/40 border ${fieldErrors.specifications ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D8C28A]/50 text-sm`}
                                    placeholder="Valor (ex: 10kg)"
                                />
                                <button
                                    type="button"
                                    onClick={addSpecification}
                                    className="px-4 py-2 bg-[#D8C28A]/10 border border-[#D8C28A]/30 text-[#D8C28A] rounded-lg text-sm hover:bg-[#D8C28A]/20 transition cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>
                            {fieldErrors.specifications && <p className="text-red-500 text-[10px] mb-2 uppercase tracking-tight">{fieldErrors.specifications}</p>}

                            {specifications.length > 0 && (
                                <div className="space-y-2">
                                    {specifications.map((spec, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2 group">
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-gray-500">{spec.label}:</span>
                                                <span className="text-gray-200">{spec.value}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(index)}
                                                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-5 border-t border-white/5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || uploading}
                            className={`px-8 py-2 rounded-lg text-sm font-semibold transition-all ${submitting || uploading
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-[#D8C28A] text-black hover:scale-[1.05] active:scale-95 cursor-pointer'
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
