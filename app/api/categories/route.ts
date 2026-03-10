import { categoryController } from '@/lib/controllers/CategoryController';

export async function GET() {
    return categoryController.getAll();
}

export async function POST(request: Request) {
    return categoryController.create(request);
}
