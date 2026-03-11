'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WhatsAppContextType {
    whatsappNumber: string;
    getWhatsAppLink: (message?: string) => string;
    loading: boolean;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children, initialWhatsapp }: { children: React.ReactNode, initialWhatsapp?: string }) {
    const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsapp || '');
    const [loading, setLoading] = useState(initialWhatsapp === undefined);

    useEffect(() => {
        if (initialWhatsapp !== undefined) {
            setWhatsappNumber(initialWhatsapp);
            setLoading(false);
        } else {
            setLoading(true);
            fetch('/api/settings')
                .then(res => res.json())
                .then(data => {
                    setWhatsappNumber(data.whatsapp || '');
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching WhatsApp number:', err);
                    setLoading(false);
                });
        }
    }, [initialWhatsapp]);

    const getWhatsAppLink = (message?: string) => {
        const cleanNumber = whatsappNumber.replace(/\D/g, '');
        const finalNumber = cleanNumber.length <= 11 && cleanNumber.length > 0 ? `55${cleanNumber}` : cleanNumber;

        let link = `https://wa.me/${finalNumber}`;
        if (message) {
            link += `?text=${encodeURIComponent(message)}`;
        }
        return link;
    };

    return (
        <WhatsAppContext.Provider value={{ whatsappNumber, getWhatsAppLink, loading }}>
            {children}
        </WhatsAppContext.Provider>
    );
}

export function useWhatsApp() {
    const context = useContext(WhatsAppContext);
    if (context === undefined) {
        throw new Error('useWhatsApp must be used within a WhatsAppProvider');
    }
    return context;
}
