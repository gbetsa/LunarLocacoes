import prisma from '@/lib/prisma';
import { Product, Prisma } from '@prisma/client';

export interface ProductFilter {
    category?: string;
    search?: string;
    available?: boolean;
    images?: string[];
    categoryId?: string | null;
}

export class ProductRepository {
    async findAll(filters: ProductFilter = {}) {
        const { category, search, available, images, categoryId } = filters;
        const where: Prisma.ProductWhereInput = {};

        if (category && category !== 'Todos') {
            where.category = { name: category };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (available !== undefined) {
            where.available = available;
        }

        if (images !== undefined) {
            where.images = { hasEvery: images };
        }

        if (categoryId !== undefined) {
            where.categoryId = categoryId;
        }

        return prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
    }

    async create(data: Prisma.ProductCreateInput) {
        return prisma.product.create({
            data: {
                ...data,
                images: data.images || { set: [] }
            },
            include: { category: true }
        });
    }

    async update(id: string, data: Prisma.ProductUpdateInput) {
        return prisma.product.update({
            where: { id },
            data: {
                ...data
            },
            include: { category: true }
        });
    }

    async delete(id: string) {
        return prisma.product.delete({
            where: { id }
        });
    }
}

export const productRepository = new ProductRepository();
