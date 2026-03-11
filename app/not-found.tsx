'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-20 h-20 animate-pulse">
            <Image
              src="/assets/lunar-logo.png"
              alt="Lunar Locações Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-bold text-white/10 mb-[-40px] md:mb-[-60px] select-none">
          404
        </h1>

        {/* Content Card */}
        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 backdrop-blur-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Página não encontrada
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Parece que você se perdeu no espaço. A página que você está procurando não existe ou foi movida.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-primary-hover text-background font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Voltar para Início
            </Link>
            
            <a
              href="https://wa.me/5511999999999" // TODO: Fetch from WhatsAppProvider if possible, or leave as generic contact
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 glass text-white hover:bg-white/10 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Suporte
            </a>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-12 text-white/30 text-sm">
          &copy; {new Date().getFullYear()} Lunar Locações. Todos os direitos reservados.
        </p>
      </div>

      {/* Styles to ensure compatibility if globals.css is not enough */}
      <style jsx>{`
        .bg-gold {
          background-color: #D8C28A;
        }
        .text-gold {
          color: #D8C28A;
        }
      `}</style>
    </main>
  );
}
