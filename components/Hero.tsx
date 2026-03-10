export default function Hero() {
    return (
        <section
            className="relative flex flex-col items-center justify-center text-center overflow-hidden"
            style={{ minHeight: '88vh' }}
        >
            {/* ── Foto de Fundo ── */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `url('/assets/hero-events.jpg')` }}
            />

            {/* ── Filtros de Cor (Azul) ── */}
            {/* Azul profundo base */}
            <div className="absolute inset-0" style={{ background: 'rgba(8, 28, 90, 0.72)' }} />
            {/* Vinheta: bordas mais escuras */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(4, 14, 50, 0.65) 100%)'
            }} />
            {/* Degradê superior para leitura do menu */}
            <div className="absolute inset-x-0 top-0 h-40" style={{
                background: 'linear-gradient(to bottom, rgba(4, 14, 50, 0.6), transparent)'
            }} />
            {/* Degradê inferior para mesclar com a busca */}
            <div className="absolute inset-x-0 bottom-0 h-48" style={{
                background: 'linear-gradient(to top, rgba(4, 14, 50, 0.85), transparent)'
            }} />

            {/* ── Pontos de Brilho Ambiente ── */}
            <div className="absolute pointer-events-none" style={{
                top: '20%', left: '10%',
                width: 500, height: 500,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)',
                filter: 'blur(40px)',
            }} />
            <div className="absolute pointer-events-none" style={{
                bottom: '15%', right: '8%',
                width: 420, height: 420,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(30, 58, 138, 0.25) 0%, transparent 70%)',
                filter: 'blur(50px)',
            }} />

            {/* ── Conteúdo Principal ── */}
            <div className="relative z-10 flex flex-col items-center gap-7 px-6 pt-36 pb-36 max-w-4xl w-full mx-auto">

                {/* Selo de Destaque */}
                <div
                    className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{
                        background: 'linear-gradient(135deg, #D8C28A, #ede0b5)',
                        color: '#2a1e00',
                        boxShadow: '0 2px 20px rgba(200, 162, 39, 0.45)',
                        letterSpacing: '0.13em',
                    }}
                >
                    <span>✦</span>
                    Experiência que faz diferença
                    <span>✦</span>
                </div>

                {/* Título Principal */}
                <h1
                    className="font-extrabold leading-[1.12] tracking-tight"
                    style={{
                        fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                        color: '#fff',
                        textShadow: '0 4px 32px rgba(0,0,0,0.5)',
                    }}
                >
                    Transforme Suas Necessidades Em
                    <br />
                    <span
                        style={{
                            background: 'linear-gradient(90deg, #D8C28A, #ede0b5, #c5a96b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Soluções de Locação Imediata
                    </span>
                </h1>

                {/* Linha Divisória */}
                <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(216,194,138,0.65), transparent)' }} />

                {/* Subtexto */}
                <p
                    className="text-base md:text-lg max-w-2xl leading-relaxed"
                    style={{ color: 'rgba(220, 232, 255, 0.85)' }}
                >
                    Equipamentos, mobiliários e itens diversos para locação com
                    qualidade, rapidez e praticidade.
                </p>

            </div>

        </section>
    );
}
