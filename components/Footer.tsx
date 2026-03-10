import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full text-white" style={{ background: '#001529', paddingTop: '4rem', paddingBottom: '2.5rem' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">

                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold" style={{ color: '#D8C28A' }}>Lunar Locações</h3>
                        <div className="flex flex-col gap-1.5 opacity-90 text-sm">
                            <p>Qualidade e confiança em cada locação</p>
                            <p>Equipamentos e serviços de qualidade para todas as suas necessidades</p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold" style={{ color: '#D8C28A' }}>Contato</h3>
                        <div className="flex flex-col gap-1.5 opacity-90 text-sm">
                            <p>Email: contato@lunarlocacoes.com.br</p>
                            <a
                                href="https://wa.me/5511963119191"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-yellow-500 transition-colors"
                            >
                                WhatsApp: (11) 96311-9191
                            </a>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold" style={{ color: '#D8C28A' }}>Horário de Atendimento</h3>
                        <div className="flex flex-col gap-1.5 opacity-90 text-sm">
                            <p>Segunda a Sexta: 9h às 18h</p>
                            <p>Sábado: 9h às 13h</p>
                            <p>Domingo: Fechado</p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/10 text-center">
                    <p className="text-xs opacity-70">
                        &copy; 2026 Lunar Locações. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
