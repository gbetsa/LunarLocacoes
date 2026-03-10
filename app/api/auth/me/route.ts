import { authController } from '@/lib/controllers/AuthController';

export async function GET() {
    return authController.me();
}
