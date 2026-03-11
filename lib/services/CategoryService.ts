import { categoryRepository } from '../repositories/CategoryRepository';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

export class CategoryService {
    async getAllCategories() {
        return unstable_cache(
            async () => categoryRepository.findAll(),
            ['categories-all'],
            { tags: ['categories'] }
        )();
    }

    async getCategoriesWithProducts() {
        return unstable_cache(
            async () => categoryRepository.findWithProducts(),
            ['categories-with-products'],
            { tags: ['categories'] }
        )();
    }

    async getCategoryById(id: string) {
        return categoryRepository.findById(id);
    }

    async createCategory(name: string) {
        const existing = await categoryRepository.findByName(name);
        if (existing) {
            throw new Error('Category already exists');
        }
        const category = await categoryRepository.create({ name });
        revalidateTag('categories', 'default');
        revalidatePath('/', 'layout');
        return category;
    }

    async updateCategory(id: string, name: string) {
        const category = await categoryRepository.update(id, { name });
        revalidateTag('categories', 'default');
        revalidatePath('/', 'layout');
        return category;
    }

    async deleteCategory(id: string) {
        const category = await categoryRepository.delete(id);
        revalidateTag('categories', 'default');
        revalidatePath('/', 'layout');
        return category;
    }
}

export const categoryService = new CategoryService();
