'use client';

import React, { useState, useEffect } from 'react';
import { settingsSchema } from '@/lib/validations/settings';
import toast from 'react-hot-toast';

export default function SettingsTab() {
    const [whatsapp, setWhatsapp] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setWhatsapp(formatWhatsApp(data.whatsapp || ''));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatWhatsApp = (value: string) => {
        if (!value) return '';
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return `(${numbers}`;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatWhatsApp(e.target.value);
        setWhatsapp(formatted);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const result = settingsSchema.safeParse({ whatsapp });
        if (!result.success) {
            setMessage({ type: 'error', text: result.error.issues[0].message });
            return;
        }

        setSaving(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatsapp }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
                toast.success('Configurações salvas com sucesso!');
            } else {
                setMessage({ type: 'error', text: 'Erro ao salvar configurações.' });
                toast.error('Erro ao salvar configurações.');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão.' });
            toast.error('Erro de conexão ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D8C28A]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#D8C28A]/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#D8C28A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Configurações Gerais</h2>
                            <p className="text-sm text-gray-500">Gerencie as informações globais da plataforma.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                WhatsApp Principal
                            </label>
                            <input
                                type="text"
                                value={whatsapp}
                                onChange={handleWhatsAppChange}
                                placeholder="Ex: (11) 99151-1233"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8C28A]/50 transition-all text-sm"
                            />
                            <p className="mt-2 text-xs text-gray-600 italic">
                                Este número será usado em todos os botões de contato da plataforma.
                            </p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3 bg-[#D8C28A] text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-b-black rounded-full animate-spin"></div>
                                    Salvando...
                                </>
                            ) : 'Salvar Alterações'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
