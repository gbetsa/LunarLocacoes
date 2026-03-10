import { productController } from '@/lib/controllers/ProductController';

export async function GET(request: Request) {
    return productController.getAll(request);
}

export async function POST(request: Request) {
    return productController.create(request);
}
