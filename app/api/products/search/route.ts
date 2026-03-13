import { NextResponse } from 'next/server';
import { productRepository } from '@/lib/repositories/ProductRepository';

// Rota dedicada para busca ao vivo no Navbar (sem cache, para resultados sempre atuais)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        if (!search.trim()) {
            return NextResponse.json([]);
        }

        const products = await productRepository.findAll({ search });
        // Retornar apenas os campos necessários para o dropdown
        const results = products.slice(0, 5).map((p) => ({
            id: p.id,
            name: p.name,
            images: p.images,
            category: p.category ? { name: p.category.name } : null,
        }));

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
    }
}
