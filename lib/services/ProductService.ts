import { productRepository, ProductFilter } from '../repositories/ProductRepository';

export class ProductService {
    async getAllProducts(filters: ProductFilter) {
        return productRepository.findAll(filters);
    }

    async getProductById(id: string) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(data: any) {
        const { categoryIds, ...rest } = data;
        return productRepository.create({
            ...rest,
            categories: categoryIds ? {
                connect: categoryIds.map((id: string) => ({ id }))
            } : undefined
        });
    }

    async updateProduct(id: string, data: any) {
        const { categoryIds, ...rest } = data;
        return productRepository.update(id, {
            ...rest,
            categories: categoryIds ? {
                set: categoryIds.map((id: string) => ({ id }))
            } : undefined
        });
    }

    async deleteProduct(id: string) {
        return productRepository.delete(id);
    }
}

export const productService = new ProductService();
