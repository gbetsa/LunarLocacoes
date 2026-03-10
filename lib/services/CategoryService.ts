import { categoryRepository } from '../repositories/CategoryRepository';

export class CategoryService {
    async getAllCategories() {
        return categoryRepository.findAll();
    }

    async getCategoriesWithProducts() {
        return categoryRepository.findWithProducts();
    }

    async getCategoryById(id: string) {
        return categoryRepository.findById(id);
    }

    async createCategory(name: string) {
        const existing = await categoryRepository.findByName(name);
        if (existing) {
            throw new Error('Category already exists');
        }
        return categoryRepository.create({ name });
    }

    async updateCategory(id: string, name: string) {
        return categoryRepository.update(id, { name });
    }

    async deleteCategory(id: string) {
        return categoryRepository.delete(id);
    }
}

export const categoryService = new CategoryService();
