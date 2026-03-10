import { NextResponse } from 'next/server';
import { categoryService } from '../services/CategoryService';

export class CategoryController {
    async getAll() {
        try {
            const categories = await categoryService.getAllCategories();
            return NextResponse.json(categories);
        } catch (error) {
            return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
        }
    }

    async create(request: Request) {
        try {
            const { name } = await request.json();
            if (!name) {
                return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
            }
            const category = await categoryService.createCategory(name);
            return NextResponse.json(category, { status: 201 });
        } catch (error: any) {
            if (error.message === 'Category already exists') {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
        }
    }

    async update(request: Request, id: string) {
        try {
            const { name } = await request.json();
            if (!name) {
                return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
            }
            const category = await categoryService.updateCategory(id, name);
            return NextResponse.json(category);
        } catch (error) {
            return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 });
        }
    }

    async delete(id: string) {
        try {
            await categoryService.deleteCategory(id);
            return new NextResponse(null, { status: 204 });
        } catch (error) {
            return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 });
        }
    }
}

export const categoryController = new CategoryController();
