import { NextResponse } from 'next/server';
import { authService } from '../services/AuthService';

export interface AdminUser {
    userId: string;
    email: string;
    name?: string;
}

export class AuthController {
    async login(request: Request) {
        try {
            const { email, password } = await request.json();

            if (!email || !password) {
                return NextResponse.json(
                    { error: 'E-mail e senha são obrigatórios' },
                    { status: 400 }
                );
            }

            const user = await authService.login(email, password);

            return NextResponse.json({
                message: 'Login realizado com sucesso',
                user
            });
        } catch (error: any) {
            console.error('Erro no Login Controller:', error);
            return NextResponse.json(
                { error: error.message || 'Erro ao realizar login' },
                { status: 401 }
            );
        }
    }

    async logout() {
        try {
            await authService.logout();
            return NextResponse.json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            return NextResponse.json(
                { error: 'Erro ao realizar logout' },
                { status: 500 }
            );
        }
    }

    async me() {
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
            }
            return NextResponse.json({ user });
        } catch (error) {
            return NextResponse.json(
                { error: 'Erro ao buscar sessão' },
                { status: 500 }
            );
        }
    }
}

export const authController = new AuthController();
