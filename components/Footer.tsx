import React from 'react';
import { useWhatsApp } from '@/context/WhatsAppContext';

export default function Footer() {
    const { whatsappNumber, getWhatsAppLink } = useWhatsApp();

    return (
        <footer className="w-full text-white" style={{ background: '#001529', paddingTop: '4rem', paddingBottom: '2.5rem' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 text-center md:text-left">
                    {/* Marca e Slogan */}
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <h3 className="text-lg font-bold" style={{ color: '#D8C28A' }}>Lunar Locações</h3>
                        <div className="flex flex-col gap-1.5 opacity-90 text-sm">
                            <p>Qualidade e confiança em cada locação</p>
                            <p>Equipamentos e serviços de qualidade para todas as suas necessidades</p>
                        </div>
                    </div>

                    {/* Informações de Contato */}
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <h3 className="text-lg font-bold" style={{ color: '#D8C28A' }}>Contato</h3>
                        <div className="flex flex-col gap-1.5 opacity-90 text-sm">
                            <p>Email: contato@lunarlocacoes.com.br</p>
                            {whatsappNumber && (
                                <a
                                    href={getWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-yellow-500 transition-colors cursor-pointer"
                                >
                                    WhatsApp: {whatsappNumber}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Horários */}
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <h3 className="text-lg font-bold" style={{ color: '#D8C28A' }}>Horário de Atendimento</h3>
                        <div className="flex flex-col gap-1.5 opacity-90 text-sm">
                            <p>Segunda a Sexta: 9h às 18h</p>
                            <p>Sábado: 9h às 13h</p>
                            <p>Domingo: Fechado</p>
                        </div>
                    </div>
                </div>

                {/* Rodapé inferior */}
                <div className="mt-16 pt-8 border-t border-white/10 text-center">
                    <p className="text-xs opacity-70">
                        &copy; 2026 Lunar Locações. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
