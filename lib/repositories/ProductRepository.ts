import prisma from '@/lib/prisma';
import { Product, Prisma } from '@prisma/client';

export interface ProductFilter {
    category?: string;
    search?: string;
}

export class ProductRepository {
    async findAll(filters: ProductFilter = {}) {
        const { category, search } = filters;
        const where: Prisma.ProductWhereInput = {};

        if (category && category !== 'Todos') {
            where.categories = {
                some: { name: category }
            };
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { tags: { contains: search } }
            ];
        }

        return prisma.product.findMany({
            where,
            include: {
                categories: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: string) {
        return prisma.product.findUnique({
            where: { id },
            include: { categories: true }
        });
    }

    async create(data: Prisma.ProductCreateInput) {
        return prisma.product.create({
            data,
            include: { categories: true }
        });
    }

    async update(id: string, data: Prisma.ProductUpdateInput) {
        return prisma.product.update({
            where: { id },
            data,
            include: { categories: true }
        });
    }

    async delete(id: string) {
        return prisma.product.delete({
            where: { id }
        });
    }
}

export const productRepository = new ProductRepository();
