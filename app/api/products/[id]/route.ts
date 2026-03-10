import { productController } from '@/lib/controllers/ProductController';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    return productController.getById(params.id);
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    return productController.update(request, params.id);
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    return productController.delete(params.id);
}
