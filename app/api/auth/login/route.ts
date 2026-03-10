import { authController } from '@/lib/controllers/AuthController';

export async function POST(request: Request) {
    return authController.login(request);
}
