import { NextResponse } from 'next/server';
import { productService } from '../services/ProductService';
import { productSchema } from '../validations/product';

export class ProductController {
    async getAll(request: Request) {
        try {
            const { searchParams } = new URL(request.url);
            const category = searchParams.get('category') || undefined;
            const search = searchParams.get('search') || undefined;

            const products = await productService.getAllProducts({ category, search });
            return NextResponse.json(products);
        } catch (error) {
            return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
        }
    }

    async getById(id: string) {
        try {
            const product = await productService.getProductById(id);
            return NextResponse.json(product);
        } catch (error: any) {
            if (error.message === 'Product not found') {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 });
        }
    }

    async create(request: Request) {
        try {
            const data = await request.json();

            const result = productSchema.safeParse(data);
            if (!result.success) {
                return NextResponse.json({
                    error: 'Dados inválidos',
                    details: result.error.format()
                }, { status: 400 });
            }

            const product = await productService.createProduct(result.data);
            return NextResponse.json(product, { status: 201 });
        } catch (error) {
            console.error('Error creating product:', error);
            return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
        }
    }

    async update(request: Request, id: string) {
        try {
            const data = await request.json();

            const result = productSchema.partial().safeParse(data);
            if (!result.success) {
                return NextResponse.json({
                    error: 'Dados inválidos',
                    details: result.error.format()
                }, { status: 400 });
            }

            const product = await productService.updateProduct(id, result.data);
            return NextResponse.json(product);
        } catch (error) {
            console.error('Error updating product:', error);
            return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
        }
    }

    async delete(id: string) {
        try {
            await productService.deleteProduct(id);
            return new NextResponse(null, { status: 204 });
        } catch (error) {
            return NextResponse.json({ error: 'Erro ao excluir produto' }, { status: 500 });
        }
    }
}

export const productController = new ProductController();
