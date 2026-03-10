import { productRepository, ProductFilter } from '../repositories/ProductRepository';
import { uploadService } from './UploadService';

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
        const { categoryId, tags, images, ...rest } = data;
        return productRepository.create({
            ...rest,
            tags: tags || null,
            images: images || { set: [] },
            category: categoryId ? { connect: { id: categoryId } } : undefined,
        });
    }

    async updateProduct(id: string, data: any) {
        const { categoryId, tags, images, ...rest } = data;

        const updateData: any = { ...rest };

        if ('tags' in data) {
            updateData.tags = tags || null;
        }

        if ('images' in data) {
            updateData.images = { set: images || [] };

            // Apaga do Blob as imagens que foram removidas pelo usuário
            const oldProduct = await productRepository.findById(id);
            if (oldProduct && oldProduct.images) {
                const urlsToDelete = oldProduct.images.filter(url => !images?.includes(url));
                for (const url of urlsToDelete) {
                    await uploadService.deleteImage(url);
                }
            }
        }

        if ('categoryId' in data) {
            updateData.category = categoryId
                ? { connect: { id: categoryId } }
                : { disconnect: true };
        }

        return productRepository.update(id, updateData);
    }

    async deleteProduct(id: string) {
        const product = await productRepository.findById(id);
        if (product && product.images && product.images.length > 0) {
            for (const url of product.images) {
                await uploadService.deleteImage(url);
            }
        }
        return productRepository.delete(id);
    }
}

export const productService = new ProductService();
