import { categoryController } from '@/lib/controllers/CategoryController';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    return categoryController.update(request, params.id);
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    return categoryController.delete(params.id);
}
