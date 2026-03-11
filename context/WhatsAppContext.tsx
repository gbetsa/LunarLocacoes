'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
    whatsappNumber: string;
    email: string;
    getWhatsAppLink: (number?: string, message?: string) => string;
    refreshSettings: () => Promise<{ whatsapp: string, email: string }>;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children, initialWhatsapp, initialEmail }: { children: React.ReactNode, initialWhatsapp?: string, initialEmail?: string }) {
    const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsapp || '');
    const [email, setEmail] = useState(initialEmail || '');
    const [loading, setLoading] = useState(initialWhatsapp === undefined && initialEmail === undefined);

    const fetchLatest = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            const newWhatsapp = data.whatsapp || '';
            const newEmail = data.email || '';
            setWhatsappNumber(newWhatsapp);
            setEmail(newEmail);
            return { whatsapp: newWhatsapp, email: newEmail };
        } catch (err) {
            console.error('Error refreshing settings:', err);
            return { whatsapp: whatsappNumber, email: email };
        }
    };

    useEffect(() => {
        if (initialWhatsapp !== undefined || initialEmail !== undefined) {
            if (initialWhatsapp !== undefined) setWhatsappNumber(initialWhatsapp);
            if (initialEmail !== undefined) setEmail(initialEmail);
            setLoading(false);
        } else {
            setLoading(true);
            fetchLatest();
        }
    }, [initialWhatsapp, initialEmail]);

    const getWhatsAppLink = (number?: string, message?: string) => {
        const numToUse = number !== undefined ? number : whatsappNumber;
        const cleanNumber = numToUse.replace(/\D/g, '');
        const finalNumber = cleanNumber.length <= 11 && cleanNumber.length > 0 ? `55${cleanNumber}` : cleanNumber;

        let link = `https://wa.me/${finalNumber}`;
        if (message) {
            link += `?text=${encodeURIComponent(message)}`;
        }
        return link;
    };

    return (
        <SettingsContext.Provider value={{
            whatsappNumber,
            email,
            getWhatsAppLink,
            refreshSettings: fetchLatest,
            loading
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
