import { categoryController } from '@/lib/controllers/CategoryController';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return categoryController.update(request, id);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return categoryController.delete(id);
}
