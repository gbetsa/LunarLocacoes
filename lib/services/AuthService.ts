import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { userRepository } from '../repositories/UserRepository';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado nas variáveis de ambiente');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export class AuthService {
    async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async verifyPassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    async generateToken(payload: any) {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);
    }

    async verifyToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            return payload;
        } catch (error) {
            return null;
        }
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }

        const token = await this.generateToken({
            userId: user.id,
            email: user.email,
            name: user.name
        });

        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 dia
            path: '/'
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name
        };
    }

    async logout() {
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');
    }

    async getCurrentUser() {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return null;

        const payload = await this.verifyToken(token);
        if (!payload) return null;

        return payload;
    }
}

export const authService = new AuthService();
