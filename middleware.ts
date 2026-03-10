import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'lunar-locacoes-secret-key-12345'
);

export async function middleware(request: NextRequest) {
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
                return NextResponse.next();
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
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Configurar as rotas que o middleware deve observar
export const config = {
    matcher: ['/api/:path*', '/admin/:path*'],
};
