import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request: NextRequest) {
    // Gerar um nonce dinâmico para o CSP
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: *.public.blob.vercel-storage.com https://wa.me https://*.wa.me;
        font-src 'self' https://fonts.gstatic.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', cspHeader);

    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    
    // Adicionar o cabeçalho na resposta para o navegador
    response.headers.set('Content-Security-Policy', cspHeader);

    const token = request.cookies.get('auth_token')?.value;

    // Rotas da API que precisam de proteção (Modificações)
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
        const isGetRequest = request.method === 'GET';

        // Se não for rota de auth e não for GET, precisa de autenticação
        if (!isAuthRoute && !isGetRequest) {
            if (!token) {
                return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
            }

            try {
                await jwtVerify(token, JWT_SECRET);
                // Retornar a resposta com os headers de segurança
                return response;
            } catch (error) {
                return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
            }
        }
    }

    // Proteção de rotas do painel admin (Frontend) - Exemplo: /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return response;
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

// Configurar as rotas que o proxy deve observar (Matcher Completo)
export const config = {
    matcher: [
        /*
         * Corresponder a todos os caminhos exceto:
         * - _next/static (arquivos estáticos)
         * - _next/image (arquivos de otimização de imagem)
         * - favicon.ico (ícone)
         * - assets (arquivos públicos)
         */
        '/((?!_next/static|_next/image|favicon.ico|assets).*)',
    ],
};
