import { productRepository, ProductFilter } from '../repositories/ProductRepository';
import { uploadService } from './UploadService';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

export class ProductService {
    async getAllProducts(filters: ProductFilter = {}) {
        return unstable_cache(
            async () => productRepository.findAll(filters),
            [`products-${JSON.stringify(filters)}`],
            { tags: ['products'] }
        )();
    }

    async getProductById(id: string) {
        return unstable_cache(
            async () => {
                const product = await productRepository.findById(id);
                if (!product) {
                    throw new Error('Product not found');
                }
                return product;
            },
            [`product-${id}`],
            { tags: ['products', `product-${id}`] }
        )();
    }

    async createProduct(data: any) {
        const { categoryId, tags, images, ...rest } = data;
        const product = await productRepository.create({
            ...rest,
            tags: tags || null,
            images: images || { set: [] },
            specifications: data.specifications || [],
            category: categoryId ? { connect: { id: categoryId } } : undefined,
        });
        revalidateTag('products', 'default');
        revalidatePath('/', 'layout');
        return product;
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

        if ('specifications' in data) {
            updateData.specifications = data.specifications || [];
        }

        const updated = await productRepository.update(id, updateData);
        revalidateTag('products', 'default');
        revalidatePath('/', 'layout');
        return updated;
    }

    async deleteProduct(id: string) {
        const product = await productRepository.findById(id);
        if (product && product.images && product.images.length > 0) {
            for (const url of product.images) {
                await uploadService.deleteImage(url);
            }
        }
        const deleted = await productRepository.delete(id);
        revalidateTag('products', 'default');
        revalidatePath('/', 'layout');
        return deleted;
    }
}

export const productService = new ProductService();
