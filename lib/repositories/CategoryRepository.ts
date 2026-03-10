import prisma from '@/lib/prisma';
import { Category, Prisma } from '@prisma/client';

export class CategoryRepository {
    async findAll() {
        return prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
    }

    async findById(id: string) {
        return prisma.category.findUnique({
            where: { id }
        });
    }

    async findByName(name: string) {
        return prisma.category.findUnique({
            where: { name }
        });
    }

    async create(data: Prisma.CategoryCreateInput) {
        return prisma.category.create({ data });
    }

    async update(id: string, data: Prisma.CategoryUpdateInput) {
        return prisma.category.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return prisma.category.delete({
            where: { id }
        });
    }
}

export const categoryRepository = new CategoryRepository();
